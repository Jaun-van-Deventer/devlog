import { Bug, Clock3, FolderKanban, LayoutDashboard } from 'lucide-react'

export const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/issues', label: 'Issues', icon: Bug },
  { to: '/sessions', label: 'Sessions', icon: Clock3 },
]
