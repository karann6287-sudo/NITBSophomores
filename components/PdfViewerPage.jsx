import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSubjectResourceTerm } from '../src/resourceLibrary.js'
import { branchData } from '../src/data/branchData.js'
import PdfViewer from '../src/components/PdfViewer.jsx'

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractGoogleDriveFileId(rawUrl) {
  try {
    const parsedUrl = new URL(rawUrl)

    if (parsedUrl.hostname !== 'drive.google.com') {
      return null
    }

    let fileId = null

    if (parsedUrl.pathname.startsWith('/file/d/')) {
      fileId = parsedUrl.pathname.split('/')[3] || null
    } else if (
      parsedUrl.pathname === '/open' ||
      parsedUrl.pathname === '/uc'
    ) {
      fileId = parsedUrl.searchParams.get('id')
    }

    if (
      !fileId ||
      !/^[A-Za-z0-9_-]+$/.test(fileId)
    ) {
      return null
    }

    return fileId
  } catch {
    return null
  }
}

export default function PdfViewerPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
    termSlug,
    fileIndex,
  } = useParams()

  /*
   * Find the subject from branchData.
   *
   * branchData is now the source of truth for subjects.
   */
  const subject = useMemo(() => {
    const branchInfo = branchData[branch]

    if (!branchInfo) {
      return null
    }

    const subjects =
      branchInfo.semesters?.[semester] || []

    const subjectName = subjects.find(
      (name) => makeSlug(name) === subjectSlug
    )

    if (!subjectName) {
      return null
    }

    return {
      title: subjectName,
      kind: subjectName
        .toLowerCase()
        .includes('lab')
        ? 'lab'
        : 'regular',
    }
  }, [branch, semester, subjectSlug])

  /*
   * Find the selected resource folder.
   */
  const term = useMemo(() => {
    if (!subject) {
      return null
    }

    return getSubjectResourceTerm(
      branch,
      semester,
      subjectSlug,
      termSlug
    )
  }, [
    branch,
    semester,
    subjectSlug,
    termSlug,
    subject,
  ])

  /*
   * Folder / subject doesn't exist.
   */
  if (!subject || !term) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center px-6 ${
          isDark
            ? 'bg-slate-900 text-slate-100'
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div
          className={`rounded-3xl border p-8 text-center ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          <h1 className="text-2xl font-bold">
            Folder not found
          </h1>

          <Link
            to={`/subjects/${branch}/${semester}/${subjectSlug}`}
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-500"
          >
            Back to subject
          </Link>
        </div>
      </main>
    )
  }

  /*
   * The URL contains the file's index inside the
   * resource folder.
   */
  const index = Number(fileIndex)

  const file = term.files?.[index]

  /*
   * PDF doesn't exist.
   */
  if (!file) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center px-6 ${
          isDark
            ? 'bg-slate-900 text-slate-100'
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div
          className={`rounded-3xl border p-8 text-center ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          <h1 className="text-2xl font-bold">
            PDF not found
          </h1>

          <Link
            to={`/subjects/${branch}/${semester}/${subjectSlug}/${termSlug}`}
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-500"
          >
            Back to resources
          </Link>
        </div>
      </main>
    )
  }

  const fileId = extractGoogleDriveFileId(file.url)
  const proxyUrl = fileId
    ? `/.netlify/functions/pdf?id=${encodeURIComponent(fileId)}`
    : null

  if (!proxyUrl) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center px-6 ${
          isDark
            ? 'bg-slate-900 text-slate-100'
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div
          className={`rounded-3xl border p-8 text-center ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          <h1 className="text-2xl font-bold">Invalid PDF URL</h1>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`min-h-screen ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <PdfViewer
        key={proxyUrl}
        url={proxyUrl}
        title={file.fileName}
        theme={theme}
      />
    </main>
  )
}