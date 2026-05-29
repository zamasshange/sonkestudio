import { categories, getToolsByCategory, tools, type Tool } from '@/lib/tools-data'

const categoryKeywords: Record<string, string[]> = {
  'ai-text': ['AI writing tools', 'AI productivity tools', 'AI text generator', 'AI writing assistant'],
  student: ['productivity tools for students', 'study tools', 'student AI tools', 'homework help'],
  document: ['document tools online', 'PDF tools', 'OCR tools', 'document converter'],
  creator: ['creator tools', 'AI content tools', 'social media tools', 'caption generator'],
  everyday: ['online utility tools', 'productivity utilities', 'quick web tools', 'free online tools'],
  developer: ['online developer tools', 'coding utilities', 'JSON tools', 'API testing tools'],
  business: ['business tools online', 'startup tools', 'AI business tools', 'cover letter generator'],
  career: ['internships South Africa', 'graduate opportunities', 'AI resume tools', 'CV tools'],
  explain: ['explain coding concepts', 'AI explanation tool', 'homework explainer', 'code explanation'],
}

const categoryUseCases: Record<string, string[]> = {
  'ai-text': ['Rewrite rough drafts', 'Improve tone and clarity', 'Create emails, bios, prompts, and summaries'],
  student: ['Study faster before exams', 'Turn notes into revision material', 'Understand homework and academic concepts'],
  document: ['Convert, scan, summarize, and clean documents', 'Prepare professional files', 'Extract useful text from PDFs and images'],
  creator: ['Plan content ideas', 'Write captions and hooks', 'Improve platform-specific posts'],
  everyday: ['Finish quick productivity tasks', 'Convert text, units, time, or files', 'Generate secure and useful outputs'],
  developer: ['Format code and data', 'Test API requests', 'Debug snippets and inspect encoded values'],
  business: ['Create business names, plans, and pitches', 'Prepare job application documents', 'Summarize meetings and research'],
  career: ['Find internships and graduate roles', 'Improve CVs and resumes', 'Prepare cover letters and track applications'],
  explain: ['Understand code, errors, contracts, charts, and emails', 'Simplify complex information', 'Learn from step-by-step explanations'],
}

const relatedByToolId: Record<string, string[]> = {
  'ai-resume': ['cover-letter', 'internship-finder', 'career-application-tracker'],
  'ai-resume-feedback': ['cover-letter', 'internship-finder', 'career-application-tracker'],
  'biz-resume': ['cover-letter', 'internship-finder', 'career-application-tracker'],
  'resume-optimizer': ['cover-letter', 'internship-finder', 'career-application-tracker'],
  'cover-letter': ['ai-resume', 'internship-finder', 'career-application-tracker'],
  'internship-finder': ['ai-resume-feedback', 'cover-letter', 'career-application-tracker'],
  'json-formatter': ['api-tester', 'base64-encode', 'jwt-decoder'],
  'api-tester': ['json-formatter', 'curl-generator', 'base64-encode'],
  'base64-encode': ['base64-decode', 'json-formatter', 'api-tester'],
  'pdf-to-word': ['word-to-pdf', 'compress-pdfs', 'merge-pdfs'],
  'word-to-pdf': ['pdf-to-word', 'compress-pdfs', 'merge-pdfs'],
  'pdf-summarizer': ['pdf-to-word', 'ocr-extractor', 'word-to-pdf'],
  'south-african-id-validator': ['currency-converter', 'timezone-converter', 'password-checker'],
}

function categoryName(tool: Tool) {
  return categories.find((category) => category.id === tool.category)?.name || 'Productivity Tools'
}

export function toolKeywords(tool: Tool) {
  return [...new Set([tool.name, ...tool.tags, ...(categoryKeywords[tool.category] || []), 'SONKE Studio', 'BDL Corp', 'South African AI ecosystem'])]
}

export function getRelatedTools(tool: Tool, limit = 6) {
  const preferred = relatedByToolId[tool.id]
    ?.map((id) => tools.find((item) => item.id === id))
    .filter((item): item is Tool => Boolean(item)) || []

  const sameCategory = tools
    .filter((item) => item.category === tool.category && item.id !== tool.id && !preferred.some((preferredTool) => preferredTool.id === item.id))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (b.usageCount || 0) - (a.usageCount || 0))

  return [...preferred, ...sameCategory].slice(0, limit)
}

export function buildToolSeoContent(tool: Tool) {
  const name = tool.name
  const category = categoryName(tool)
  const keywords = toolKeywords(tool).slice(0, 6)
  const useCases = categoryUseCases[tool.category] || categoryUseCases.everyday

  const about = `${name} is a focused ${category.toLowerCase()} workspace from SONKE Studio. It helps people turn a specific task into a clean result without jumping between disconnected apps, while reinforcing SONKE Studio as a South African-built AI productivity ecosystem by BDL Corp and founder Zama Shange.`

  const features = [
    `Purpose-built workflow for ${name.toLowerCase()}`,
    `Mobile-friendly interface for fast use on phones, tablets, and desktops`,
    `Clear inputs and outputs for ${tool.tags.slice(0, 3).join(', ') || 'everyday productivity'}`,
    `Related SONKE tools for the next step in your workflow`,
    `Crawlable page content so search engines understand this tool's specialty`,
  ]

  const howItWorks = [
    `Open the ${name} workspace and add the text, file, code, link, or details the tool asks for.`,
    'Review the structured result, then copy, export, refine, or continue into a related SONKE tool.',
    'Use the tool again whenever the same task appears in your study, career, creator, business, document, or developer workflow.',
  ]

  const benefits = [
    `Saves time on ${keywords[1] || category.toLowerCase()} tasks`,
    'Keeps productivity tools, AI workflows, and utility pages in one searchable ecosystem',
    'Helps students, creators, developers, businesses, and South African users find the right tool from search',
  ]

  const faqs = [
    {
      question: `What does ${name} do?`,
      answer: `${name} helps with ${tool.description.toLowerCase()} inside SONKE Studio, with a focused interface built around the task.`,
    },
    {
      question: `Who should use ${name}?`,
      answer: `${name} is useful for people looking for ${keywords.slice(1, 4).join(', ')}, and anyone who wants a fast online tool without a heavy setup process.`,
    },
    {
      question: `Is ${name} part of SONKE Studio?`,
      answer: `Yes. ${name} is part of SONKE Studio, a South African-built AI productivity ecosystem by BDL Corp and founder Zama Shange.`,
    },
    {
      question: `What tools are related to ${name}?`,
      answer: `Related SONKE tools include ${getRelatedTools(tool, 3).map((item) => item.name).join(', ')}.`,
    },
  ]

  return {
    about,
    keywords,
    features,
    howItWorks,
    benefits,
    faqs,
    useCases,
    relatedTools: getRelatedTools(tool),
  }
}

