import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { branchData } from '../src/data/branchData.js'

export default function Home({
  theme,
  selectedBranch,
  setSelectedBranch,
}) {
  const isDark = theme === 'dark'

  const [selectedSemester, setSelectedSemester] = useState(() => {
    const storedSemester = localStorage.getItem(`semester_${selectedBranch}`)
    return storedSemester || 'semester3'
  })

  useEffect(() => {
    localStorage.setItem(`semester_${selectedBranch}`, selectedSemester)
  }, [selectedSemester, selectedBranch])

  const branch = branchData[selectedBranch]

  const activeSubjects =
    branch?.semesters?.[selectedSemester] || []

  const semesterLabel =
    selectedSemester === 'semester3'
      ? 'Semester 3'
      : 'Semester 4'

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <section
        id="home"
        className="max-w-6xl mx-auto px-6 py-14"
      >
        <div
          className={`rounded-4xl shadow-2xl border p-7 md:p-10 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="mt-5 flex flex-col gap-3">
            <p
              className={`text-base md:text-lg ${
                isDark
                  ? 'text-slate-300'
                  : 'text-gray-600'
              }`}
            >
              Choose your branch and semester.
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              {/* Branch Selector */}
              <div>
                <label
                  htmlFor="branch-select"
                  className={`block text-sm font-medium ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-gray-700'
                  }`}
                >
                  Select Branch
                </label>

                <select
                  id="branch-select"
                  value={selectedBranch}
                  onChange={(event) => {
                    setSelectedBranch(event.target.value)
                    setSelectedSemester('semester3')
                  }}
                  className={`mt-2 w-full md:w-80 rounded-2xl border px-4 py-3.5 shadow-sm outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-600 text-slate-100'
                      : 'bg-white border-slate-300 text-gray-900'
                  }`}
                >
                  {Object.entries(branchData).map(
                    ([slug, branch]) => (
                      <option
                        key={slug}
                        value={slug}
                      >
                        {branch.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Semester Selector */}
              <div>
                <label
                  htmlFor="semester-select"
                  className={`block text-sm font-medium ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-gray-700'
                  }`}
                >
                  Select Semester
                </label>

                <select
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(event) =>
                    setSelectedSemester(
                      event.target.value
                    )
                  }
                  className={`mt-2 w-full md:w-80 rounded-2xl border px-4 py-3.5 shadow-sm outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-600 text-slate-100'
                      : 'bg-white border-slate-300 text-gray-900'
                  }`}
                >
                  <option value="semester3">
                    Semester 3
                  </option>

                  <option value="semester4">
                    Semester 4
                  </option>
                </select>
              </div>

              
            </div>
          </div>

          {/* Subjects */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {activeSubjects.map((subjectName) => {
              const subjectSlug = subjectName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')

              return (
                <Link
                  key={subjectName}
                  to={`/subjects/${selectedBranch}/${selectedSemester}/${subjectSlug}`}
                  className={`group block min-h-37.5 rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold leading-snug">
                          {subjectName}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                        isDark
                          ? 'bg-slate-950/70 text-slate-300'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      <span>
                        Open subject resources
                      </span>

                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Credits - ME Only */}
          {selectedBranch === 'me' && (
            <div className="mt-6 text-right">
              <p
                className={`text-xs md:text-sm ${
                  isDark
                    ? 'text-slate-500'
                    : 'text-gray-500'
                }`}
              >
                Credits - Aashi Patel (NITB'29)
              </p>
            </div>
          )}
        </div>

        {/* Resource Contribution */}
        <div
          className={`mt-12 rounded-3xl border p-6 md:p-8 ${
            isDark
              ? 'border-sky-800/60 bg-sky-950/30'
              : 'border-sky-100 bg-sky-50'
          }`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`rounded-2xl p-3 ${
                  isDark
                    ? 'bg-sky-900/70 text-sky-300'
                    : 'bg-white text-sky-600'
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0 4-4m-4 4-4-4M5 20h14"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-xl font-semibold md:text-2xl">
                  Have Resources for Your Branch?
                </h2>

                <p
                  className={`mt-2 max-w-2xl leading-7 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-gray-600'
                  }`}
                >
                  Help us expand NITBSophomores by sharing
                  useful notes, assignments, previous papers,
                  lab resources, or other study material with
                  your fellow students.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="mailto:pocox3pro859@gmail.com"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-600 px-5 py-3.5 font-medium text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 md:w-auto"
              >
                Share Resources
              </a>

              <p
                className={`mt-2 text-center text-sm ${
                  isDark
                    ? 'text-slate-400'
                    : 'text-gray-500'
                }`}
              >
                Mail us : pocox3pro859@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}