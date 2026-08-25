import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { subjectData } from './SubjectPage.jsx'
import {
  getSubjectFileTitle,
  getSubjectResourceTerm,
} from '../src/resourceLibrary.js'

export default function ResourceFolderPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
    termSlug,
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
      <main
        className={`min-h-screen px-6 py-16 ${
          isDark
            ? 'bg-slate-900 text-slate-100'
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div
          className={`mx-auto max-w-3xl rounded-3xl border p-8 ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          <h1 className="text-2xl font-semibold">
            Folder not found
          </h1>

          <Link
            to={`/subjects/${branch}/${semester}/${subjectSlug}`}
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white hover:bg-sky-500"
          >
            Back
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      className={`min-h-screen px-6 py-14 ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className={`rounded-3xl border p-8 ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm uppercase tracking-[0.2em] ${
                  isDark
                    ? 'text-sky-300'
                    : 'text-sky-700'
                }`}
              >
                {subject.title}
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                {term.label}
              </h1>
            </div>

            <Link
              to={`/subjects/${branch}/${semester}/${subjectSlug}`}
              className={`rounded-full px-5 py-3 ${
                isDark
                  ? 'bg-slate-900'
                  : 'bg-slate-100'
              }`}
            >
              Back
            </Link>
          </div>

          <div className="mt-10 grid gap-4">
            {term.files.map((file, index) => (
              <Link
                key={index}
                to={`/viewer/${branch}/${semester}/${subjectSlug}/${termSlug}/${index}`}
                className={`rounded-2xl border p-5 transition hover:-translate-y-1 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                {getSubjectFileTitle(file)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}