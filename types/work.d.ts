declare module 'app/work/utils' {
  export interface WorkMetadata {
    title: string
    summary: string
    status: 'ongoing' | 'completed'
    startedAt: string
    completedAt?: string
    tags?: string[]
    image?: string
    journeyEntries?: string[]
  }

  export interface JourneyEntryMetadata {
    title: string
    summary: string
    date: string
    image?: string
  }

  export interface WorkProject {
    metadata: WorkMetadata
    slug: string
    content: string
  }

  export interface JourneyEntry {
    metadata: JourneyEntryMetadata
    content: string
  }

  export function getWorkProjects(): WorkProject[]
  export function getWorkProject(slug: string): WorkProject | undefined
  export function getJourneyEntry(projectSlug: string, entrySlug: string): JourneyEntry | null
} 