import { Activity, Bug, CheckCircle2, Clock3, FolderKanban } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../components/EmptyState'
import { useDashboardSummary } from '../hooks/useDevlogQueries'

export function DashboardPage() {
  const { data, isLoading, error } = useDashboardSummary()

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>
  }

  if (error || !data) {
    return <EmptyState title="API unavailable" message="Start the backend and PostgreSQL services to load dashboard data." />
  }

  const cards = [
    { label: 'Total Projects', value: data.totalProjects, icon: FolderKanban, color: 'bg-[#d7ff71]' },
    { label: 'Open Issues', value: data.openIssues, icon: Bug, color: 'bg-rose-200' },
    { label: 'Resolved Issues', value: data.resolvedIssues, icon: CheckCircle2, color: 'bg-sky-200' },
    { label: 'Hours This Week', value: data.hoursLoggedThisWeek.toFixed(1), icon: Clock3, color: 'bg-teal-200' },
  ]

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black">Dashboard</h2>
          <p className="text-sm text-slate-500">A live pulse of project load, issue health, and coding time.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.label} className="rounded border border-stone-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <span className={`${card.color} grid size-10 place-items-center rounded text-slate-950`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-4 text-4xl font-black">{card.value}</p>
            </article>
          )
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity size={18} />
            <h3 className="font-black">Issues by severity</h3>
          </div>
          {data.issuesBySeverity.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.issuesBySeverity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="severity" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1f7668" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No issue data" message="Create issues to populate the severity chart." />
          )}
        </article>
        <article className="rounded border border-stone-300 bg-white p-5 shadow-sm">
          <h3 className="font-black">Recent sessions</h3>
          <div className="mt-4 grid gap-3">
            {data.recentSessions.length > 0 ? (
              data.recentSessions.map((session) => (
                <div key={session.id} className="rounded border border-stone-200 bg-stone-50 p-3">
                  <p className="text-sm font-bold">{session.project?.name ?? 'Unknown project'}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(session.date).toLocaleDateString()} · {session.hours}h
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No sessions logged yet.</p>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
