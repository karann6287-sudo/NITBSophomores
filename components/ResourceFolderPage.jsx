import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getSubjectResourceTerm,
} from '../src/resourceLibrary.js'
import { branchData } from '../src/data/branchData.js'

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ResourceFolderPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
    termSlug,
  } = useParams()

  const subject = useMemo(() => {
    const branchInfo = branchData[branch]

    if (!branchInfo) {
      return null
    }

    const subjects =
      branchInfo.semesters?.[semester] || []

    return (
      subjects.find(
        (name) => makeSlug(name) === subjectSlug
      ) || null
    )
  }, [branch, semester, subjectSlug])

  const resourceTerm = useMemo(() => {
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

  if (!subject || !resourceTerm) {
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
            Resource folder not found
          </h1>

          <Link
            to={`/subjects/${branch}/${semester}/${subjectSlug}`}
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white transition-colors hover:bg-sky-500"
          >
            Back to subject
          </Link>
        </div>
      </main>
    )
  }

  const semesterLabel =
    semester === 'semester3'
      ? 'Semester 3'
      : semester === 'semester4'
        ? 'Semester 4'
        : semester

  return (
    <main
      className={`min-h-screen px-6 py-14 transition-colors ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className={`rounded-4xl border p-8 md:p-10 shadow-2xl ${
            isDark
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-200 bg-white'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className={`text-sm font-medium uppercase tracking-[0.2em] ${
                  isDark
                    ? 'text-sky-300'
                    : 'text-sky-700'
                }`}
              >
                {semesterLabel}
              </p>

              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                {subject}
              </h1>

              <p
                className={`mt-3 text-lg ${
                  isDark
                    ? 'text-slate-300'
                    : 'text-gray-600'
                }`}
              >
                {resourceTerm.title}
              </p>
            </div>

            <Link
              to={`/subjects/${branch}/${semester}/${subjectSlug}`}
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-slate-900 text-slate-100 hover:bg-slate-950'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              Back to subject
            </Link>
          </div>

          {/* Files */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {resourceTerm.files.map((file, index) => (
              <Link
                key={`${file.url}-${index}`}
                to={`/viewer/${branch}/${semester}/${subjectSlug}/${termSlug}/${index}`}
                className={`group rounded-3xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                  isDark
                    ? 'border-slate-700 bg-slate-900'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {file.fileName}
                    </h2>

                    <p
                      className={`mt-1 text-sm ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-gray-500'
                      }`}
                    >
                      Open PDF
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-xl transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}