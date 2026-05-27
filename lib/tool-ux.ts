import { Tool } from '@/lib/tools-data'

export type ToolUxCategory =
  | 'utility'
  | 'developer-workspace'
  | 'creator-studio'
  | 'document-workspace'
  | 'education-workspace'
  | 'data-workspace'
  | 'business-workspace'
  | 'ai-conversation'

const utilityIds = new Set([
  'base64-encode',
  'base64-decode',
  'uuid-generator',
  'char-counter',
  'word-counter',
  'case-converter',
  'unit-converter',
  'random-generator',
  'password-generator',
  'password-checker',
  'link-shortener',
  'timezone-converter',
  'currency-converter',
])

const dataWorkspaceIds = new Set([
  'spreadsheet-formula',
  'explain-spreadsheet',
  'text-compare',
  'fake-data',
])

const documentWorkspaceIds = new Set([
  'ai-email',
  'ai-cold-email',
  'cv-generator',
  'biz-resume',
  'contract-simplifier',
  'terms-simplifier',
  'legal-simplifier',
  'agreement-analyzer',
  'resume-optimizer',
  'ai-essay',
])

const aiConversationIds = new Set([
  'ai-humanizer',
  'ai-paraphraser',
  'ai-grammar',
  'ai-tone',
  'ai-simplify',
  'ai-reply',
  'ai-prompt',
  'ai-notes',
  'ai-headline',
  'ai-hook',
  'ai-bio',
  'ai-story',
])

const creatorStudioIds = new Set([
  'caption-generator',
  'viral-tweet',
  'ai-tweet',
  'tiktok-hook',
  'youtube-title',
  'hashtag-generator',
  'content-ideas',
  'linkedin-post',
  'reddit-post',
  'content-calendar',
  'podcast-topics',
])

export function getToolUxCategory(tool: Tool): ToolUxCategory {
  if (utilityIds.has(tool.id)) return 'utility'
  if (dataWorkspaceIds.has(tool.id)) return 'data-workspace'
  if (aiConversationIds.has(tool.id)) return 'ai-conversation'
  if (documentWorkspaceIds.has(tool.id) || tool.category === 'document') return 'document-workspace'
  if (tool.category === 'business') return 'business-workspace'
  if (tool.category === 'ai-text') return 'ai-conversation'
  if (creatorStudioIds.has(tool.id) || tool.category === 'creator') return 'creator-studio'
  if (tool.category === 'developer' || tool.category === 'explain') return 'developer-workspace'
  return 'education-workspace'
}
