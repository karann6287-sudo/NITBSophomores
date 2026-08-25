import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSubjectResourceTerms } from '../src/resourceLibrary.js'

export const subjectData = {
  semester3: {
    dsa: {
      title: 'DSA',
      kind: 'regular',
    },
    'mathematics-3': {
      title: 'Mathematics 3',
      kind: 'regular',
    },
    emec: {
      title: 'EMEC',
      kind: 'regular',
    },
    emft: {
      title: 'EMFT',
      kind: 'regular',
    },
    'network-analysis': {
      title: 'NETWORK ANALYSIS',
      kind: 'regular',
    },
    'measurement-and-instrumentation': {
      title: 'Measurement and Instrumentation',
      kind: 'regular',
    },
    'instrumentation-lab': {
      title: 'Instrumentation Lab',
      kind: 'lab',
    },
    'emec-lab': {
      title: 'EMEC Lab',
      kind: 'lab',
    },
    'network-lab': {
      title: 'Network Lab',
      kind: 'lab',
    },
  },

  semester4: {
    'mathematics-4': {
      title: 'Mathematics 4',
      kind: 'regular',
    },
    'power-systems': {
      title: 'Power Systems',
      kind: 'regular',
    },
    'electronic-devices-and-systems': {
      title: 'Electronic Devices and Systems',
      kind: 'regular',
    },
    'emec-2': {
      title: 'EMEC-2',
      kind: 'regular',
    },
    'generation-of-electrical-power': {
      title: 'Generation of Electrical Power',
      kind: 'regular',
    },
    'fundamentals-of-entrepreneurship': {
      title: 'Fundamentals of Entrepreneurship',
      kind: 'regular',
    },
    'emec-2-lab': {
      title: 'EMEC-2 LAB',
      kind: 'lab',
    },
    'electronics-lab': {
      title: 'Electronics Lab',
      kind: 'lab',
    },
  },
}

export default function SubjectPage({ theme }) {
  const isDark = theme === 'dark'

  const {
    branch,
    semester,
    subjectSlug,
  } = useParams()

  const subject = useMemo(() => {
    return subjectData[semester]?.[subjectSlug]
  }, [semester, subjectSlug])

  const resourceGroups = useMemo(() => {
    if (!subject) {
      return []
    }

    return getSubjectResourceTerms(
      branch,
      semester,
      subjectSlug
    )
  }, [branch, semester, subject, subjectSlug])

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
                {semester === 'semester3'
                  ? 'Semester 3'
                  : 'Semester 4'}{' '}
                Subject Resources
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
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resourceGroups.map((group) => (
                <Link
                  key={group.slug ?? group.title}
                  to={`/subjects/${branch}/${semester}/${subjectSlug}/${group.slug}`}
                  className={`group rounded-3xl border p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${
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
                      {group.label ?? group.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}