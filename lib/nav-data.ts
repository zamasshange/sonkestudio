import type { LucideIcon } from 'lucide-react'
import {
  Brain,
  Briefcase,
  Code2,
  FileText,
  GraduationCap,
  HelpCircle,
  Palette,
  Wrench,
} from 'lucide-react'

export const navCategories = [
  { id: 'ai-text', name: 'AI Text Tools', icon: Brain },
  { id: 'student', name: 'Student Tools', icon: GraduationCap },
  { id: 'document', name: 'Document Tools', icon: FileText },
  { id: 'creator', name: 'Creator Tools', icon: Palette },
  { id: 'everyday', name: 'Everyday Utilities', icon: Wrench },
  { id: 'developer', name: 'Developer Tools', icon: Code2 },
  { id: 'business', name: 'Business Tools', icon: Briefcase },
  { id: 'explain', name: 'Explain This', icon: HelpCircle },
] as const

export const navTrendingTools: {
  id: string
  name: string
  href: string
  icon: LucideIcon
  iconColor?: string
}[] = [
  { id: 'ai-humanizer', name: 'AI Humanizer', href: '/tools/ai/humanizer', icon: Brain, iconColor: '#7C3AED' },
  { id: 'pdf-to-word', name: 'PDF to Word', href: '/tools/pdf/to-word', icon: FileText, iconColor: '#DC2626' },
  { id: 'math-solver', name: 'Math Solver', href: '/tools/student/math', icon: GraduationCap, iconColor: '#16A34A' },
  { id: 'career-opportunity-hub', name: 'Career Hub', href: '/career', icon: Briefcase, iconColor: '#2563EB' },
  { id: 'qr-generator', name: 'QR Generator', href: '/tools/qr', icon: Wrench, iconColor: '#111827' },
]
