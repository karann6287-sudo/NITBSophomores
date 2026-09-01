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
        className="max-w-6xl mx-auto px-6 py-14"
      >
        <div
          className={`rounded-4xl shadow-2xl border p-7 md:p-10 ${
            isDark
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              TEAM KARAN VERMA
            </h1>
          </div>

          {/* Credits Table */}
          <div className="space-y-4">
            {credits.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-2 gap-4 md:gap-8 pb-4 border-b ${
                  isDark
                    ? 'border-slate-700'
                    : 'border-slate-200'
                } ${
                  index === credits.length - 1
                    ? 'border-b-0'
                    : ''
                }`}
              >
                {/* Role */}
                <div
                  className={`text-sm md:text-base font-medium tracking-wide ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-gray-600'
                  }`}
                >
                  {item.role}
                </div>

                {/* Credit */}
                <div className="text-sm md:text-base font-semibold text-right">
                  {item.credit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
