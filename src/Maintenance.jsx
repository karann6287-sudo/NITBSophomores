function Maintenance() {
  return (
    <main className="fixed inset-0 z-[9999] min-h-dvh overflow-hidden bg-[#f6f8fc] px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-violet-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <section className="relative mx-auto flex min-h-full max-w-6xl flex-col items-center justify-center">
        <div className="maintenance-fade mb-7 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur sm:mb-9 sm:text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          </span>
          Scheduled maintenance
        </div>

        <div className="maintenance-float relative mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white bg-white shadow-[0_24px_70px_-24px_rgba(37,99,235,0.38)] sm:h-40 sm:w-40">
          <div className="absolute inset-3 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-violet-50" />
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="relative h-20 w-20 text-blue-600 sm:h-24 sm:w-24"
            fill="none"
          >
            <path
              d="M74 24a23 23 0 0 0-29.8 29.8L28.5 69.5a10.6 10.6 0 1 0 15 15l15.7-15.7A23 23 0 0 0 96 40l-18 18-12-12 18-18A22.9 22.9 0 0 0 74 24Z"
              fill="currentColor"
              fillOpacity=".12"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M36 93h48"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M44 93v8M76 93v8"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="maintenance-fade-delayed max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            We&apos;ll Be Back Soon!
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8">
            Our website is currently undergoing maintenance. We&apos;re working to improve your experience. Please check back later.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Maintenance
