import { EmptyState } from '../components/EmptyState'
import { SessionForm } from '../components/forms/SessionForm'
import { useFocusMode } from '../contexts/FocusModeContext'
import { useCreateSession, useDeleteSession, useProjects, useSessions } from '../hooks/useDevlogQueries'

export function SessionsPage() {
  const { data: sessions = [], isLoading } = useSessions()
  const { data: projects = [] } = useProjects()
  const createSession = useCreateSession()
  const deleteSession = useDeleteSession()
  const { isFocusMode } = useFocusMode()

  return (
    <section className={`grid gap-6 ${isFocusMode ? 'xl:grid-cols-1' : 'xl:grid-cols-[430px_1fr]'}`}>
      {!isFocusMode && (
        <aside className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black">Log session</h2>
          <p className="mb-4 mt-1 text-sm text-slate-500">Record focused coding time against a project.</p>
          <SessionForm projects={projects} isSubmitting={createSession.isPending} onSubmit={(payload) => createSession.mutate(payload)} />
        </aside>
      )}
      <div className="grid gap-4">
        <div>
          <h2 className="text-3xl font-black">Coding sessions</h2>
          <p className="text-sm text-slate-500">A chronological ledger of development effort.</p>
        </div>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <EmptyState title="No sessions yet" message="Log your first session to begin tracking hours." />
        ) : (
          <div className="overflow-hidden rounded border border-stone-300 bg-white shadow-sm">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-stone-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-t border-stone-200">
                    <td className="px-4 py-3 font-bold">{session.project?.name ?? 'Unknown project'}</td>
                    <td className="px-4 py-3">{new Date(session.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{session.hours}</td>
                    <td className="px-4 py-3 text-slate-500">{session.notes || 'No notes'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="font-bold text-rose-700" onClick={() => deleteSession.mutate(session.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
