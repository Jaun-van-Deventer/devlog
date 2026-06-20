import clsx from 'clsx'
import type { IssueSeverity, IssueStatus, ProjectStatus } from '../types'

type StatusBadgeProps = {
  value: ProjectStatus | IssueStatus | IssueSeverity
}

const toneByValue: Record<StatusBadgeProps['value'], string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  PAUSED: 'bg-amber-50 text-amber-700 ring-amber-200',
  COMPLETED: 'bg-sky-50 text-sky-700 ring-sky-200',
  OPEN: 'bg-rose-50 text-rose-700 ring-rose-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  LOW: 'bg-lime-50 text-lime-700 ring-lime-200',
  MEDIUM: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-200',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-200',
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span className={clsx('inline-flex rounded px-2 py-1 text-xs font-semibold ring-1', toneByValue[value])}>
      {value.replace('_', ' ')}
    </span>
  )
}
