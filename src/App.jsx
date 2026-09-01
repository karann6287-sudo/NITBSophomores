import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import Home from '../components/Home.jsx'
import Footer from '../components/Footer.jsx'
import SubjectPage from '../components/SubjectPage.jsx'
import Syllabus from '../components/Syllabus.jsx'
import OurTeam from '../components/OurTeam.jsx'
import ResourceFolderPage from '../components/ResourceFolderPage.jsx'
import PdfViewerPage from '../components/PdfViewerPage.jsx'

function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme')

    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  const [selectedBranch, setSelectedBranch] = useState(() => {
    const storedBranch = localStorage.getItem('selectedBranch')
    return storedBranch || 'ee'
  })

  useEffect(() => {
    localStorage.setItem('selectedBranch', selectedBranch)
  }, [selectedBranch])

  useEffect(() => {
    localStorage.setItem('theme', theme)

    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark'
    )

    document.body.style.backgroundColor =
      theme === 'dark' ? '#0f172a' : '#f9fafb'

    document.body.style.color =
      theme === 'dark' ? '#e2e8f0' : '#111827'
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'dark' ? 'light' : 'dark'
    )
  }

  return (
    <BrowserRouter>
      <NavBar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        selectedBranch={selectedBranch}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              theme={theme}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />
          }
        />

        {/* All branch syllabi */}
        <Route
          path="/syllabus"
          element={<Syllabus theme={theme} />}
        />

        {/* Our Team */}
        <Route
          path="/our-team"
          element={<OurTeam theme={theme} />}
        />

        {/* Branch → Semester → Subject */}
        <Route
          path="/subjects/:branch/:semester/:subjectSlug"
          element={<SubjectPage theme={theme} />}
        />

        {/* Branch → Semester → Subject → Term */}
        <Route
          path="/subjects/:branch/:semester/:subjectSlug/:termSlug"
          element={<ResourceFolderPage theme={theme} />}
        />

        {/* Branch → Semester → Subject → Term → PDF */}
        <Route
          path="/viewer/:branch/:semester/:subjectSlug/:termSlug/:fileIndex"
          element={<PdfViewerPage theme={theme} />}
        />
      </Routes>

      <Footer theme={theme} />
    </BrowserRouter>
  )
}

export default App