import fs from 'fs'
import path from 'path'

type WorkMetadata = {
  title: string
  summary: string
  status: 'ongoing' | 'completed'
  startedAt: string
  completedAt?: string
  tags?: string[]
  image?: string
  journeyEntries?: string[] // Array of journey entry slugs
}

type JourneyEntryMetadata = {
  title: string
  summary: string
  date: string
  image?: string
}

function parseFrontmatter<T>(fileContent: string, type: 'work' | 'journey') {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<T> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    
    // Handle arrays (tags and journeyEntries)
    if (type === 'work' && (key.trim() === 'tags' || key.trim() === 'journeyEntries')) {
      metadata[key.trim() as keyof T] = value
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(item => item.trim()) as any
    } else {
      metadata[key.trim() as keyof T] = value as any
    }
  })

  return { metadata: metadata as T, content }
}

function getMarkdownFiles(dir: string) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((file) => {
    const ext = path.extname(file)
    return ext === '.mdx' || ext === '.md'
  })
}

function readMarkdownFile<T>(filePath: string, type: 'work' | 'journey') {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter<T>(rawContent, type)
}

function getMarkdownData<T>(dir: string, type: 'work' | 'journey') {
  let markdownFiles = getMarkdownFiles(dir)
  return markdownFiles.map((file) => {
    let { metadata, content } = readMarkdownFile<T>(path.join(dir, file), type)
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getWorkProjects() {
  const projectsDir = path.join(process.cwd(), 'app', 'work', 'projects')
  const projects = getMarkdownData<WorkMetadata>(projectsDir, 'work')

  return projects.map(project => {
    // Get the project directory path
    const projectDir = path.join(projectsDir, project.slug)
    
    // If the project directory exists, scan for journey entries
    if (fs.existsSync(projectDir)) {
      const files = fs.readdirSync(projectDir)
      const journeyEntries = files
        .filter(file => {
          const ext = path.extname(file)
          return (ext === '.mdx' || ext === '.md') && file !== `${project.slug}.mdx` && file !== `${project.slug}.md`
        })
        .map(file => path.basename(file, path.extname(file)))
      
      // Update the project metadata with discovered journey entries
      return {
        ...project,
        metadata: {
          ...project.metadata,
          journeyEntries
        }
      }
    }
    
    return project
  })
}

export function getWorkProject(slug: string) {
  const projects = getWorkProjects()
  return projects.find((project) => project.slug === slug)
}

export function getJourneyEntry(projectSlug: string, entrySlug: string) {
  // Try to find the entry in the project's subdirectory first
  const subDirPath = path.join(process.cwd(), 'app', 'work', 'projects', projectSlug)
  if (fs.existsSync(subDirPath)) {
    // Try both .mdx and .md extensions
    const mdxPath = path.join(subDirPath, `${entrySlug}.mdx`)
    const mdPath = path.join(subDirPath, `${entrySlug}.md`)
    
    if (fs.existsSync(mdxPath)) {
      return readMarkdownFile<JourneyEntryMetadata>(mdxPath, 'journey')
    }
    if (fs.existsSync(mdPath)) {
      return readMarkdownFile<JourneyEntryMetadata>(mdPath, 'journey')
    }
  }

  // If not found, try to find it in the project's directory
  const dirPath = path.join(process.cwd(), 'app', 'work', 'projects', projectSlug)
  if (fs.existsSync(dirPath)) {
    // Try both .mdx and .md extensions
    const mdxPath = path.join(dirPath, `${entrySlug}.mdx`)
    const mdPath = path.join(dirPath, `${entrySlug}.md`)
    
    if (fs.existsSync(mdxPath)) {
      return readMarkdownFile<JourneyEntryMetadata>(mdxPath, 'journey')
    }
    if (fs.existsSync(mdPath)) {
      return readMarkdownFile<JourneyEntryMetadata>(mdPath, 'journey')
    }
  }

  return null
} 