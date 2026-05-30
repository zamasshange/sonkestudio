"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getToolsCategoryHref, Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Wand2, Copy, Loader2, Check, Sparkles, Lightbulb, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { educationLevels, southAfricanLanguages } from '@/lib/context-options'

interface AITextEditorLayoutProps {
  tool: Tool
}

const toneOptions = [
  { id: 'professional', label: 'Professional', description: 'Formal and corporate' },
  { id: 'casual', label: 'Casual', description: 'Friendly and relaxed' },
  { id: 'creative', label: 'Creative', description: 'Imaginative and unique' },
  { id: 'academic', label: 'Academic', description: 'Scholarly and precise' },
  { id: 'conversational', label: 'Conversational', description: 'Natural and approachable' },
  { id: 'persuasive', label: 'Persuasive', description: 'Compelling and convincing' },
]

const modeOptions = [
  { id: 'enhance', label: 'Enhance', description: 'Improve clarity and impact' },
  { id: 'simplify', label: 'Simplify', description: 'Make it easier to read' },
  { id: 'expand', label: 'Expand', description: 'Add more detail' },
  { id: 'shorten', label: 'Shorten', description: 'Condense the content' },
]

const examplePrompts = [
  'Improve this product description for better engagement',
  'Make this email more professional',
  'Rewrite this in a more creative way',
  'Fix the tone and grammar',
]

type ContextField = {
  id: string
  label: string
  type?: 'select' | 'text'
  options?: string[]
  placeholder?: string
}

type AIWritingProfile = {
  briefLabel: string
  placeholder: string
  contextTitle: string
  fields: ContextField[]
  examples: string[]
}

const languageOptions = [
  ...southAfricanLanguages,
  'Portuguese',
  'French',
  'Spanish',
  'German',
  'Dutch',
]

const defaultWritingProfile: AIWritingProfile = {
  briefLabel: 'Your text or request',
  placeholder: 'Paste or type your text here. Add any audience, tone, constraints, or examples that matter...',
  contextTitle: 'Writing context',
  fields: [
    { id: 'language', label: 'Language', type: 'select', options: languageOptions },
    { id: 'audience', label: 'Audience', type: 'select', options: ['General audience', 'Customers', 'Students', 'Recruiters', 'Managers', 'Creators', 'Developers'] },
    { id: 'format', label: 'Output format', type: 'select', options: ['Paragraphs', 'Bullets', 'Short answer', 'Long-form', 'Template', 'Options'] },
    { id: 'mustInclude', label: 'Must include', placeholder: 'Keywords, facts, CTA, examples...' },
  ],
  examples: examplePrompts,
}

const writingProfiles: Record<string, AIWritingProfile> = {
  'ai-email': {
    briefLabel: 'Email brief',
    placeholder: 'Describe what the email should say, paste rough notes, or add an existing draft...',
    contextTitle: 'Email details',
    fields: [
      { id: 'emailType', label: 'Email type', type: 'select', options: ['Job application', 'Request', 'Follow-up', 'Apology', 'Thank you', 'Complaint', 'Sales outreach', 'Meeting invite', 'Resignation', 'Customer support'] },
      { id: 'recipient', label: 'Recipient', type: 'select', options: ['Hiring manager', 'Teacher/Lecturer', 'Client', 'Manager', 'Colleague', 'Customer', 'Supplier', 'Friend', 'Unknown'] },
      { id: 'relationship', label: 'Relationship', type: 'select', options: ['First contact', 'Warm contact', 'Existing relationship', 'Formal relationship', 'Informal relationship'] },
      { id: 'goal', label: 'Goal', placeholder: 'What should the recipient do after reading?' },
      { id: 'length', label: 'Length', type: 'select', options: ['Short', 'Standard', 'Detailed'] },
    ],
    examples: [
      'Apply for a junior admin role and mention my attached CV.',
      'Ask my lecturer for an extension because of a family emergency.',
      'Follow up with a client who has not replied to my proposal.',
      'Apologize to a customer for a delayed order and offer a solution.',
    ],
  },
  'ai-cold-email': {
    briefLabel: 'Cold email brief',
    placeholder: 'Add product/service, target customer, pain point, proof, offer, and desired call to action...',
    contextTitle: 'Outreach details',
    fields: [
      { id: 'recipient', label: 'Recipient type', type: 'select', options: ['Founder', 'Marketing manager', 'HR manager', 'Small business owner', 'Agency lead', 'School administrator', 'Investor'] },
      { id: 'offer', label: 'Offer type', type: 'select', options: ['Service pitch', 'Product demo', 'Partnership', 'Job opportunity', 'Sponsorship', 'Consultation'] },
      { id: 'cta', label: 'Call to action', type: 'select', options: ['Book a call', 'Reply with interest', 'View portfolio', 'Try demo', 'Download resource'] },
      { id: 'proof', label: 'Proof or credibility', placeholder: 'Results, clients, numbers, credentials...' },
      { id: 'length', label: 'Length', type: 'select', options: ['Very short', 'Standard', 'Detailed'] },
    ],
    examples: ['Pitch a web design service to local restaurants.', 'Ask a founder for a 15-minute product feedback call.', 'Offer social media management to a gym owner.'],
  },
  'ai-essay': {
    briefLabel: 'Essay or assignment draft',
    placeholder: 'Paste the essay, outline, rubric, or assignment question. Include what feels weak or unfinished...',
    contextTitle: 'Essay details',
    fields: [
      { id: 'language', label: 'Essay language', type: 'select', options: languageOptions },
      { id: 'level', label: 'Academic level', type: 'select', options: educationLevels },
      { id: 'essayType', label: 'Essay type', type: 'select', options: ['Argumentative', 'Discursive', 'Narrative', 'Descriptive', 'Literary analysis', 'Research essay', 'Reflective', 'Comparative'] },
      { id: 'subject', label: 'Topic / subject', placeholder: 'Example: climate change, Macbeth, entrepreneurship...' },
      { id: 'focus', label: 'Improve focus', type: 'select', options: ['Structure', 'Grammar', 'Argument strength', 'Clarity', 'Academic tone', 'Conclusion', 'Introduction'] },
      { id: 'citationStyle', label: 'Citation style', type: 'select', options: ['None', 'APA', 'MLA', 'Harvard', 'Chicago'] },
    ],
    examples: [
      'Improve my Grade 11 argumentative essay about social media and mental health.',
      'Make this university paragraph sound more academic without changing meaning.',
      'Help strengthen my introduction and thesis statement.',
    ],
  },
  'ai-grammar': {
    briefLabel: 'Text to fix',
    placeholder: 'Paste text that needs grammar, spelling, punctuation, and clarity fixes...',
    contextTitle: 'Correction settings',
    fields: [
      { id: 'language', label: 'Language', type: 'select', options: languageOptions },
      { id: 'strictness', label: 'Correction level', type: 'select', options: ['Light fixes only', 'Standard correction', 'Full rewrite for clarity'] },
      { id: 'preserveVoice', label: 'Preserve voice', type: 'select', options: ['Yes, keep my wording', 'Mostly keep it', 'Rewrite freely'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['General', 'Academic', 'Professional', 'Customer', 'Social media'] },
    ],
    examples: ['Fix grammar but keep my original tone.', 'Correct this email for a professional audience.', 'Make this paragraph clearer and remove awkward wording.'],
  },
  'ai-humanizer': {
    briefLabel: 'AI text to humanize',
    placeholder: 'Paste text that sounds robotic or too AI-generated...',
    contextTitle: 'Humanizing settings',
    fields: [
      { id: 'audience', label: 'Audience', type: 'select', options: ['General', 'Students', 'Customers', 'Recruiters', 'LinkedIn audience', 'South African audience'] },
      { id: 'voice', label: 'Voice', type: 'select', options: ['Natural', 'Warm', 'Confident', 'Simple', 'Professional', 'Conversational'] },
      { id: 'keepMeaning', label: 'Meaning', type: 'select', options: ['Keep exactly', 'Keep mostly', 'Improve freely'] },
      { id: 'avoid', label: 'Avoid', placeholder: 'Words, phrases, slang, cliches...' },
    ],
    examples: ['Make this sound like I wrote it naturally.', 'Humanize this LinkedIn post but keep it professional.', 'Make this paragraph warmer and less robotic.'],
  },
  'ai-paraphraser': {
    briefLabel: 'Text to paraphrase',
    placeholder: 'Paste the text you want rewritten in a new way...',
    contextTitle: 'Paraphrase settings',
    fields: [
      { id: 'style', label: 'Rewrite style', type: 'select', options: ['Simple', 'Professional', 'Academic', 'Shorter', 'More detailed', 'Creative'] },
      { id: 'language', label: 'Language', type: 'select', options: languageOptions },
      { id: 'similarity', label: 'How different?', type: 'select', options: ['Light rewrite', 'Moderate rewrite', 'Very different wording'] },
      { id: 'mustKeep', label: 'Must keep', placeholder: 'Terms, quotes, numbers, names...' },
    ],
    examples: ['Paraphrase this paragraph for an assignment.', 'Rewrite this in simpler words.', 'Make this sound more professional.'],
  },
  'ai-rewriter': {
    briefLabel: 'Text to rewrite',
    placeholder: 'Paste text and describe how it should change...',
    contextTitle: 'Rewrite direction',
    fields: [
      { id: 'goal', label: 'Rewrite goal', type: 'select', options: ['Clearer', 'More persuasive', 'More concise', 'More detailed', 'Friendlier', 'More formal'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['General', 'Customers', 'Executives', 'Students', 'Recruiters', 'Social media'] },
      { id: 'format', label: 'Format', type: 'select', options: ['Paragraph', 'Bullets', 'Email', 'Post', 'Script', 'Landing copy'] },
      { id: 'constraints', label: 'Constraints', placeholder: 'Word limit, keywords, tone rules...' },
    ],
    examples: ['Rewrite this landing page copy to be more persuasive.', 'Make this message shorter and clearer.', 'Rewrite this for a professional audience.'],
  },
  'ai-tone': {
    briefLabel: 'Text to adjust',
    placeholder: 'Paste text and choose the new tone...',
    contextTitle: 'Tone settings',
    fields: [
      { id: 'currentTone', label: 'Current tone', type: 'select', options: ['Neutral', 'Too harsh', 'Too casual', 'Too formal', 'Too robotic', 'Unclear'] },
      { id: 'targetTone', label: 'Target tone', type: 'select', options: ['Professional', 'Friendly', 'Confident', 'Apologetic', 'Persuasive', 'Warm', 'Direct'] },
      { id: 'recipient', label: 'Recipient', type: 'select', options: ['Client', 'Manager', 'Colleague', 'Teacher/Lecturer', 'Customer', 'Friend'] },
      { id: 'risk', label: 'Sensitivity', type: 'select', options: ['Normal', 'Sensitive topic', 'Conflict', 'High stakes'] },
    ],
    examples: ['Make this message sound polite but firm.', 'Make this email warmer and less defensive.', 'Change this to a confident professional tone.'],
  },
  'ai-resume': {
    briefLabel: 'Resume content or job description',
    placeholder: 'Paste resume bullets, a summary, or a job description you want to optimize for...',
    contextTitle: 'Career details',
    fields: [
      { id: 'targetRole', label: 'Target role', placeholder: 'Example: Junior Data Analyst' },
      { id: 'experienceLevel', label: 'Experience level', type: 'select', options: ['Entry level', 'Junior', 'Mid-level', 'Senior', 'Career change', 'Graduate'] },
      { id: 'industry', label: 'Industry', type: 'select', options: ['Tech', 'Education', 'Healthcare', 'Finance', 'Retail', 'Marketing', 'Operations', 'Other'] },
      { id: 'focus', label: 'Optimize for', type: 'select', options: ['ATS keywords', 'Impact bullets', 'Professional summary', 'Skills section', 'Job match'] },
    ],
    examples: ['Improve these CV bullets for a junior admin role.', 'Optimize my resume summary for a data analyst job.', 'Rewrite this experience section with measurable impact.'],
  },
  'ai-script': {
    briefLabel: 'Script brief',
    placeholder: 'Add topic, audience, platform, length, and key points...',
    contextTitle: 'Script settings',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['TikTok', 'YouTube Shorts', 'YouTube long-form', 'Podcast', 'Presentation', 'Ad'] },
      { id: 'length', label: 'Length', type: 'select', options: ['15 seconds', '30 seconds', '60 seconds', '3 minutes', '5 minutes', '10 minutes'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['Students', 'Creators', 'Customers', 'Beginners', 'Professionals', 'South African audience'] },
      { id: 'style', label: 'Style', type: 'select', options: ['Educational', 'Story-driven', 'Funny', 'Sales', 'Documentary', 'Tutorial'] },
    ],
    examples: ['Write a 60-second TikTok script about study tips.', 'Create a YouTube intro for a productivity video.', 'Write a short ad script for my small business.'],
  },
  'ai-headline': {
    briefLabel: 'Headline brief',
    placeholder: 'Add product, article, page, offer, audience, and the promise you want the headline to make...',
    contextTitle: 'Headline strategy',
    fields: [
      { id: 'headlineType', label: 'Headline type', type: 'select', options: ['Blog/article', 'Landing page', 'YouTube title', 'Ad headline', 'Email subject', 'Social post'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['General', 'Students', 'Creators', 'Small business owners', 'Developers', 'Parents', 'South African audience'] },
      { id: 'angle', label: 'Angle', type: 'select', options: ['Curiosity', 'Benefit-led', 'Problem/solution', 'Urgency', 'How-to', 'Contrarian'] },
      { id: 'keywords', label: 'Keywords', placeholder: 'Words or SEO terms to include...' },
    ],
    examples: ['Create headlines for an article about saving money as a student.', 'Write YouTube title options for a study vlog.', 'Generate landing page headlines for an AI tool.'],
  },
  'ai-hook': {
    briefLabel: 'Hook brief',
    placeholder: 'Describe the topic, audience, platform, offer, or video idea...',
    contextTitle: 'Hook settings',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn', 'X / Twitter', 'Blog intro'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['Students', 'Creators', 'Founders', 'Developers', 'Small business owners', 'General audience'] },
      { id: 'hookType', label: 'Hook type', type: 'select', options: ['Curiosity', 'Pain point', 'Story', 'Hot take', 'Question', 'Transformation'] },
      { id: 'emotion', label: 'Emotion', type: 'select', options: ['Surprise', 'Relief', 'Urgency', 'Trust', 'Excitement', 'Confidence'] },
    ],
    examples: ['Create hooks for a video about passing matric exams.', 'Write LinkedIn hooks about productivity.', 'Generate TikTok hooks for a skincare product.'],
  },
  'ai-bio': {
    briefLabel: 'Bio details',
    placeholder: 'Add who you are, what you do, achievements, audience, and where the bio will be used...',
    contextTitle: 'Bio settings',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['LinkedIn', 'Instagram', 'TikTok', 'Portfolio', 'Speaker bio', 'Company website', 'CV summary'] },
      { id: 'role', label: 'Role / identity', placeholder: 'Example: student, founder, designer, tutor...' },
      { id: 'length', label: 'Length', type: 'select', options: ['One line', 'Short', 'Medium', 'Detailed'] },
      { id: 'vibe', label: 'Vibe', type: 'select', options: ['Professional', 'Warm', 'Confident', 'Creative', 'Premium', 'Friendly'] },
    ],
    examples: ['Write an Instagram bio for a student creator.', 'Create a LinkedIn bio for a junior developer.', 'Write a short founder bio for a pitch deck.'],
  },
  'ai-story': {
    briefLabel: 'Story idea',
    placeholder: 'Add characters, setting, conflict, genre, lesson, or any rough story notes...',
    contextTitle: 'Story settings',
    fields: [
      { id: 'genre', label: 'Genre', type: 'select', options: ['Adventure', 'Drama', 'Comedy', 'Romance', 'Mystery', 'Sci-fi', 'Children story', 'Motivational'] },
      { id: 'audience', label: 'Audience', type: 'select', options: ['Kids', 'Teens', 'Adults', 'Students', 'General audience'] },
      { id: 'length', label: 'Length', type: 'select', options: ['Very short', 'Short story', 'Scene', 'Chapter outline', 'Long-form outline'] },
      { id: 'setting', label: 'Setting', placeholder: 'Example: Johannesburg school, future city, village...' },
    ],
    examples: ['Write a short story about a Grade 9 learner overcoming fear.', 'Create a mystery story set in Cape Town.', 'Turn this idea into a children story.'],
  },
  'ai-simplify': {
    briefLabel: 'Text to simplify',
    placeholder: 'Paste complex text, notes, policy wording, or a paragraph that needs to be easier to understand...',
    contextTitle: 'Simplification settings',
    fields: [
      { id: 'language', label: 'Language', type: 'select', options: languageOptions },
      { id: 'level', label: 'Reading level', type: 'select', options: ['Grade 4', 'Grade 7', 'Grade 10', 'Matric', 'Beginner adult', 'General public'] },
      { id: 'format', label: 'Format', type: 'select', options: ['Plain paragraphs', 'Bullets', 'Step-by-step', 'Analogy', 'Summary first'] },
      { id: 'keepTerms', label: 'Terms to keep', placeholder: 'Technical words, names, legal terms...' },
    ],
    examples: ['Simplify this legal paragraph for a normal person.', 'Explain this science text for Grade 8.', 'Make this policy easier to understand.'],
  },
  'ai-prompt': {
    briefLabel: 'Prompt goal',
    placeholder: 'Describe what you want an AI model to do, the input it will receive, and the kind of output you expect...',
    contextTitle: 'Prompt settings',
    fields: [
      { id: 'useCase', label: 'Use case', type: 'select', options: ['Writing', 'Coding', 'Research', 'Image generation', 'Business planning', 'Study help', 'Data analysis'] },
      { id: 'model', label: 'Target model', type: 'select', options: ['ChatGPT', 'Claude', 'Gemini', 'Any LLM', 'Image model'] },
      { id: 'outputFormat', label: 'Output format', type: 'select', options: ['Bullets', 'JSON', 'Table', 'Step-by-step', 'Document', 'Options'] },
      { id: 'constraints', label: 'Constraints', placeholder: 'Tone, length, forbidden words, required sections...' },
    ],
    examples: ['Create a prompt for generating business ideas.', 'Write a prompt that explains code step by step.', 'Make a reusable prompt for summarizing research papers.'],
  },
  'ai-notes': {
    briefLabel: 'Messy notes',
    placeholder: 'Paste rough notes, lecture notes, meeting notes, or bullet fragments...',
    contextTitle: 'Notes cleanup',
    fields: [
      { id: 'noteType', label: 'Notes type', type: 'select', options: ['Class notes', 'Meeting notes', 'Research notes', 'Brainstorm', 'Study notes', 'Project notes'] },
      { id: 'format', label: 'Output format', type: 'select', options: ['Clean outline', 'Summary + action items', 'Study guide', 'Cornell notes', 'Table', 'Flashcard-ready'] },
      { id: 'language', label: 'Language', type: 'select', options: languageOptions },
      { id: 'priority', label: 'Prioritize', type: 'select', options: ['Key ideas', 'Action items', 'Definitions', 'Dates/deadlines', 'Questions', 'Examples'] },
    ],
    examples: ['Clean these class notes into a study guide.', 'Turn meeting notes into action items.', 'Organize this brainstorm into clear sections.'],
  },
  'ai-reply': {
    briefLabel: 'Message to reply to',
    placeholder: 'Paste the message, chat, email, or comment you need to answer...',
    contextTitle: 'Reply details',
    fields: [
      { id: 'relationship', label: 'Relationship', type: 'select', options: ['Friend', 'Client', 'Manager', 'Colleague', 'Teacher/Lecturer', 'Customer', 'Stranger'] },
      { id: 'replyGoal', label: 'Reply goal', type: 'select', options: ['Accept', 'Decline', 'Clarify', 'Apologize', 'Negotiate', 'Follow up', 'Set boundary'] },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Friendly', 'Professional', 'Firm', 'Warm', 'Short', 'Careful'] },
      { id: 'length', label: 'Length', type: 'select', options: ['One sentence', 'Short', 'Standard', 'Detailed'] },
    ],
    examples: ['Reply politely saying I cannot attend.', 'Respond to a client asking for a discount.', 'Reply to my manager asking for an update.'],
  },
}

function getWritingProfile(toolId: string) {
  return writingProfiles[toolId] || defaultWritingProfile
}

function initialContext(fields: ContextField[]) {
  return Object.fromEntries(fields.map((field) => [field.id, field.options?.[0] || '']))
}

export function AITextEditorLayout({ tool }: AITextEditorLayoutProps) {
  const writingProfile = getWritingProfile(tool.id)
  const [input, setInput] = useState('')
  const [outputs, setOutputs] = useState<{ [key: string]: string }>({})
  const [selectedTone, setSelectedTone] = useState('professional')
  const [selectedMode, setSelectedMode] = useState('enhance')
  const [context, setContext] = useState<Record<string, string>>(() => initialContext(writingProfile.fields))
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [sendTo, setSendTo] = useState('')
  const [sendStatus, setSendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [sendError, setSendError] = useState('')
  const canSendEmail = tool.id === 'ai-email' || tool.id === 'ai-cold-email'
  const [error, setError] = useState('')
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null)
  const ToolIcon = tool.icon
  const iconFilter = tool.id === 'tiktok-hook'
    ? 'drop-shadow(-1.2px 0 #00F2EA) drop-shadow(1.2px 0 #FF0050)'
    : undefined
  const backHref = getToolsCategoryHref(tool.category)

  const contextSummary = writingProfile.fields
    .map((field) => `${field.label}: ${context[field.id] || 'not specified'}`)
    .join('\n')

  const processText = async (tone?: string, mode?: string) => {
    const toneToUse = tone || selectedTone
    const modeToUse = mode || selectedMode

    if (!input.trim()) return

    setLoading(true)
    setError('')

    try {
      const prompt = `Tool: ${tool.name}
Tool purpose: ${tool.description}
Mode: ${modeToUse}
Tone: ${toneToUse}

Task-specific context:
${contextSummary}

User material:
${input}

Use the selected context to shape the result. If any context is blank, make a sensible assumption and keep the output practical.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.id,
          text: prompt,
          tone: toneToUse,
          mode: modeToUse,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process text')

      const content = data.result || data.choices?.[0]?.message?.content || ''
      if (!content || !content.trim()) throw new Error('No content was returned. Please try again.')

      const key = `${toneToUse}-${modeToUse}`
      setOutputs((prev) => ({ ...prev, [key]: content }))
      setSelectedOutput(key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getSelectedOutputText = () => {
    if (!selectedOutput) return ''
    return outputs[selectedOutput] || ''
  }

  const sendEmail = async () => {
    const body = getSelectedOutputText()
    if (!body.trim() || !sendTo.trim()) return

    setSendStatus('loading')
    setSendError('')

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: sendTo.trim(),
          subject: `${tool.name} draft from SONKE`,
          html: `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;white-space:pre-wrap">${body.replace(/</g, '&lt;')}</div>`,
          text: body,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send email')
      setSendStatus('sent')
    } catch (err) {
      setSendStatus('error')
      setSendError(err instanceof Error ? err.message : 'Failed to send email')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <section className="px-5 pb-6 pt-24 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <Link href={backHref} className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
            <div className="relative overflow-hidden rounded-[1.2rem] border border-border bg-white p-6 sm:p-8">
              <div className="absolute right-8 top-8 text-[8rem] font-semibold leading-none text-muted/60">AI</div>
              <div className="relative z-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  AI writing workspace
                </p>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-none text-foreground sm:text-6xl">{tool.name}</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{tool.description}</p>
              </div>
            </div>
            <div className="sonke-hero-field relative min-h-[220px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Text system</span>
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center ${
                      tool.iconColor ? 'bg-transparent text-foreground' : 'rounded-sm border border-black/5 bg-background/90 text-foreground'
                    }`}
                    style={{ background: tool.iconColor ? undefined : tool.iconBg, color: tool.iconColor }}
                  >
                    <ToolIcon className={tool.iconColor ? 'h-10 w-10' : 'h-8 w-8'} style={{ filter: iconFilter }} />
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-semibold">{selectedMode} / {selectedTone}</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">Add the right context first, then generate copy that fits the real job.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <main className="space-y-6">
            <section className="rounded-md border border-border bg-white p-6 avoora-soft-shadow">
              {/* Brief input and Settings are visible together to aid discoverability */}
              <div className="sticky top-24 z-20 -mx-6 -mt-6 mb-6 flex flex-col gap-3 border-b border-border bg-white/95 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ready to generate</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedMode} / {selectedTone} / {input.length} characters
                  </p>
                </div>
                <Button onClick={() => processText()} disabled={!input.trim() || loading} className="rounded-sm bg-primary text-primary-foreground gap-2 px-6">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Transform text
                </Button>
              </div>
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="m-0">
                  <label className="grid gap-2 text-sm font-medium text-foreground">
                    {writingProfile.briefLabel}
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={writingProfile.placeholder}
                      className="min-h-[360px] resize-none rounded-sm border border-border bg-background p-5 font-mono text-sm xl:min-h-[430px]"
                    />
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-muted-foreground">{input.length} characters</div>
                    <Button onClick={() => processText()} disabled={!input.trim() || loading} className="rounded-sm bg-primary text-primary-foreground gap-2 px-6">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                      Transform text
                    </Button>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold text-foreground">Quick examples</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {writingProfile.examples.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setInput(prompt)}
                          className="rounded-sm border border-border bg-background p-3 text-left text-sm text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <aside className="m-0 rounded-md border border-border bg-background p-4 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Settings</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{selectedMode} / {selectedTone}</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mt-5 grid gap-5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Tone</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {toneOptions.map((tone) => (
                          <button
                            key={tone.id}
                            onClick={() => setSelectedTone(tone.id)}
                            className={`rounded-sm border px-3 py-3 text-left transition ${
                              selectedTone === tone.id
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-white text-foreground hover:border-foreground/30'
                            }`}
                          >
                            <div className="text-sm font-semibold">{tone.label}</div>
                            <div className={selectedTone === tone.id ? 'mt-1 text-xs text-background/70' : 'mt-1 text-xs text-muted-foreground'}>{tone.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">Mode</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {modeOptions.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setSelectedMode(mode.id)}
                            className={`rounded-sm border px-3 py-3 text-left transition ${
                              selectedMode === mode.id
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-white text-foreground hover:border-foreground/30'
                            }`}
                          >
                            <div className="text-sm font-semibold">{mode.label}</div>
                            <div className={selectedMode === mode.id ? 'mt-1 text-xs text-background/70' : 'mt-1 text-xs text-muted-foreground'}>{mode.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">{writingProfile.contextTitle}</p>
                      <div className="mt-3 grid gap-3">
                        {writingProfile.fields.map((field) => (
                          <label key={field.id} className="grid gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                            {field.label}
                            {field.type === 'select' ? (
                              <select
                                value={context[field.id] || field.options?.[0] || ''}
                                onChange={(event) => setContext((current) => ({ ...current, [field.id]: event.target.value }))}
                                className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground"
                              >
                                {(field.options || []).map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={context[field.id] || ''}
                                onChange={(event) => setContext((current) => ({ ...current, [field.id]: event.target.value }))}
                                placeholder={field.placeholder}
                                className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground"
                              />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
              {error && (
                <div className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </section>
          </main>

          <aside className="h-fit rounded-md border border-border bg-white p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Generated output</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Variations</h2>
              </div>
              <span className="text-xs text-muted-foreground">{Object.keys(outputs).length} generated</span>
            </div>

            <AnimatePresence>
              {Object.keys(outputs).length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 flex min-h-[260px] items-center justify-center rounded-sm border border-border bg-background">
                  <div className="text-center">
                    <Lightbulb className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Choose settings and generate variations</p>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-5 max-h-[420px] space-y-3 overflow-y-auto">
                  {Object.entries(outputs).map(([key, text]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedOutput(key)}
                      className={`w-full rounded-sm border p-4 text-left transition ${
                        selectedOutput === key ? 'border-foreground bg-foreground text-background' : 'border-border bg-white text-foreground hover:border-foreground/30'
                      }`}
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em]">{key.split('-').join(' ')}</p>
                      <p className={selectedOutput === key ? 'line-clamp-3 text-sm leading-6 text-background/80' : 'line-clamp-3 text-sm leading-6 text-muted-foreground'}>{text}</p>
                    </button>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {selectedOutput && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-2 text-sm font-semibold text-foreground">Full preview</p>
                <div className="max-h-[240px] min-h-[120px] overflow-y-auto rounded-sm border border-border bg-background p-4 text-sm leading-7 whitespace-pre-wrap">
                  {getSelectedOutputText()}
                </div>
                <Button
                  onClick={() => copyToClipboard(getSelectedOutputText(), 'selected')}
                  variant="outline"
                  className="mt-3 w-full rounded-sm bg-white gap-2"
                >
                  {copied === 'selected' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'selected' ? 'Copied' : 'Copy to clipboard'}
                </Button>
                {canSendEmail && (
                  <div className="mt-4 rounded-sm border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Send with Resend</p>
                    <Input
                      type="email"
                      value={sendTo}
                      onChange={(event) => setSendTo(event.target.value)}
                      placeholder="recipient@email.com"
                      className="mt-2 h-10 rounded-sm"
                    />
                    <Button
                      type="button"
                      onClick={sendEmail}
                      disabled={!sendTo.trim() || !getSelectedOutputText().trim() || sendStatus === 'loading'}
                      className="mt-3 w-full rounded-sm gap-2 bg-primary text-primary-foreground hover:bg-foreground"
                    >
                      {sendStatus === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send email
                    </Button>
                    {sendStatus === 'sent' && <p className="mt-2 text-sm text-emerald-600">Email sent successfully.</p>}
                    {sendStatus === 'error' && sendError && <p className="mt-2 text-sm text-destructive">{sendError}</p>}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
