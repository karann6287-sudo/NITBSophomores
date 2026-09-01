import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSubjectResourceTerms } from '../src/resourceLibrary.js'
import { branchData } from '../src/data/branchData.js'

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/*
 * Compatibility export.
 * Other pages currently import subjectData from this file.
 * It is generated automatically from branchData.
 */
export const subjectData = {}

Object.entries(branchData).forEach(
  ([branchSlug, branch]) => {
    subjectData[branchSlug] = {}

    Object.entries(branch.semesters || {}).forEach(
      ([semester, subjects]) => {
        subjectData[branchSlug][semester] = {}

        subjects.forEach((subjectName) => {
          const slug = makeSlug(subjectName)

          subjectData[branchSlug][semester][slug] = {
            title: subjectName,
            kind: subjectName
              .toLowerCase()
              .includes('lab')
              ? 'lab'
              : 'regular',
          }
        })
      }
    )
  }
)

export default function SubjectPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
  } = useParams()

  const branchInfo = branchData[branch]

  const subject = useMemo(() => {
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
      kind: subjectName.toLowerCase().includes('lab')
        ? 'lab'
        : 'regular',
    }
  }, [branchInfo, semester, subjectSlug])

  const resourceGroups = useMemo(() => {
    if (!subject) {
      return []
    }

    return getSubjectResourceTerms(
      branch,
      semester,
      subjectSlug
    )
  }, [branch, semester, subjectSlug, subject])

  if (!subject) {
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
            Subject not found
          </h1>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-white transition-colors hover:bg-sky-500"
          >
            Go back home
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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className={`text-sm font-medium uppercase tracking-[0.2em] ${
                  isDark
                    ? 'text-sky-300'
                    : 'text-sky-700'
                }`}
              >
                {semesterLabel} Subject Resources
              </p>

              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">
                {subject.title}
              </h1>
            </div>

            <Link
              to="/"
              className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-slate-900 text-slate-100 hover:bg-slate-950'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              Back to home
            </Link>
          </div>

          <section className="mt-10">
            {resourceGroups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resourceGroups.map((group) => (
                  <Link
                    key={group.slug}
                    to={`/subjects/${branch}/${semester}/${subjectSlug}/${group.slug}`}
                    className={`group rounded-3xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                      isDark
                        ? 'border-slate-700 bg-slate-900'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex h-full items-center justify-center rounded-2xl p-6 text-center">
                      <p
                        className={`text-base font-semibold uppercase tracking-[0.24em] ${
                          isDark
                            ? 'text-sky-300'
                            : 'text-sky-700'
                        }`}
                      >
                        {group.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className={`rounded-3xl border p-8 text-center ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-slate-400'
                    : 'border-slate-200 bg-slate-50 text-gray-500'
                }`}
              >
                No resources available yet.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}