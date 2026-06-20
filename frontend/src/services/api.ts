import axios from 'axios'
import type {
  ApiResponse,
  CodingSession,
  DashboardSummary,
  Issue,
  IssuePayload,
  Project,
  ProjectPayload,
  SessionPayload,
} from '../types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
})

async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request
  if (!response.data.success) {
    throw new Error(response.data.message)
  }
  return response.data.data
}

export const dashboardApi = {
  summary: () => unwrap<DashboardSummary>(api.get('/dashboard')),
}

export const projectsApi = {
  list: () => unwrap<Project[]>(api.get('/projects')),
  get: (id: number) => unwrap<Project>(api.get(`/projects/${id}`)),
  create: (payload: ProjectPayload) => unwrap<Project>(api.post('/projects', payload)),
  update: (id: number, payload: ProjectPayload) => unwrap<Project>(api.put(`/projects/${id}`, payload)),
  remove: (id: number) => unwrap<{ id: number }>(api.delete(`/projects/${id}`)),
}

export const issuesApi = {
  list: (filters?: Partial<Pick<Issue, 'severity' | 'status' | 'projectId'>>) =>
    unwrap<Issue[]>(api.get('/issues', { params: filters })),
  get: (id: number) => unwrap<Issue>(api.get(`/issues/${id}`)),
  create: (payload: IssuePayload) => unwrap<Issue>(api.post('/issues', payload)),
  update: (id: number, payload: IssuePayload) => unwrap<Issue>(api.put(`/issues/${id}`, payload)),
  remove: (id: number) => unwrap<{ id: number }>(api.delete(`/issues/${id}`)),
}

export const sessionsApi = {
  list: () => unwrap<CodingSession[]>(api.get('/sessions')),
  get: (id: number) => unwrap<CodingSession>(api.get(`/sessions/${id}`)),
  create: (payload: SessionPayload) => unwrap<CodingSession>(api.post('/sessions', payload)),
  remove: (id: number) => unwrap<{ id: number }>(api.delete(`/sessions/${id}`)),
}
