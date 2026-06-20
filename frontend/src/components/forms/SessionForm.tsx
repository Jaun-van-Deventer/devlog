import { useState } from 'react'
import type { Project, SessionPayload } from '../../types'

type SessionFormProps = {
  projects: Project[]
  isSubmitting?: boolean
  onSubmit: (payload: SessionPayload) => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function SessionForm({ projects, isSubmitting = false, onSubmit }: SessionFormProps) {
  const [payload, setPayload] = useState<SessionPayload>({
    projectId: projects[0]?.id ?? 0,
    date: today(),
    hours: 1,
    notes: '',
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
        <input
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          type="date"
          value={payload.date}
          onChange={(event) => setPayload((current) => ({ ...current, date: event.target.value }))}
        />
        <input
          className="rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          min="0.25"
          max="24"
          step="0.25"
          type="number"
          value={payload.hours}
          onChange={(event) => setPayload((current) => ({ ...current, hours: Number(event.target.value) }))}
        />
      </div>
      <textarea
        className="min-h-24 rounded border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        placeholder="Notes"
        value={payload.notes}
        onChange={(event) => setPayload((current) => ({ ...current, notes: event.target.value }))}
      />
      <button
        className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={isSubmitting || projects.length === 0 || selectedProjectId === 0}
      >
        Log session
      </button>
    </form>
  )
}
