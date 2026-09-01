import React from 'react'

export default function OurTeam({ theme }) {
  const isDark = theme === 'dark'

  const credits = [
    { role: 'DEVELOPER', credit: 'KARAN VERMA' },
    { role: 'ASSISTANT', credit: 'KARAN VERMA' },
    { role: 'ASSISTANT TO THE DEVELOPER', credit: 'KARAN VERMA' },
    { role: 'NOT HAVING ENOUGH SLEEP', credit: 'KARAN VERMA' },
    { role: '3 EMOTIONAL BREAKDOWNS', credit: 'KARAN VERMA' },
    { role: 'RECOVERING FROM ALL 3 BREAKDOWNS', credit: 'KARAN VERMA' },
    { role: 'NEVER WANTING TO WORK AGAIN', credit: 'KARAN VERMA' },
    { role: "KARAN VERMA'S TEAM CREDITS", credit: '' },
    { role: 'WRITTEN BY', credit: 'KARAN VERMA' },
    { role: 'STILL ALIVE', credit: 'KARAN VERMA' },
  ]

  return (
    <main
      className={`min-h-screen transition-colors ${
        isDark
          ? 'bg-slate-900 text-slate-100'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <section
        id="our-team"
        className="flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12"
      >
        {/* Heading */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest letter-spacing-2">
            TEAM KARAN VERMA
          </h1>
          <div className={`mt-2 h-0.5 w-20 mx-auto ${
            isDark ? 'bg-slate-700' : 'bg-slate-300'
          }`}></div>
        </div>

        {/* Credits Panel */}
        <div
          className={`w-full max-w-2xl rounded-2xl border backdrop-blur-sm transition-all ${
            isDark
              ? 'bg-slate-800/60 border-slate-700/50 shadow-2xl shadow-black/30'
              : 'bg-white/70 border-slate-200/60 shadow-xl shadow-slate-400/10'
          }`}
        >
          {/* Credits Container */}
          <div className="px-6 md:px-10 py-7 md:py-9">
            <div className="space-y-0">
              {credits.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-2.5 md:py-3 ${
                    index < credits.length - 1 ? (
                      isDark
                        ? 'border-b border-slate-700/40'
                        : 'border-b border-slate-200/50'
                    ) : ''
                  }`}
                >
                  {/* Role - Left Column */}
                  <div
                    className={`flex-1 text-xs md:text-sm font-medium tracking-wide uppercase ${
                      isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.role}
                  </div>

                  {/* Separator Dots */}
                  <div className={`px-3 ${
                    isDark ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    <span className="text-base font-light">·</span>
                  </div>

                  {/* Credit - Right Column */}
                  <div
                    className={`flex-1 text-xs md:text-sm font-semibold tracking-wide text-right uppercase ${
                      isDark
                        ? 'text-slate-100'
                        : 'text-slate-900'
                    }`}
                  >
                    {item.credit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
