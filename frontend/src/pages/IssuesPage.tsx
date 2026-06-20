import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { IssueForm } from '../components/forms/IssueForm'
import { StatusBadge } from '../components/StatusBadge'
import { useFocusMode } from '../contexts/FocusModeContext'
import { useCreateIssue, useDeleteIssue, useIssues, useProjects, useUpdateIssue } from '../hooks/useDevlogQueries'
import type { IssueSeverity, IssueStatus } from '../types'

export function IssuesPage() {
  const [searchParams] = useSearchParams()
  const initialProjectId = Number(searchParams.get('projectId') ?? 0) || undefined
  const { data: issues = [], isLoading, error } = useIssues(initialProjectId ? { projectId: initialProjectId } : undefined)
  const { data: projects = [] } = useProjects()
  const createIssue = useCreateIssue()
  const updateIssue = useUpdateIssue()
  const deleteIssue = useDeleteIssue()
  const { isFocusMode } = useFocusMode()
  const [severity, setSeverity] = useState<IssueSeverity | 'ALL'>('ALL')
  const [status, setStatus] = useState<IssueStatus | 'ALL'>('ALL')
  const [filterProjectId, setFilterProjectId] = useState<number | 'ALL'>(initialProjectId ?? 'ALL')
  const selectedProject = projects.find((project) => project.id === initialProjectId)
  const filteredIssues = useMemo(
    () =>
      issues.filter(
        (issue) =>
          (severity === 'ALL' || issue.severity === severity) &&
          (status === 'ALL' || issue.status === status) &&
          (filterProjectId === 'ALL' || issue.projectId === filterProjectId),
      ),
    [issues, severity, status, filterProjectId],
  )

  return (
    <section className={`grid gap-6 ${isFocusMode ? 'xl:grid-cols-1' : 'xl:grid-cols-[430px_1fr]'}`}>
      {!isFocusMode && (
        <aside className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Create issue</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">Capture bugs, regressions, and build blockers.</p>
          <IssueForm projects={projects} isSubmitting={createIssue.isPending} onSubmit={(payload) => createIssue.mutate(payload)} />
        </aside>
      )}
      <div className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black">Issues</h2>
            <p className="text-sm text-slate-500">
              {filterProjectId !== 'ALL'
                ? `Showing issues for ${projects.find((p) => p.id === filterProjectId)?.name}.`
                : 'Filter and move work through the development lane.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={filterProjectId}
              onChange={(event) => setFilterProjectId(event.target.value === 'ALL' ? 'ALL' : Number(event.target.value))}
            >
              <option value="ALL">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={severity}
              onChange={(event) => setSeverity(event.target.value as IssueSeverity | 'ALL')}
            >
              <option value="ALL">All severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <select
              className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              value={status}
              onChange={(event) => setStatus(event.target.value as IssueStatus | 'ALL')}
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
        {createIssue.error ? <p className="rounded bg-rose-50 p-3 text-sm font-semibold text-rose-700">{createIssue.error.message}</p> : null}
        {error ? <p className="rounded bg-rose-50 p-3 text-sm font-semibold text-rose-700">Failed to load issues: {error instanceof Error ? error.message : 'Unknown error'}</p> : null}
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading issues...</p>
        ) : filteredIssues.length === 0 ? (
          <EmptyState title="No issues found" message="Create an issue or adjust the severity filter." />
        ) : (
          <div className="grid gap-3">
            {filteredIssues.map((issue) => (
              <article key={issue.id} className="rounded border border-stone-300 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black">{issue.title}</p>
                    <p className="mt-1 max-w-3xl text-sm text-slate-500">{issue.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge value={issue.severity} />
                    <StatusBadge value={issue.status} />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{issue.project?.name ?? 'Unknown project'}</span>
                  <select
                    className="rounded border border-stone-300 bg-white px-2 py-1 text-xs"
                    value={issue.status}
                    onChange={(event) =>
                      updateIssue.mutate({
                        id: issue.id,
                        payload: { ...issue, status: event.target.value as typeof issue.status },
                      })
                    }
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <button className="ml-auto font-bold text-rose-700" onClick={() => deleteIssue.mutate(issue.id)}>
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
