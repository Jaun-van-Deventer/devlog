export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED'
export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'

export type Project = {
  id: number
  name: string
  description?: string | null
  status: ProjectStatus
  createdAt: string
  _count?: {
    issues: number
    codingSessions: number
  }
  issues?: Issue[]
  codingSessions?: CodingSession[]
}

export type Issue = {
  id: number
  title: string
  description: string
  severity: IssueSeverity
  status: IssueStatus
  projectId: number
  createdAt: string
  project?: Project
}

export type CodingSession = {
  id: number
  projectId: number
  date: string
  hours: number
  notes?: string | null
  project?: Project
}

export type DashboardSummary = {
  totalProjects: number
  openIssues: number
  resolvedIssues: number
  hoursLoggedThisWeek: number
  recentSessions: CodingSession[]
  issuesBySeverity: Array<{ severity: IssueSeverity; count: number }>
}

export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  message: string
  errors?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type ProjectPayload = {
  name: string
  description?: string
  status: ProjectStatus
}

export type IssuePayload = {
  title: string
  description: string
  severity: IssueSeverity
  status: IssueStatus
  projectId: number
}

export type SessionPayload = {
  projectId: number
  date: string
  hours: number
  notes?: string
}
