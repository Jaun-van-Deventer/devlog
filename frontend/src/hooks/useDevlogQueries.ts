import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardApi, issuesApi, projectsApi, sessionsApi } from '../services/api'
import type { Issue, IssuePayload, ProjectPayload, SessionPayload } from '../types'

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  projects: ['projects'] as const,
  project: (id: number) => ['project', id] as const,
  issues: (filters?: Partial<Pick<Issue, 'severity' | 'status' | 'projectId'>>) => ['issues', filters ?? {}] as const,
  sessions: ['sessions'] as const,
}

export function useDashboardSummary() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: dashboardApi.summary })
}

export function useProjects() {
  return useQuery({ queryKey: queryKeys.projects, queryFn: projectsApi.list })
}

export function useProject(id: number) {
  return useQuery({ queryKey: queryKeys.project(id), queryFn: () => projectsApi.get(id), enabled: Number.isFinite(id) })
}

export function useIssues(filters?: Partial<Pick<Issue, 'severity' | 'status' | 'projectId'>>) {
  return useQuery({ queryKey: queryKeys.issues(filters), queryFn: () => issuesApi.list(filters) })
}

export function useSessions() {
  return useQuery({ queryKey: queryKeys.sessions, queryFn: sessionsApi.list })
}

function useInvalidateDevlog() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
      queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
      queryClient.invalidateQueries({ queryKey: ['project'] }),
      queryClient.invalidateQueries({ queryKey: ['issues'] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
    ])
}

export function useCreateProject() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: (payload: ProjectPayload) => projectsApi.create(payload), onSuccess: invalidate })
}

export function useUpdateProject() {
  const invalidate = useInvalidateDevlog()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectPayload }) => projectsApi.update(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteProject() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: projectsApi.remove, onSuccess: invalidate })
}

export function useCreateIssue() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: (payload: IssuePayload) => issuesApi.create(payload), onSuccess: invalidate })
}

export function useUpdateIssue() {
  const invalidate = useInvalidateDevlog()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IssuePayload }) => issuesApi.update(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteIssue() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: issuesApi.remove, onSuccess: invalidate })
}

export function useCreateSession() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: (payload: SessionPayload) => sessionsApi.create(payload), onSuccess: invalidate })
}

export function useDeleteSession() {
  const invalidate = useInvalidateDevlog()
  return useMutation({ mutationFn: sessionsApi.remove, onSuccess: invalidate })
}
