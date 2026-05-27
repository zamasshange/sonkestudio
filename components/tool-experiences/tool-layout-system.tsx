"use client"

import { Tool } from '@/lib/tools-data'
import { AITextEditorLayout } from './layouts/ai-text-editor-layout'
import { SpreadsheetFormulaLayout } from './layouts/spreadsheet-formula-layout'
import { ResumeBuilderLayout } from './layouts/resume-builder-layout'
import { FlashcardGeneratorLayout } from './layouts/flashcard-generator-layout'
import { TutorChatLayout, DocumentAnalyzerLayout, DeveloperCodeLayout } from './layouts/other-layouts'
import { GenericToolLayout } from './layouts/generic-tool-layout'
import { CurrencyConverterLayout } from './layouts/currency-converter-layout'
import { TimezoneConverterLayout } from './layouts/timezone-converter-layout'
import { SocialGeneratorLayout } from './layouts/social-generator-layouts'
import { ExplainWorkspaceLayout } from './layouts/explain-workspace-layout'
import { BusinessNameGeneratorLayout } from './layouts/business-name-generator-layout'
import { DocumentWorkspaceLayout } from './layouts/document-workspace-layout'
import { PasswordWorkspaceLayout } from './layouts/password-workspace-layout'
import { LinkShortenerLayout } from './layouts/link-shortener-layout'
import { TempNotesLayout } from './layouts/temp-notes-layout'
import { EmailWorkspaceLayout } from './layouts/email-workspace-layout'
import { DocumentAiWorkspaceLayout } from './layouts/document-ai-workspace-layout'
import { DeveloperMonacoWorkspaceLayout } from './layouts/developer-monaco-workspace-layout'
import { APITesterLayout, Base64UtilityLayout, JsonFormatterLayout } from './layouts/developer-specialized-layouts'
import { getToolUxCategory } from '@/lib/tool-ux'
import {
  CreatorStudioArchetypeLayout,
  AIConversationArchetypeLayout,
  BusinessArchetypeLayout,
  DataArchetypeLayout,
  DeveloperWorkspaceArchetypeLayout,
  DocumentArchetypeLayout,
  EducationArchetypeLayout,
  UtilityArchetypeLayout,
} from './layouts/tool-archetype-layouts'

interface ToolExperienceProps {
  tool: Tool
}

/**
 * Smart tool experience router.
 * Routes tools to category-specific layouts for optimized UX.
 */
export function ToolExperienceSystem({ tool }: ToolExperienceProps) {
  const sonkeDocumentToolIds = new Set([
    'cover-letter',
    'ai-essay',
    'contract-simplifier',
    'notes-summarizer',
    'pitch-deck',
    'marketing-plan',
    'ai-rewriter',
    'ai-paraphraser',
    'ai-grammar',
    'meeting-notes',
    'ai-simplify',
    'ai-reply',
  ])

  if (tool.id === 'currency-converter') {
    return <CurrencyConverterLayout tool={tool} />
  }

  if (tool.id === 'timezone-converter') {
    return <TimezoneConverterLayout tool={tool} />
  }

  if (tool.id === 'password-generator' || tool.id === 'password-checker') {
    return <PasswordWorkspaceLayout tool={tool} />
  }

  if (tool.id === 'link-shortener') {
    return <LinkShortenerLayout tool={tool} />
  }

  if (tool.id === 'temp-notes') {
    return <TempNotesLayout tool={tool} />
  }

  if (tool.id === 'caption-generator') {
    return <SocialGeneratorLayout tool={tool} mode="caption" />
  }

  if (tool.id === 'ai-email' || tool.id === 'ai-cold-email') {
    return <EmailWorkspaceLayout tool={tool} />
  }

  if (sonkeDocumentToolIds.has(tool.id)) {
    return <DocumentAiWorkspaceLayout tool={tool} />
  }

  if (tool.id === 'json-formatter') {
    return <JsonFormatterLayout tool={tool} />
  }

  if (tool.id === 'base64-encode' || tool.id === 'base64-decode') {
    return <Base64UtilityLayout tool={tool} />
  }

  if (tool.id === 'api-tester') {
    return <APITesterLayout tool={tool} />
  }

  if (tool.id === 'viral-tweet' || tool.id === 'ai-tweet') {
    return <SocialGeneratorLayout tool={tool} mode="tweet" />
  }

  if (tool.id === 'ai-tutor') {
    return <TutorChatLayout tool={tool} />
  }

  if (tool.id === 'flashcard-generator') {
    return <FlashcardGeneratorLayout tool={tool} />
  }

  if (tool.id === 'spreadsheet-formula') {
    return <SpreadsheetFormulaLayout tool={tool} />
  }

  if (tool.id === 'cv-generator' || tool.id === 'biz-resume') {
    return <ResumeBuilderLayout tool={tool} />
  }

  if (tool.id === 'business-name') {
    return <BusinessNameGeneratorLayout tool={tool} />
  }

  if (tool.id === 'contract-simplifier' || tool.id === 'terms-simplifier') {
    return <DocumentAnalyzerLayout tool={tool} />
  }

  const uxCategory = getToolUxCategory(tool)

  switch (uxCategory) {
    case 'utility':
      return <UtilityArchetypeLayout tool={tool} />
    case 'creator-studio':
      return <CreatorStudioArchetypeLayout tool={tool} />
    case 'document-workspace':
      if (tool.category === 'ai-text') return <AITextEditorLayout tool={tool} />
      return <DocumentArchetypeLayout tool={tool} />
    case 'education-workspace':
      return <EducationArchetypeLayout tool={tool} />
    case 'data-workspace':
      return <DataArchetypeLayout tool={tool} />
    case 'business-workspace':
      return <BusinessArchetypeLayout tool={tool} />
    case 'ai-conversation':
      return <AIConversationArchetypeLayout tool={tool} />
    case 'developer-workspace':
      if (tool.category === 'explain') return <ExplainWorkspaceLayout tool={tool} />
      return <DeveloperMonacoWorkspaceLayout tool={tool} />
    default:
      return <GenericToolLayout tool={tool} />
  }
}
