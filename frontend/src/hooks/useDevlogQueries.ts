import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardApi, issuesApi, projectsApi, sessionsApi } from '../services/api'
import { useAuth } from '@clerk/react'
import type { Issue, IssuePayload, ProjectPayload, SessionPayload } from '../types'

export const queryKeys = {
  dashboard: (userId: string) => ['dashboard', userId] as const,
  projects: (userId: string) => ['projects', userId] as const,
  project: (userId: string, id: number) => ['project', userId, id] as const,
  issues: (userId: string, filters?: Partial<Pick<Issue, 'severity' | 'status' | 'projectId'>>) => ['issues', userId, filters ?? {}] as const,
  sessions: (userId: string) => ['sessions', userId] as const,
}

export function useDashboardSummary() {
  const { userId } = useAuth()
  return useQuery({ queryKey: queryKeys.dashboard(userId ?? ''), queryFn: dashboardApi.summary, enabled: Boolean(userId) })
}

export function useProjects() {
  const { userId } = useAuth()
  return useQuery({ queryKey: queryKeys.projects(userId ?? ''), queryFn: projectsApi.list, enabled: Boolean(userId) })
}

export function useProject(id: number) {
  const { userId } = useAuth()
  return useQuery({
    queryKey: queryKeys.project(userId ?? '', id),
    queryFn: () => projectsApi.get(id),
    enabled: Boolean(userId) && Number.isFinite(id),
  })
}

export function useIssues(filters?: Partial<Pick<Issue, 'severity' | 'status' | 'projectId'>>) {
  const { userId } = useAuth()
  return useQuery({
    queryKey: queryKeys.issues(userId ?? '', filters),
    queryFn: () => issuesApi.list(filters),
    enabled: Boolean(userId),
  })
}

export function useSessions() {
  const { userId } = useAuth()
  return useQuery({ queryKey: queryKeys.sessions(userId ?? ''), queryFn: sessionsApi.list, enabled: Boolean(userId) })
}

function useInvalidateDevlog(userId: string | null | undefined) {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard(userId ?? '') }),
      queryClient.invalidateQueries({ queryKey: queryKeys.projects(userId ?? '') }),
      queryClient.invalidateQueries({ queryKey: ['project', userId ?? ''] }),
      queryClient.invalidateQueries({ queryKey: ['issues', userId ?? ''] }),
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions(userId ?? '') }),
    ])
}

export function useCreateProject() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: (payload: ProjectPayload) => projectsApi.create(payload), onSuccess: invalidate })
}

export function useUpdateProject() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProjectPayload }) => projectsApi.update(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteProject() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: projectsApi.remove, onSuccess: invalidate })
}

export function useCreateIssue() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: (payload: IssuePayload) => issuesApi.create(payload), onSuccess: invalidate })
}

export function useUpdateIssue() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IssuePayload }) => issuesApi.update(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteIssue() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: issuesApi.remove, onSuccess: invalidate })
}

export function useCreateSession() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: (payload: SessionPayload) => sessionsApi.create(payload), onSuccess: invalidate })
}

export function useDeleteSession() {
  const invalidate = useInvalidateDevlog(useAuth().userId)
  return useMutation({ mutationFn: sessionsApi.remove, onSuccess: invalidate })
}
