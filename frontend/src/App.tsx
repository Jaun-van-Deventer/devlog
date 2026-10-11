import { SignIn, SignUp, useAuth } from '@clerk/react'
import { useLayoutEffect, type ReactNode } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { setSessionTokenGetter } from './services/api'
import { FocusModeProvider } from './contexts/FocusModeContext'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { IssuesPage } from './pages/IssuesPage'
import { ProjectDetailsPage } from './pages/ProjectDetailsPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SessionsPage } from './pages/SessionsPage'

export default function App() {
  return (
    <SessionTokenBridge>
      <Routes>
        <Route path="/sign-in/*" element={<AuthPage><SignIn routing="hash" /></AuthPage>} />
        <Route path="/sign-up/*" element={<AuthPage><SignUp routing="hash" /></AuthPage>} />
        <Route element={<RequireSignedIn />}>
          <Route element={<FocusModeProvider><Outlet /></FocusModeProvider>}>
            <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </SessionTokenBridge>
  )
}

function SessionTokenBridge({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  useLayoutEffect(() => {
    setSessionTokenGetter(isLoaded && isSignedIn ? getToken : undefined)
    return () => setSessionTokenGetter(undefined)
  }, [getToken, isLoaded, isSignedIn])

  return children
}

function RequireSignedIn() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-600">Loading your workspace…</div>
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

function AuthPage({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f2ea] px-4 py-8">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-5 text-center text-xl font-black text-slate-900">DevLog</h1>
        {children}
      </div>
    </main>
  )
}
