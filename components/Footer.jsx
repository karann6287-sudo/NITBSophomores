import React from 'react'

const Footer = ({ theme }) => {
  const isDark =
    theme === 'dark' ||
    (typeof window !== 'undefined' &&
      !theme &&
      localStorage.getItem('theme') === 'dark')

  return (
    <footer
      className={`text-white mt-12 ${
        isDark ? 'bg-slate-950' : 'bg-gray-800'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="text-center md:text-left">
          <div>
            © {new Date().getFullYear()} NITBSophomores
          </div>

          <div
            className={`mt-1 text-sm ${
              isDark ? 'text-slate-400' : 'text-gray-400'
            }`}
          >
            Study resources for NITB students
          </div>
        </div>

        <div
          className={`text-sm text-center ${
            isDark ? 'text-slate-300' : 'text-gray-300'
          }`}
        >
          Made with ❤️ by Karan Verma (NITB'29).
        </div>

      </div>
    </footer>
  )
}

export default Footer