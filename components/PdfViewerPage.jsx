import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { subjectData } from './SubjectPage.jsx'
import { getSubjectResourceTerm } from '../src/resourceLibrary.js'

export default function PdfViewerPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
    termSlug,
    fileIndex,
  } = useParams()

  const subject = useMemo(
    () => subjectData[semester]?.[subjectSlug],
    [semester, subjectSlug]
  )

  const term = useMemo(() => {
    if (!subject) return null

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

  if (!subject || !term) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Folder not found
      </main>
    )
  }

  const index = Number(fileIndex)
  const file = term?.files?.[index]

  if (!file) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        PDF not found
      </main>
    )
  }

  // Convert Google Drive share link to preview link
  const previewUrl = file.url.replace(
    '/view?usp=sharing',
    '/preview'
  )

  return (
    <main
      className={`min-h-screen ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div
        className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark
            ? 'border-slate-700 bg-slate-800'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div>
          <p
            className={`text-sm uppercase tracking-[0.2em] ${
              isDark ? 'text-sky-300' : 'text-sky-700'
            }`}
          >
            {subject.title}
          </p>

          <h1 className="mt-2 text-2xl font-bold">
            {file.fileName}
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/subjects/${branch}/${semester}/${subjectSlug}/${termSlug}`}
            className="rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-500"
          >
            Back
          </Link>

          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-600 px-5 py-3 text-white hover:bg-green-500"
          >
            Open in Drive
          </a>
        </div>
      </div>

      <iframe
        title={file.fileName}
        src={previewUrl}
        className="w-full h-[calc(100vh-88px)]"
        allow="autoplay"
      />
    </main>
  )
}