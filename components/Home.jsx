import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home({ theme }) {
  const isDark = theme === 'dark'
  const [selectedSemester, setSelectedSemester] = useState('semester3')

  const branch = 'ee'

  const semesterSubjects = useMemo(
    () => ({
      semester3: [
        'DSA',
        'Mathematics 3',
        'EMEC',
        'EMFT',
        'NETWORK ANALYSIS',
        'Measurement and Instrumentation',
        'Instrumentation Lab',
        'EMEC Lab',
        'Network Lab',
      ],
      semester4: [
        'Mathematics 4',
        'Power Systems',
        'Electronic Devices and Systems',
        'EMEC-2',
        'Generation of Electrical Power',
        'Fundamentals of Entrepreneurship',
        'EMEC-2 LAB',
        'Electronics Lab',
      ],
    }),
    []
  )

  const activeSubjects = semesterSubjects[selectedSemester]
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
      <section id="home" className="max-w-6xl mx-auto px-6 py-14">
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
                isDark ? 'text-slate-300' : 'text-gray-600'
              }`}
            >
              Choose your semester.
            </p>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <label
                  htmlFor="semester-select"
                  className={`block text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-gray-700'
                  }`}
                >
                  Select Semester
                </label>

                <select
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(event) =>
                    setSelectedSemester(event.target.value)
                  }
                  className={`mt-2 w-full md:w-80 rounded-2xl border px-4 py-3.5 shadow-sm outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-600 text-slate-100'
                      : 'bg-white border-slate-300 text-gray-900'
                  }`}
                >
                  <option value="semester3">Semester 3</option>
                  <option value="semester4">Semester 4</option>
                </select>
              </div>

              <div
                className={`rounded-2xl px-5 py-3.5 text-sm md:text-base ${
                  isDark
                    ? 'bg-slate-900 text-slate-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                Showing {activeSubjects.length} subjects for{' '}
                {semesterLabel}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {activeSubjects.map((subjectName) => {
              const subjectSlug = subjectName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')

              return (
                <Link
                  key={subjectName}
                  to={`/subjects/${branch}/${selectedSemester}/${subjectSlug}`}
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
                      <span>Open subject resources</span>
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
        </div>
      </section>
    </main>
  )
}