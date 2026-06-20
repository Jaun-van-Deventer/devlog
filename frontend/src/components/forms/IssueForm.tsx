import { useState } from 'react'
import type { Issue, IssuePayload, IssueSeverity, IssueStatus, Project } from '../../types'

type IssueFormProps = {
  projects: Project[]
  issue?: Issue
  isSubmitting?: boolean
  onSubmit: (payload: IssuePayload) => void
}

const severities: IssueSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const statuses: IssueStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED']

export function IssueForm({ projects, issue, isSubmitting = false, onSubmit }: IssueFormProps) {
  const [payload, setPayload] = useState<IssuePayload>({
    title: issue?.title ?? '',
    description: issue?.description ?? '',
    severity: issue?.severity ?? 'MEDIUM',
    status: issue?.status ?? 'OPEN',
    projectId: issue?.projectId ?? projects[0]?.id ?? 0,
  })
  const selectedProjectId = payload.projectId || projects[0]?.id || 0

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ ...payload, projectId: selectedProjectId })
      }}
    >
      <input
        className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        placeholder="Issue title"
        required
        value={payload.title}
        onChange={(event) => setPayload((current) => ({ ...current, title: event.target.value }))}
      />
      <textarea
        className="min-h-24 rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        placeholder="Issue description"
        required
        value={payload.description}
        onChange={(event) => setPayload((current) => ({ ...current, description: event.target.value }))}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <select
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          value={selectedProjectId}
          onChange={(event) => setPayload((current) => ({ ...current, projectId: Number(event.target.value) }))}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          value={payload.severity}
          onChange={(event) => setPayload((current) => ({ ...current, severity: event.target.value as IssueSeverity }))}
        >
          {severities.map((severity) => (
            <option key={severity}>{severity}</option>
          ))}
        </select>
        <select
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          value={payload.status}
          onChange={(event) => setPayload((current) => ({ ...current, status: event.target.value as IssueStatus }))}
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
      <button
        className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={isSubmitting || projects.length === 0 || selectedProjectId === 0}
      >
        {issue ? 'Update issue' : 'Create issue'}
      </button>
    </form>
  )
}
