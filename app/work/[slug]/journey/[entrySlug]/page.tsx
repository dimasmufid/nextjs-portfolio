import { getJourneyEntry } from '../../../utils'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

type PageParams = {
  params: {
    slug: string
    entrySlug: string
  }
}

export async function generateMetadata({ params }: PageParams) {
  const entry = getJourneyEntry(params.slug, params.entrySlug)
  if (!entry) return {}

  return {
    title: `${entry.metadata.title} - Journey Entry`,
    description: entry.metadata.summary,
  }
}

export default async function Page({ params }: PageParams) {
  const entry = getJourneyEntry(params.slug, params.entrySlug)
  if (!entry) notFound()

  // At this point, entry is guaranteed to be non-null
  const { metadata, content } = entry

  return (
    <article className="prose dark:prose-invert">
      <header className="mb-8">
        <Link
          href={`/work/${params.slug}`}
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← Back to Project
        </Link>
        <h1 className="font-semibold text-2xl mb-2 tracking-tighter">
          {metadata.title}
        </h1>
        <div className="text-neutral-600 dark:text-neutral-400">
          <time>{metadata.date}</time>
        </div>
      </header>
      <MDXRemote source={content} />
    </article>
  )
} 