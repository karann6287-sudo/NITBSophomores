import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'

function PdfViewer({ url, title, theme = 'light' }) {
  const isDark = theme === 'dark'
  const viewerRef = useRef(null)
  const documentAreaRef = useRef(null)
  const pageRefs = useRef({})
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [loadProgress, setLoadProgress] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [readyToLoad, setReadyToLoad] = useState(false)
  const [mediaType, setMediaType] = useState(null)
  const [containerWidth, setContainerWidth] = useState(800)
  const [zoom, setZoom] = useState(1)
  const [fitToWidth, setFitToWidth] = useState(true)

  const source = useMemo(() => {
    if (typeof url !== 'string' || !url) {
      return null
    }

    return url
  }, [url])

  useEffect(() => {
    let secondFrame = null
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setReadyToLoad(true)
      })
    })

    return () => {
      window.cancelAnimationFrame(firstFrame)
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame)
      }
    }
  }, [url])

  useEffect(() => {
    if (!source) {
      return undefined
    }

    const controller = new AbortController()

    fetch(source, {
      method: 'HEAD',
      signal: controller.signal,
    })
      .then((response) => {
        if (response.ok) {
          setMediaType(
            response.headers.get('content-type')?.split(';')[0].trim().toLowerCase() ||
            null
          )
        } else {
          setLoadError(new Error(`PDF response: ${response.status}`))
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setLoadError(error)
        }
      })

    return () => controller.abort()
  }, [source])

  useEffect(() => {
    const area = documentAreaRef.current

    if (!area) {
      return undefined
    }

    const updateWidth = () => setContainerWidth(area.clientWidth)
    updateWidth()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(area)
    return () => observer.disconnect()
  }, [])

  const scrollToPage = useCallback((targetPage) => {
    if (!targetPage) {
      return
    }

    setPageNumber(targetPage)
    const pageElement = pageRefs.current[targetPage]

    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  useEffect(() => {
    if (!numPages) {
      return undefined
    }

    const area = documentAreaRef.current
    if (!area || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    let frame = null
    const observer = new IntersectionObserver(
      () => {
        if (frame !== null) {
          window.cancelAnimationFrame(frame)
        }

        frame = window.requestAnimationFrame(() => {
          const areaRect = area.getBoundingClientRect()
          const areaCenter = areaRect.top + areaRect.height / 2
          let nearestPage = 1
          let nearestDistance = Number.POSITIVE_INFINITY

          for (let index = 1; index <= numPages; index += 1) {
            const element = pageRefs.current[index]
            if (!element) {
              continue
            }

            const rect = element.getBoundingClientRect()
            const distance = Math.abs(
              rect.top + rect.height / 2 - areaCenter
            )

            if (distance < nearestDistance) {
              nearestDistance = distance
              nearestPage = index
            }
          }

          setPageNumber((current) =>
            current === nearestPage ? current : nearestPage
          )
        })
      },
      {
        root: area,
        rootMargin: '-15% 0px -15% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    Object.values(pageRefs.current).forEach((element) => {
      observer.observe(element)
    })

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
      observer.disconnect()
    }
  }, [numPages, source])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollToPage(Math.max(1, pageNumber - 1))
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollToPage(numPages ? Math.min(numPages, pageNumber + 1) : pageNumber + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [numPages, pageNumber, scrollToPage])

  const previousPage = useCallback(() => {
    scrollToPage(Math.max(1, pageNumber - 1))
  }, [pageNumber, scrollToPage])

  const nextPage = useCallback(() => {
    scrollToPage(
      numPages ? Math.min(numPages, pageNumber + 1) : pageNumber + 1
    )
  }, [numPages, pageNumber, scrollToPage])

  const fitWidth = useCallback(() => {
    setFitToWidth(true)
  }, [])

  const zoomIn = useCallback(() => {
    setFitToWidth(false)
    setZoom((current) => Math.min(3, current + 0.25))
  }, [])

  const zoomOut = useCallback(() => {
    setFitToWidth(false)
    setZoom((current) => Math.max(0.5, current - 0.25))
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!viewerRef.current) {
      return
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await viewerRef.current.requestFullscreen()
      }
    } catch {
      // Fullscreen can be unavailable in embedded contexts.
    }
  }, [])

  const preventContextMenu = useCallback((event) => {
    event.preventDefault()
  }, [])

  const retryLoading = useCallback(() => {
    setReadyToLoad(false)
    setPageNumber(1)
    setNumPages(null)
    setLoadError(null)
    setLoadProgress(null)
    setRetryKey((current) => current + 1)

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setReadyToLoad(true)
      })
    })
  }, [])

  const fittedWidth = Math.max(
    280,
    Math.min(containerWidth - 32, 1200)
  )

  return (
    <section
      ref={viewerRef}
      className={`flex h-[calc(100vh-64px)] min-h-[560px] flex-col overflow-hidden ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
      aria-label={title ? `${title} PDF viewer` : 'PDF viewer'}
    >
      <div
        className={`flex min-h-16 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 md:px-4 ${
          isDark
            ? 'border-slate-700 bg-slate-900'
            : 'border-slate-200 bg-white'
        }`}
      >
        <p className="min-w-0 truncate text-sm font-semibold">
          {title || 'PDF document'}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <button type="button" onClick={previousPage} disabled={pageNumber <= 1} className="pdf-button" aria-label="Previous page">←</button>
          <div className={`min-w-24 rounded-lg px-2 py-2 text-center text-sm tabular-nums ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
            <span className="font-semibold">{pageNumber}</span>
            <span className="mx-1 opacity-60">/</span>
            <span>{numPages || '—'}</span>
          </div>
          <button type="button" onClick={nextPage} disabled={!numPages || pageNumber >= numPages} className="pdf-button" aria-label="Next page">→</button>
          <span className={`mx-1 h-6 w-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <button type="button" onClick={zoomOut} disabled={!fitToWidth && zoom <= 0.5} className="pdf-button" aria-label="Zoom out">−</button>
          <div className={`min-w-16 rounded-lg px-2 py-2 text-center text-sm tabular-nums ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`} aria-live="polite">
            {fitToWidth ? 'Fit' : `${Math.round(zoom * 100)}%`}
          </div>
          <button type="button" onClick={zoomIn} disabled={!fitToWidth && zoom >= 3} className="pdf-button" aria-label="Zoom in">+</button>
          <button type="button" onClick={fitWidth} className="pdf-button" aria-label="Fit to width">Fit</button>
          <button type="button" onClick={toggleFullscreen} className="pdf-button" aria-label="Toggle fullscreen">⛶</button>
        </div>
      </div>

      <div
        ref={documentAreaRef}
        className={`relative flex-1 overflow-auto p-4 md:p-6 ${isDark ? 'bg-slate-950' : 'bg-slate-200/70'}`}
        onContextMenu={preventContextMenu}
      >
        {!source || loadError ? (
          <div className="flex min-h-full items-center justify-center">
            <div className={`max-w-md rounded-2xl border p-6 text-center shadow-xl ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`} role="alert">
              <p className="text-lg font-semibold">Unable to load this PDF</p>
              <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>The document may be unavailable or you may not have permission to access it.</p>
              <button
                type="button"
                onClick={retryLoading}
                className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !readyToLoad ? (
          <div className="flex min-h-full items-center justify-center">
            <div
              className={`flex h-96 w-[min(72vw,720px)] items-center justify-center rounded-2xl border shadow-xl ${
                isDark
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-slate-200 bg-white'
              }`}
              role="status"
              aria-live="polite"
            >
              <div className="px-8 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
                <p className="mt-4 text-sm font-semibold">Loading PDF...</p>
              </div>
            </div>
          </div>
        ) : mediaType?.startsWith('image/') ? (
          <div className="flex min-h-full items-center justify-center overflow-auto">
            <img
              src={source}
              alt={title || 'PYQ image'}
              className="max-h-[calc(100vh-180px)] max-w-full rounded-sm object-contain shadow-2xl"
              onError={() => setLoadError(new Error('Unable to load PYQ image'))}
            />
          </div>
        ) : (
          <div className="flex min-h-full min-w-max justify-center">
            <Document
              key={`${source}-${retryKey}`}
              file={source}
              loading={
                <div className={`flex h-[min(70vh,720px)] w-[min(72vw,720px)] items-center justify-center rounded-2xl border shadow-xl ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'}`} aria-label="Loading PDF">
                  <div className="w-full max-w-sm px-8 text-center" role="status" aria-live="polite">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
                    <p className="mt-4 text-sm font-semibold">Loading PDF...</p>
                    {loadProgress !== null && (
                      <>
                        <div className={`mt-4 h-2 overflow-hidden rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div className="h-full rounded-full bg-sky-600 transition-[width] duration-200" style={{ width: `${loadProgress}%` }} />
                        </div>
                        <p className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{loadProgress}%</p>
                      </>
                    )}
                  </div>
                </div>
              }
              error={null}
              onLoadSuccess={({ numPages: pages }) => {
                setNumPages(pages)
                setLoadError(null)
                setLoadProgress(null)
              }}
              onLoadProgress={({ loaded, total }) => {
                if (total) {
                  setLoadProgress(
                    Math.min(100, Math.round((loaded / total) * 100))
                  )
                }
              }}
              onLoadError={(error) => {
                console.error('Failed to load PDF:', error)
                setLoadError(error)
              }}
              className="mx-auto"
            >
              <div className="flex flex-col items-center gap-6 py-2 md:gap-8">
                {Array.from({ length: numPages || 0 }, (_, index) => {
                  const renderedPage = index + 1

                  return (
                    <div
                      key={renderedPage}
                      ref={(element) => {
                        if (element) {
                          pageRefs.current[renderedPage] = element
                        } else {
                          delete pageRefs.current[renderedPage]
                        }
                      }}
                      data-page-number={renderedPage}
                      className="flex w-full justify-center"
                    >
                      <Page
                        pageNumber={renderedPage}
                        width={fitToWidth ? fittedWidth : undefined}
                        scale={fitToWidth ? undefined : zoom}
                        renderTextLayer
                        renderAnnotationLayer
                        loading={
                          <div
                            className={`flex h-96 w-80 items-center justify-center rounded-sm shadow-xl ${
                              isDark
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                            role="status"
                          >
                            Rendering page {renderedPage}...
                          </div>
                        }
                        className="rounded-sm bg-white shadow-2xl"
                        canvasBackground={isDark ? '#e2e8f0' : '#ffffff'}
                        onContextMenu={preventContextMenu}
                      />
                  </div>
                  )
                })}
              </div>
            </Document>
          </div>
        )}
      </div>

      <style>{`
        .pdf-button {
          display: inline-flex;
          min-width: 2.25rem;
          height: 2.25rem;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          padding: 0 0.65rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: ${isDark ? '#bae6fd' : '#0369a1'};
          background: ${isDark ? '#1e293b' : '#f1f5f9'};
          transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease;
        }
        .pdf-button:hover:not(:disabled) { background: ${isDark ? '#334155' : '#e0f2fe'}; }
        .pdf-button:disabled { cursor: not-allowed; opacity: 0.45; }
        .react-pdf__Page { margin-inline: auto; }
      `}</style>
    </section>
  )
}

export default memo(PdfViewer)
