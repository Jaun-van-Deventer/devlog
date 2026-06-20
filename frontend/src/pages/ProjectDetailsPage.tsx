import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ProjectForm } from '../components/forms/ProjectForm'
import { StatusBadge } from '../components/StatusBadge'
import { useFocusMode } from '../contexts/FocusModeContext'
import { useProject, useUpdateProject } from '../hooks/useDevlogQueries'

export function ProjectDetailsPage() {
  const id = Number(useParams().id)
  const { data: project, isLoading } = useProject(id)
  const updateProject = useUpdateProject()
  const { isFocusMode } = useFocusMode()
  const totalHours = useMemo(
    () => project?.codingSessions?.reduce((total, session) => total + session.hours, 0) ?? 0,
    [project?.codingSessions],
  )

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading project...</p>
  }

  if (!project) {
    return <EmptyState title="Project not found" message="The selected project could not be loaded." />
  }

  return (
    <section className="grid gap-6">
      <Link className="text-sm font-bold text-teal-700" to="/projects">
        Back to projects
      </Link>
      <div className={`grid gap-4 ${isFocusMode ? 'lg:grid-cols-1' : 'lg:grid-cols-[1fr_360px]'}`}>
        <article className="rounded border border-stone-300 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black">{project.name}</h2>
              <p className="mt-2 text-slate-500">{project.description || 'No description yet.'}</p>
            </div>
            <StatusBadge value={project.status} />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded bg-stone-100 p-4">
              <p className="text-sm text-slate-500">Issues</p>
              <p className="text-2xl font-black">{project.issues?.length ?? 0}</p>
            </div>
            <div className="rounded bg-stone-100 p-4">
              <p className="text-sm text-slate-500">Sessions</p>
              <p className="text-2xl font-black">{project.codingSessions?.length ?? 0}</p>
            </div>
            <div className="rounded bg-stone-100 p-4">
              <p className="text-sm text-slate-500">Hours</p>
              <p className="text-2xl font-black">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </article>
        {!isFocusMode && (
          <article className="rounded border border-stone-300 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-black">Edit project</h3>
            <ProjectForm
              project={project}
              isSubmitting={updateProject.isPending}
              onSubmit={(payload) => updateProject.mutate({ id: project.id, payload })}
            />
          </article>
        )}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-black">Issues</h3>
            <Link className="text-sm font-bold text-teal-700" to={`/issues?projectId=${project.id}`}>
              Manage issues
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {project.issues?.length ? (
              project.issues.map((issue) => (
                <div key={issue.id} className="rounded border border-stone-200 p-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-bold">{issue.title}</p>
                    <StatusBadge value={issue.severity} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{issue.status.replace('_', ' ')}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No issues for this project.</p>
            )}
          </div>
        </article>
        <article className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <h3 className="font-black">Coding sessions</h3>
          <div className="mt-4 grid gap-3">
            {project.codingSessions?.length ? (
              project.codingSessions.map((session) => (
                <div key={session.id} className="rounded border border-stone-200 p-3">
                  <p className="font-bold">{session.hours} hours</p>
                  <p className="text-sm text-slate-500">{new Date(session.date).toLocaleDateString()}</p>
                  {session.notes ? <p className="mt-2 text-sm">{session.notes}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No sessions for this project.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
