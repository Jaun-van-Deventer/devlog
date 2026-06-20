import { BarChart3 } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useFocusMode } from '../contexts/FocusModeContext'
import { navLinks } from '../routes/nav'

export function AppLayout() {
  const { isFocusMode, toggleFocusMode } = useFocusMode()

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-stone-300 bg-[#19231f] text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="grid size-10 place-items-center rounded bg-[#d7ff71] text-slate-950">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-lg font-black tracking-wide">DevLog</p>
              <p className="text-xs text-stone-300">Build progress ledger</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:grid lg:overflow-visible">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'flex min-w-max items-center gap-3 rounded px-3 py-2 text-sm font-semibold transition',
                      isActive ? 'bg-white text-slate-950' : 'text-stone-300 hover:bg-white/10 hover:text-white',
                    ].join(' ')
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="flex items-center justify-between border-b border-stone-300 bg-white/70 px-5 py-4 backdrop-blur">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Workspace</p>
              <h1 className="text-xl font-black">Development operations</h1>
            </div>
            <button
              onClick={toggleFocusMode}
              className={`hidden rounded px-3 py-2 text-sm font-bold transition sm:block ${
                isFocusMode
                  ? 'border border-slate-300 bg-white text-slate-950 hover:bg-slate-50'
                  : 'bg-[#d7ff71] text-slate-950 hover:bg-[#c9f063]'
              }`}
            >
              {isFocusMode ? 'Exit Focus Mode' : 'Focus mode'}
            </button>
          </header>
          <main className="mx-auto w-full max-w-7xl px-5 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
