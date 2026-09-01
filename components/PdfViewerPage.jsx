import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSubjectResourceTerm } from '../src/resourceLibrary.js'
import { branchData } from '../src/data/branchData.js'

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
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

  /*
   * Convert Google Drive sharing URL:
   *
   * /view?usp=sharing
   *
   * into:
   *
   * /preview
   */
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
      {/* PDF */}
      <iframe
        title={file.fileName}
        src={previewUrl}
        className="w-full h-[calc(100vh-64px)]"
        allow="autoplay"
      />
    </main>
  )
}