import { Navigate, Route, Routes } from 'react-router-dom'
import { FocusModeProvider } from './contexts/FocusModeContext'
import { AppLayout } from './layouts/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { IssuesPage } from './pages/IssuesPage'
import { ProjectDetailsPage } from './pages/ProjectDetailsPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SessionsPage } from './pages/SessionsPage'

export default function App() {
  return (
    <FocusModeProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Route>
      </Routes>
    </FocusModeProvider>
  )
}
