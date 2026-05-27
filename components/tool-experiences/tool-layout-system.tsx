"use client"

import { Tool } from '@/lib/tools-data'
import { AITextEditorLayout } from './layouts/ai-text-editor-layout'
import { SpreadsheetFormulaLayout } from './layouts/spreadsheet-formula-layout'
import { ResumeBuilderLayout } from './layouts/resume-builder-layout'
import { ResumeOptimizerLayout } from './layouts/resume-optimizer-layout'
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
import {
  CitationWorkbenchLayout,
  ExamPrepSprintLayout,
  HomeworkCoachLayout,
  MathSolverStudioLayout,
  NotesSummaryStudyLayout,
  QuizArenaLayout,
  ResearchSimplifierLayout,
  StudyPlannerCalendarLayout,
} from './layouts/student-specialized-layouts'
import {
  AITextPurposeLayout,
  BusinessPurposeLayout,
  CreatorPurposeLayout,
  DeveloperPurposeLayout,
  DocumentPurposeLayout,
  ExplainPurposeLayout,
  UtilityPurposeLayout,
} from './layouts/remaining-category-layouts'
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

  const utilityPurposeIds = new Set([
    'qr-generator', 'password-generator', 'password-checker', 'unit-converter', 'word-counter', 'char-counter',
    'case-converter', 'uuid-generator', 'random-generator', 'text-compare',
  ])
  if (utilityPurposeIds.has(tool.id)) return <UtilityPurposeLayout tool={tool} />

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

  const developerPurposeIds = new Set([
    'regex-tester', 'sql-formatter', 'jwt-decoder', 'html-formatter', 'css-minifier', 'js-beautifier',
    'markdown-preview', 'curl-generator', 'code-diff', 'color-palette',
  ])
  if (developerPurposeIds.has(tool.id)) return <DeveloperPurposeLayout tool={tool} />

  if (tool.id === 'viral-tweet' || tool.id === 'ai-tweet') {
    return <SocialGeneratorLayout tool={tool} mode="tweet" />
  }

  const creatorPurposeIds = new Set([
    'hashtag-generator', 'tiktok-hook', 'youtube-title', 'content-ideas', 'linkedin-post', 'reddit-post',
    'viral-hook', 'content-calendar', 'podcast-topics',
  ])
  if (creatorPurposeIds.has(tool.id)) return <CreatorPurposeLayout tool={tool} />

  if (tool.id === 'ai-tutor') {
    return <TutorChatLayout tool={tool} />
  }

  if (tool.id === 'flashcard-generator') {
    return <FlashcardGeneratorLayout tool={tool} />
  }

  if (tool.id === 'quiz-generator') {
    return <QuizArenaLayout tool={tool} />
  }

  if (tool.id === 'math-solver') {
    return <MathSolverStudioLayout tool={tool} />
  }

  if (tool.id === 'notes-summarizer') {
    return <NotesSummaryStudyLayout tool={tool} />
  }

  if (tool.id === 'study-planner' || tool.id === 'assignment-planner') {
    return <StudyPlannerCalendarLayout tool={tool} />
  }

  if (tool.id === 'homework-explainer') {
    return <HomeworkCoachLayout tool={tool} />
  }

  if (tool.id === 'citation-generator') {
    return <CitationWorkbenchLayout tool={tool} />
  }

  if (tool.id === 'exam-prep') {
    return <ExamPrepSprintLayout tool={tool} />
  }

  if (tool.id === 'research-simplifier' || tool.id === 'paper-simplifier') {
    return <ResearchSimplifierLayout tool={tool} />
  }

  if (tool.id === 'spreadsheet-formula') {
    return <SpreadsheetFormulaLayout tool={tool} />
  }

  if (tool.id === 'cv-generator') {
    return <ResumeBuilderLayout tool={tool} />
  }

  if (tool.id === 'biz-resume') {
    return <ResumeOptimizerLayout tool={tool} />
  }

  if (tool.id === 'business-name') {
    return <BusinessNameGeneratorLayout tool={tool} />
  }

  const businessPurposeIds = new Set(['startup-idea', 'swot-generator', 'competitor-analyzer', 'market-research'])
  if (businessPurposeIds.has(tool.id)) return <BusinessPurposeLayout tool={tool} />

  if (tool.id === 'contract-simplifier' || tool.id === 'terms-simplifier') {
    return <DocumentAnalyzerLayout tool={tool} />
  }

  const documentPurposeIds = new Set(['agreement-analyzer', 'legal-simplifier', 'resume-optimizer', 'pdf-summarizer', 'ocr-extractor', 'doc-scanner'])
  if (documentPurposeIds.has(tool.id)) return <DocumentPurposeLayout tool={tool} />

  const explainPurposeIds = new Set([
    'explain-screenshot', 'explain-error', 'explain-code', 'explain-contract', 'explain-legal',
    'explain-chart', 'explain-homework', 'explain-email', 'explain-spreadsheet', 'explain-api-error',
  ])
  if (explainPurposeIds.has(tool.id)) return <ExplainPurposeLayout tool={tool} />

  const aiTextPurposeIds = new Set([
    'ai-humanizer', 'ai-paraphraser', 'ai-rewriter', 'ai-grammar', 'ai-tone', 'ai-hook', 'ai-prompt',
    'ai-headline', 'ai-bio', 'ai-story', 'ai-simplify', 'ai-reply', 'ai-script', 'ai-notes', 'ai-resume',
  ])
  if (aiTextPurposeIds.has(tool.id)) return <AITextPurposeLayout tool={tool} />

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
