import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ProjectForm } from '../components/forms/ProjectForm'
import { StatusBadge } from '../components/StatusBadge'
import { useFocusMode } from '../contexts/FocusModeContext'
import { useCreateProject, useDeleteProject, useProjects } from '../hooks/useDevlogQueries'

export function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const { isFocusMode } = useFocusMode()

  return (
    <section className={`grid gap-6 ${isFocusMode ? 'xl:grid-cols-1' : 'xl:grid-cols-[380px_1fr]'}`}>
      {!isFocusMode && (
        <aside className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Create project</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">Track a repository, feature line, or client build.</p>
          <ProjectForm isSubmitting={createProject.isPending} onSubmit={(payload) => createProject.mutate(payload)} />
        </aside>
      )}
      <div className="grid gap-4">
        <div>
          <h2 className="text-3xl font-black">Projects</h2>
          <p className="text-sm text-slate-500">Active work, paused bets, and shipped milestones.</p>
        </div>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <EmptyState title="No projects yet" message="Create your first project to start logging issues and sessions." />
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <article key={project.id} className="rounded border border-stone-300 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link className="text-lg font-black hover:text-teal-700" to={`/projects/${project.id}`}>
                      {project.name}
                    </Link>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">{project.description || 'No description yet.'}</p>
                  </div>
                  <StatusBadge value={project.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{project._count?.issues ?? 0} issues</span>
                  <span>{project._count?.codingSessions ?? 0} sessions</span>
                  <button className="ml-auto font-bold text-rose-700" onClick={() => deleteProject.mutate(project.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
