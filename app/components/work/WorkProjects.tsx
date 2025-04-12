import Link from 'next/link'
import { getWorkProjects } from 'app/work/utils'
import { formatDate } from 'app/blog/utils'

export function WorkProjects() {
  const projects = getWorkProjects()
  const ongoingProjects = projects.filter(project => project.metadata.status === 'ongoing')
  const completedProjects = projects.filter(project => project.metadata.status === 'completed')

  return (
    <div className="space-y-12">
      {/* Ongoing Projects Section */}
      <div>
        <h2 className="font-medium text-xl mb-6 tracking-tighter">Ongoing Projects</h2>
        <div className="grid gap-4">
          {ongoingProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                  {project.metadata.title}
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(project.metadata.startedAt)}
                </span>
              </div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {project.metadata.summary}
              </p>
              {project.metadata.tags && (
                <div className="mt-3 flex gap-2">
                  {project.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Completed Projects Section */}
      <div>
        <h2 className="font-medium text-xl mb-6 tracking-tighter">Completed Projects</h2>
        <div className="grid gap-4">
          {completedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group block p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                  {project.metadata.title}
                </h3>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(project.metadata.completedAt || '')}
                </span>
              </div>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {project.metadata.summary}
              </p>
              {project.metadata.tags && (
                <div className="mt-3 flex gap-2">
                  {project.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 