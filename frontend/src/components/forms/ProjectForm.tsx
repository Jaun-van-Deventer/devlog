import { useState } from 'react'
import type { Project, ProjectPayload, ProjectStatus } from '../../types'

type ProjectFormProps = {
  project?: Project
  isSubmitting?: boolean
  onSubmit: (payload: ProjectPayload) => void
}

const statuses: ProjectStatus[] = ['ACTIVE', 'PAUSED', 'COMPLETED']

export function ProjectForm({ project, isSubmitting = false, onSubmit }: ProjectFormProps) {
  const [payload, setPayload] = useState<ProjectPayload>({
    name: project?.name ?? '',
    description: project?.description ?? '',
    status: project?.status ?? 'ACTIVE',
  })

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(payload)
      }}
    >
      <input
        className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        placeholder="Project name"
        required
        value={payload.name}
        onChange={(event) => setPayload((current) => ({ ...current, name: event.target.value }))}
      />
      <textarea
        className="min-h-24 rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        placeholder="Description"
        value={payload.description}
        onChange={(event) => setPayload((current) => ({ ...current, description: event.target.value }))}
      />
      <select
        className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        value={payload.status}
        onChange={(event) => setPayload((current) => ({ ...current, status: event.target.value as ProjectStatus }))}
      >
        {statuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>
      <button className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting}>
        {project ? 'Update project' : 'Create project'}
      </button>
    </form>
  )
}
