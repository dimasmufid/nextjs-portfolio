import Link from 'next/link'
import { getJourneyEntry } from 'app/work/utils'

type JourneyEntriesProps = {
  projectSlug: string
  journeyEntrySlugs: string[]
}

export function JourneyEntries({ projectSlug, journeyEntrySlugs }: JourneyEntriesProps) {
  if (!journeyEntrySlugs || journeyEntrySlugs.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="font-medium text-xl mb-6 tracking-tighter">Journey Entries</h2>
      <div className="grid gap-4">
        {journeyEntrySlugs.map((entrySlug) => {
          const entry = getJourneyEntry(projectSlug, entrySlug)
          if (!entry) return null

          return (
            <Link
              key={entrySlug}
              href={`/work/${projectSlug}/journey/${entrySlug}`}
              className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                  {entry.metadata.title}
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {entry.metadata.date}
                </span>
              </div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {entry.metadata.summary}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 