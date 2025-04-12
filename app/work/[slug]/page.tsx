import { getWorkProject } from '../utils'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { JourneyEntries } from 'app/components/work/JourneyEntries'

type PageParams = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageParams) {
  const project = getWorkProject(params.slug)
  if (!project) return {}

  return {
    title: project.metadata.title,
    description: project.metadata.summary,
  }
}

export default async function Page({ params }: PageParams) {
  const project = getWorkProject(params.slug)
  if (!project) notFound()

  // At this point, project is guaranteed to be non-null
  const { metadata, content } = project

  return (
    <article className="prose dark:prose-invert">
      <header className="mb-8">
        <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
          {metadata.title}
        </h1>
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <span>Started: {metadata.startedAt}</span>
          {metadata.completedAt && (
            <span>Completed: {metadata.completedAt}</span>
          )}
        </div>
        {metadata.tags && (
          <div className="mt-4 flex gap-2">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <MDXRemote source={content} />
      
      {/* Journey Entries Section */}
      {metadata.journeyEntries && metadata.journeyEntries.length > 0 && (
        <JourneyEntries 
          projectSlug={params.slug} 
          journeyEntrySlugs={metadata.journeyEntries} 
        />
      )}
    </article>
  )
} 