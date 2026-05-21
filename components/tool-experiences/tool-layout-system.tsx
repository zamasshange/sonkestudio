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

interface ToolExperienceProps {
  tool: Tool
}

/**
 * Smart tool experience router.
 * Routes tools to category-specific layouts for optimized UX.
 */
export function ToolExperienceSystem({ tool }: ToolExperienceProps) {
  if (tool.id === 'currency-converter') {
    return <CurrencyConverterLayout tool={tool} />
  }

  if (tool.id === 'timezone-converter') {
    return <TimezoneConverterLayout tool={tool} />
  }

  if (tool.id === 'password-generator' || tool.id === 'password-checker') {
    return <PasswordWorkspaceLayout tool={tool} />
  }

  if (tool.id === 'caption-generator') {
    return <SocialGeneratorLayout tool={tool} mode="caption" />
  }

  if (tool.id === 'viral-tweet' || tool.id === 'ai-tweet') {
    return <SocialGeneratorLayout tool={tool} mode="tweet" />
  }

  // Route to category-specific layouts
  switch (tool.category) {
    // AI Text Tools - Rich editor experience
    case 'ai-text':
      return <AITextEditorLayout tool={tool} />

    // Business Tools - Some require special layouts
    case 'business':
      if (tool.id === 'spreadsheet-formula') {
        return <SpreadsheetFormulaLayout tool={tool} />
      }
      if (tool.id === 'cv-generator' || tool.id === 'biz-resume') {
        return <ResumeBuilderLayout tool={tool} />
      }
      if (tool.id === 'business-name') {
        return <BusinessNameGeneratorLayout tool={tool} />
      }
      return <GenericToolLayout tool={tool} />

    // Student Tools - Some get special treatment
    case 'student':
      if (tool.id === 'ai-tutor') {
        return <TutorChatLayout tool={tool} />
      }
      if (tool.id === 'flashcard-generator') {
        return <FlashcardGeneratorLayout tool={tool} />
      }
      return <GenericToolLayout tool={tool} />

    // Document Tools - Contract analyzer gets special layout
    case 'document':
      if (tool.id === 'contract-simplifier' || tool.id === 'terms-simplifier') {
        return <DocumentAnalyzerLayout tool={tool} />
      }
      return <DocumentWorkspaceLayout tool={tool} />

    // Developer Tools - Code editor experience
    case 'developer':
      return <DeveloperCodeLayout tool={tool} />

    // Explain This Tools - Interactive annotated experience
    case 'explain':
      return <ExplainWorkspaceLayout tool={tool} />

    // Everything else gets generic layout
    default:
      return <GenericToolLayout tool={tool} />
  }
}
