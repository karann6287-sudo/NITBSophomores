import React from 'react'
import { Link } from 'react-router-dom'
import manitLogo from '../assets/MANIGTT.png'

export default function NavBar({
  theme,
  onToggleTheme,
}) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-50 text-white shadow-lg border-b border-white/10 bg-linear-to-r from-slate-950 via-blue-950 to-sky-800">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">

        <div className="flex items-center justify-center md:justify-start space-x-3 w-full md:w-auto">
          <img
            src={manitLogo}
            alt="MANIT"
            className="h-9 w-9 md:h-11 md:w-11 rounded-full object-cover ring-2 ring-white/80 shadow-md shadow-black/20"
          />

          <div className="text-base md:text-lg font-semibold">
            NITBSophomores
          </div>
        </div>

        <nav className="flex items-center justify-center md:justify-end gap-3 md:gap-5 text-sm md:text-base font-medium w-full md:w-auto flex-wrap">

          {/* Home */}
          <Link
            to="/"
            className="transition-colors text-white/90 hover:text-cyan-200"
          >
            Home
          </Link>

          {/* Syllabus */}
          <Link
            to="/syllabus"
            className="transition-colors text-white/90 hover:text-cyan-200"
          >
            Syllabus
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center h-8 w-8 md:h-9 md:w-9 rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 hover:border-white/30"
            aria-label={
              isDark
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              isDark
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 1 0 9 9 9 9 0 1 1-9-9z" />
              </svg>
            )}
          </button>

        </nav>
      </div>
    </header>
  )
}