import React from 'react'
import { Link } from 'react-router-dom'
import pdfData from '../src/data/pdfFiles.json'

export default function Syllabus({ theme }) {
  const isDark = theme === 'dark'

  const syllabi = pdfData.syllabus || {}

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div
          className={`rounded-4xl shadow-2xl border p-7 md:p-10 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Syllabus
              </h1>

              <p
                className={`mt-2 text-sm md:text-base leading-6 ${
                  isDark
                    ? 'text-slate-400'
                    : 'text-gray-500'
                }`}
              >
                Choose your branch to access its latest syllabus.
              </p>
            </div>

            {/* Back to Home */}
            <Link
              to="/"
              className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-medium transition ${
                isDark
                  ? 'bg-slate-900 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ← Back to Home
            </Link>
          </div>

          {/* Syllabus Cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(syllabi).map(
              ([branchSlug, syllabus]) => (
                <div
                  key={branchSlug}
                  className={`group block min-h-37.5 rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex h-full flex-col justify-between gap-4">

                    {/* Syllabus Title */}
                    <div>
                      <h3 className="text-lg font-semibold leading-snug">
                        {syllabus.title}
                      </h3>
                    </div>

                    {/* Open Syllabus */}
                    <a
                      href={syllabus.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                        isDark
                          ? 'bg-slate-950/70 text-slate-300'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      <span>
                        Open syllabus
                      </span>

                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  )
}