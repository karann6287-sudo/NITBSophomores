import pdfData from './data/pdfFiles.json'

export const syllabusUrl = pdfData.syllabus.ee.url

export function getSyllabus(branch) {
  return pdfData.syllabus[branch] ?? null
}

const preferredTermDefinitions = [
  { slug: 'mini-tests', label: 'Mini Tests' },
  { slug: 'mid-terms', label: 'Mid Terms' },
  { slug: 'end-terms', label: 'End Terms' },
  { slug: 'notes', label: 'Notes' },
  { slug: 'assignments', label: 'Assignments' },
  { slug: 'experiments', label: 'Experiments' },
]

function getFiles(branch, semester, subjectSlug, termSlug) {
  return pdfData.subjects.filter(
    (file) =>
      file.branch === branch &&
      file.semester === semester &&
      file.subject === subjectSlug &&
      file.term === termSlug
  )
}

export function getSubjectResourceTerms(
  branch,
  semester,
  subjectSlug
) {
  return preferredTermDefinitions
    .filter(
      (term) =>
        getFiles(
          branch,
          semester,
          subjectSlug,
          term.slug
        ).length > 0
    )
    .map((term) => ({
      slug: term.slug,
      label: term.label,
      title: term.label,
    }))
}

export function getSubjectResourceTerm(
  branch,
  semester,
  subjectSlug,
  termSlug
) {
  const files = getFiles(
    branch,
    semester,
    subjectSlug,
    termSlug
  )

  if (files.length === 0) {
    return null
  }

  const term =
    preferredTermDefinitions.find(
      (t) => t.slug === termSlug
    ) ?? {
      slug: termSlug,
      label: termSlug,
    }

  return {
    slug: term.slug,
    label: term.label,
    title: term.label,
    files: files.map((file) => ({
      fileName: file.title,
      relativePath: `${file.subject}-${file.term}-${file.title}`,
      url: file.url,
    })),
  }
}

export function getSubjectFileTitle(file) {
  return file.fileName
}

export function getSubjectFile(
  branch,
  semester,
  subject,
  term,
  id
) {
  return pdfData.subjects.find(
    (file) =>
      file.branch === branch &&
      file.semester === semester &&
      file.subject === subject &&
      file.term === term &&
      file.id === id
  )
}