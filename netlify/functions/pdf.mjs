import { GoogleAuth } from 'google-auth-library'
import pdfData from '../../src/data/pdfFiles.json' with { type: 'json' }

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
const DRIVE_ID_PATTERN = /^[A-Za-z0-9_-]+$/
const DRIVE_URL_PATTERN =
  /^https:\/\/drive\.google\.com\/file\/d\/([^/?]+)\/(?:view|edit|preview)(?:\?.*)?$/
const DEFAULT_MAX_BYTES = 50 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function extractDriveFileId(url) {
  if (typeof url !== 'string') {
    return null
  }

  const match = url.match(DRIVE_URL_PATTERN)
  return match?.[1] ?? null
}

function buildAllowlist() {
  const ids = new Set()

  if (Array.isArray(pdfData.subjects)) {
    for (const record of pdfData.subjects) {
      const id = extractDriveFileId(record.url)
      if (id) {
        ids.add(id)
      }
    }
  }

  if (pdfData.syllabus && typeof pdfData.syllabus === 'object') {
    for (const syllabus of Object.values(pdfData.syllabus)) {
      const id = extractDriveFileId(syllabus.url)
      if (id) {
        ids.add(id)
      }
    }
  }

  return ids
}

const allowedFileIds = buildAllowlist()

function jsonResponse(statusCode, message, extraHeaders = {}) {
  return {
    statusCode,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
    body: JSON.stringify({ error: message }),
  }
}

function logLocalPdfError(reason) {
  const isLocal =
    process.env.NETLIFY_DEV === 'true' ||
    process.env.CONTEXT === 'dev'

  if (isLocal) {
    console.error(`[pdf] ${reason}`)
  }
}

function logLocalStage(stage, status) {
  const isLocal =
    process.env.NETLIFY_DEV === 'true' ||
    process.env.CONTEXT === 'dev'

  if (isLocal) {
    const statusText =
      Number.isInteger(status) ? ` status=${status}` : ''
    console.error(`[pdf] stage=${stage}${statusText}`)
  }
}

function parseServiceAccountJson() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (!raw) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON')
  }

  let credentials

  try {
    credentials = JSON.parse(raw)
  } catch {
    try {
      credentials = JSON.parse(
        Buffer.from(raw, 'base64').toString('utf8')
      )
    } catch {
      throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON')
    }
  }

  if (
    typeof credentials.client_email !== 'string' ||
    typeof credentials.private_key !== 'string'
  ) {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON')
  }

  credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
  return credentials
}

function parseRangeHeader(rangeHeader) {
  if (!rangeHeader) {
    return null
  }

  const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader.trim())
  if (!match) {
    return null
  }

  const start = Number(match[1])
  const endText = match[2]
  const end = endText ? Number(endText) : null

  if (!Number.isSafeInteger(start) || start < 0) {
    return null
  }

  if (end !== null && (!Number.isSafeInteger(end) || end < start)) {
    return null
  }

  return { start, end }
}

function isValidContentRange(contentRange) {
  return /^bytes \d+-\d+\/(?:\d+|\*)$/i.test(contentRange || '')
}

function sliceRequestedRange(bytes, range) {
  if (!range || !Number.isSafeInteger(bytes.length)) {
    return null
  }

  const start = Math.min(range.start, bytes.length)
  const end = range.end === null
    ? Math.min(bytes.length - 1, start + 1024 * 1024 - 1)
    : Math.min(range.end, bytes.length - 1)

  if (start > end) {
    return null
  }

  return {
    bytes: bytes.slice(start, end + 1),
    contentRange: `bytes ${start}-${end}/${bytes.length}`,
  }
}

function getMaxBytes() {
  const configured = Number(process.env.PDF_PROXY_MAX_BYTES)
  return Number.isSafeInteger(configured) && configured > 0
    ? configured
    : DEFAULT_MAX_BYTES
}

async function getAccessToken() {
  const credentials = parseServiceAccountJson()
  const auth = new GoogleAuth({
    credentials,
    scopes: [DRIVE_SCOPE],
  })

  return auth.getAccessToken()
}

async function getFileMetadata(fileId, accessToken) {
  const url = new URL(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`
  )
  url.searchParams.set('fields', 'id,name,mimeType,size')
  url.searchParams.set('supportsAllDrives', 'true')

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    return { metadata: null, status: response.status }
  }

  return { metadata: await response.json(), status: response.status }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        Allow: 'GET, HEAD',
        'X-Content-Type-Options': 'nosniff',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return jsonResponse(405, 'Method not allowed', {
      Allow: 'GET, HEAD',
    })
  }

  const fileId = event.queryStringParameters?.id

  if (!fileId || !DRIVE_ID_PATTERN.test(fileId)) {
    return jsonResponse(400, 'Invalid PDF identifier')
  }

  if (!allowedFileIds.has(fileId)) {
    return jsonResponse(404, 'PDF not found')
  }

  let accessToken

  try {
    accessToken = await getAccessToken()
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : 'Authentication failed'

    logLocalStage(
      reason === 'Missing GOOGLE_SERVICE_ACCOUNT_JSON'
        ? 'config-missing'
        : reason === 'Invalid GOOGLE_SERVICE_ACCOUNT_JSON'
          ? 'config-invalid'
          : 'oauth-token'
    )
    logLocalPdfError(reason)
    return jsonResponse(503, 'PDF service unavailable')
  }

  if (!accessToken) {
    logLocalStage('oauth-token')
    return jsonResponse(503, 'PDF service unavailable')
  }

  let metadataResult

  try {
    metadataResult = await getFileMetadata(fileId, accessToken)
  } catch {
    logLocalStage('drive-metadata-network')
    return jsonResponse(502, 'Unable to retrieve PDF')
  }

  if (!metadataResult.metadata) {
    logLocalStage('drive-metadata', metadataResult.status)
  }

  const metadata = metadataResult.metadata

  if (!metadata) {
    return jsonResponse(404, 'PDF not found')
  }

  if (
    metadata.mimeType &&
    metadata.mimeType !== 'application/pdf' &&
    !ALLOWED_IMAGE_TYPES.has(metadata.mimeType)
  ) {
    return jsonResponse(404, 'PDF not found')
  }

  const declaredSize =
    metadata.size && Number.isSafeInteger(Number(metadata.size))
      ? Number(metadata.size)
      : null

  if (declaredSize && declaredSize > getMaxBytes()) {
    return jsonResponse(413, 'PDF exceeds the download size limit')
  }

  if (event.httpMethod === 'HEAD') {
    const contentType =
      metadata.mimeType && (
        metadata.mimeType === 'application/pdf' ||
        ALLOWED_IMAGE_TYPES.has(metadata.mimeType)
      )
        ? metadata.mimeType
        : 'application/pdf'

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'Content-Disposition': 'inline',
      'Accept-Ranges': 'bytes',
    }

    if (metadata.size) {
      headers['Content-Length'] = String(metadata.size)
    }

    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  const rangeHeader =
    event.headers?.range || event.headers?.Range || null
  const range = parseRangeHeader(rangeHeader)

  if (rangeHeader && !range) {
    return jsonResponse(416, 'Invalid byte range')
  }

  const mediaUrl = new URL(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`
  )
  mediaUrl.searchParams.set('alt', 'media')
  mediaUrl.searchParams.set('supportsAllDrives', 'true')

  const upstreamHeaders = {
    Authorization: `Bearer ${accessToken}`,
  }

  if (range) {
    upstreamHeaders.Range =
      `bytes=${range.start}-${range.end ?? ''}`
  }

  let upstream

  try {
    upstream = await fetch(mediaUrl, {
      method: 'GET',
      headers: upstreamHeaders,
      redirect: 'follow',
    })
  } catch {
    logLocalStage('drive-media-network')
    return jsonResponse(502, 'Unable to retrieve PDF')
  }

  if (upstream.status !== 200 && upstream.status !== 206) {
    logLocalStage('drive-media', upstream.status)
  }

  if (upstream.status === 404) {
    return jsonResponse(404, 'PDF not found')
  }

  if (upstream.status === 401 || upstream.status === 403) {
    return jsonResponse(404, 'PDF not found')
  }

  if (upstream.status === 416) {
    return jsonResponse(416, 'Range not satisfiable')
  }

  if (upstream.status !== 200 && upstream.status !== 206) {
    return jsonResponse(502, 'Unable to retrieve PDF')
  }

  let bytes

  try {
    bytes = new Uint8Array(await upstream.arrayBuffer())
  } catch {
    return jsonResponse(502, 'Unable to retrieve PDF')
  }

  if (bytes.length > getMaxBytes()) {
    return jsonResponse(413, 'PDF exceeds the download size limit')
  }

  if (
    upstream.status === 200 &&
    metadata.mimeType === 'application/pdf' &&
    bytes.length >= 5
  ) {
    const prefix = String.fromCharCode(...bytes.slice(0, 5))
    if (prefix !== '%PDF-') {
      return jsonResponse(502, 'Unable to retrieve PDF')
    }
  }

  const contentType =
    metadata.mimeType &&
      (metadata.mimeType === 'application/pdf' ||
        ALLOWED_IMAGE_TYPES.has(metadata.mimeType))
      ? metadata.mimeType
      : upstream.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
        || 'application/pdf'

  const baseHeaders = {
    'Content-Type': contentType,
    'Content-Length': String(bytes.length),
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': 'inline',
    'Accept-Ranges': 'bytes',
  }

  if (
    upstream.status === 206 &&
    isValidContentRange(upstream.headers.get('content-range'))
  ) {
    baseHeaders['Content-Range'] =
      upstream.headers.get('content-range')

    return {
      statusCode: 206,
      isBase64Encoded: true,
      headers: baseHeaders,
      body: Buffer.from(bytes).toString('base64'),
    }
  }

  if (range) {
    const ranged = sliceRequestedRange(bytes, range)

    if (!ranged) {
      return jsonResponse(416, 'Range not satisfiable')
    }

    baseHeaders['Content-Length'] =
      String(ranged.bytes.length)
    baseHeaders['Content-Range'] = ranged.contentRange

    return {
      statusCode: 206,
      isBase64Encoded: true,
      headers: baseHeaders,
      body: Buffer.from(ranged.bytes).toString('base64'),
    }
  }

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: baseHeaders,
    body: Buffer.from(bytes).toString('base64'),
  }
}
