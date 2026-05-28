import type { CSSProperties, ReactNode } from 'react'
import {
  SiCss,
  SiHtml5,
  SiInstagram,
  SiJavascript,
  SiJson,
  SiMarkdown,
  SiOpenai,
  SiPostman,
  SiReddit,
  SiTiktok,
  SiX,
  SiYoutube,
} from 'react-icons/si'
import {
  FaAtom,
  FaAward,
  FaBookOpen,
  FaBrain,
  FaBriefcase,
  FaBug,
  FaBuilding,
  FaBullseye,
  FaCalculator,
  FaCalendarAlt,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaClock,
  FaCode,
  FaComments,
  FaDatabase,
  FaDesktop,
  FaDollarSign,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaFileAlt,
  FaFileArchive,
  FaFileCode,
  FaFileContract,
  FaFileImage,
  FaFileInvoice,
  FaFilePdf,
  FaFileSignature,
  FaFileWord,
  FaFingerprint,
  FaFlask,
  FaFont,
  FaGraduationCap,
  FaHandsHelping,
  FaHashtag,
  FaKey,
  FaLayerGroup,
  FaLightbulb,
  FaLink,
  FaLock,
  FaMagic,
  FaMicroscope,
  FaPalette,
  FaPenNib,
  FaPodcast,
  FaQuestionCircle,
  FaQrcode,
  FaQuoteRight,
  FaRandom,
  FaRocket,
  FaRuler,
  FaScroll,
  FaSearch,
  FaSearchDollar,
  FaSortAlphaDown,
  FaSpellCheck,
  FaStickyNote,
  FaTable,
  FaTasks,
  FaTerminal,
  FaToolbox,
  FaUserTie,
  FaVideo,
} from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa6'

export type ToolIcon = (props: {
  className?: string
  style?: CSSProperties
  strokeWidth?: number | string
}) => ReactNode

export interface Tool {
  id: string
  name: string
  description: string
  icon: ToolIcon
  iconColor?: string
  iconBg?: string
  category: string
  tags: string[]
  trending?: boolean
  new?: boolean
  featured?: boolean
  href: string
  usageCount?: number
}

export interface Category {
  id: string
  name: string
  description: string
  icon: ToolIcon
  color: string
  gradient: string
}

export const categories: Category[] = [
  {
    id: 'ai-text',
    name: 'AI Text Tools',
    description: 'Transform your writing with AI-powered text tools',
    icon: FaBrain,
    color: 'from-violet-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-violet-500/10 to-purple-600/10'
  },
  {
    id: 'student',
    name: 'Student Tools',
    description: 'Ace your studies with smart learning tools',
    icon: FaGraduationCap,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'document',
    name: 'Document Tools',
    description: 'Manage, convert, and optimize your documents',
    icon: FaFileAlt,
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10'
  },
  {
    id: 'creator',
    name: 'Creator Tools',
    description: 'Create viral content across all platforms',
    icon: FaPalette,
    color: 'from-pink-500 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10'
  },
  {
    id: 'everyday',
    name: 'Everyday Utilities',
    description: 'Essential tools for daily tasks',
    icon: FaToolbox,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Professional tools for developers',
    icon: FaCode,
    color: 'from-slate-400 to-zinc-500',
    gradient: 'bg-gradient-to-br from-slate-400/10 to-zinc-500/10'
  },
  {
    id: 'business',
    name: 'Business Tools',
    description: 'Plan, pitch, and grow your business',
    icon: FaBriefcase,
    color: 'from-indigo-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-indigo-500/10 to-blue-600/10'
  },
  {
    id: 'career',
    name: 'Career Hub',
    description: 'Discover opportunities and apply with AI',
    icon: FaBriefcase,
    color: 'from-blue-500 to-emerald-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-emerald-500/10'
  },
  {
    id: 'explain',
    name: 'Explain This',
    description: 'Get instant explanations for anything',
    icon: FaQuestionCircle,
    color: 'from-fuchsia-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-fuchsia-500/10 to-pink-600/10'
  },
]

export const tools: Tool[] = [
  // AI TEXT TOOLS
  { id: 'ai-humanizer', name: 'AI Humanizer', description: 'Make AI text sound human', icon: FaMagic, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'ai-text', tags: ['ai', 'writing', 'humanize'], trending: true, featured: true, href: '/tools/ai/humanizer', usageCount: 125000 },
  { id: 'ai-paraphraser', name: 'AI Paraphraser', description: 'Rewrite text in different ways', icon: FaFont, iconColor: '#9333EA', iconBg: '#faf5ff', category: 'ai-text', tags: ['ai', 'rewrite', 'paraphrase'], trending: true, href: '/tools/ai/paraphraser', usageCount: 98000 },
  { id: 'ai-rewriter', name: 'AI Rewriter', description: 'Completely transform your text', icon: FaPenNib, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'ai-text', tags: ['ai', 'rewrite'], href: '/tools/ai/rewriter', usageCount: 76000 },
  { id: 'ai-grammar', name: 'AI Grammar Fixer', description: 'Fix grammar and spelling instantly', icon: FaSpellCheck, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'ai-text', tags: ['ai', 'grammar', 'spelling'], href: '/tools/ai/grammar', usageCount: 89000 },
  { id: 'ai-tone', name: 'AI Tone Changer', description: 'Change the tone of your text', icon: FaComments, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'ai-text', tags: ['ai', 'tone', 'style'], new: true, href: '/tools/ai/tone', usageCount: 45000 },
  { id: 'ai-essay', name: 'AI Essay Improver', description: 'Enhance your essays with AI', icon: FaScroll, iconColor: '#A16207', iconBg: '#fefce8', category: 'ai-text', tags: ['ai', 'essay', 'academic'], href: '/tools/ai/essay', usageCount: 67000 },
  { id: 'ai-email', name: 'AI Email Writer', description: 'Write professional emails fast', icon: FaEnvelope, iconColor: '#EA4335', iconBg: '#fff1f1', category: 'ai-text', tags: ['ai', 'email', 'professional'], trending: true, href: '/tools/ai/email', usageCount: 112000 },
  { id: 'ai-hook', name: 'AI Hook Generator', description: 'Create attention-grabbing hooks', icon: FaLightbulb, iconColor: '#EAB308', iconBg: '#fefce8', category: 'ai-text', tags: ['ai', 'hooks', 'content'], href: '/tools/ai/hook', usageCount: 34000 },
  { id: 'ai-prompt', name: 'AI Prompt Generator', description: 'Generate powerful AI prompts', icon: SiOpenai, iconColor: '#111111', category: 'ai-text', tags: ['ai', 'prompts', 'chatgpt'], new: true, href: '/tools/ai/prompt', usageCount: 56000 },
  { id: 'ai-headline', name: 'AI Headline Generator', description: 'Create clickworthy headlines', icon: FaHashtag, iconColor: '#111827', iconBg: '#f3f4f6', category: 'ai-text', tags: ['ai', 'headlines', 'marketing'], href: '/tools/ai/headline', usageCount: 43000 },
  { id: 'ai-bio', name: 'AI Bio Generator', description: 'Generate professional bios', icon: FaUserTie, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'ai-text', tags: ['ai', 'bio', 'social'], href: '/tools/ai/bio', usageCount: 38000 },
  { id: 'ai-story', name: 'AI Story Generator', description: 'Create compelling stories', icon: FaBookOpen, iconColor: '#7C2D12', iconBg: '#fff7ed', category: 'ai-text', tags: ['ai', 'story', 'creative'], href: '/tools/ai/story', usageCount: 29000 },
  { id: 'ai-simplify', name: 'AI Text Simplifier', description: 'Make complex text simple', icon: FaLayerGroup, iconColor: '#0891B2', iconBg: '#ecfeff', category: 'ai-text', tags: ['ai', 'simplify', 'clarity'], href: '/tools/ai/simplify', usageCount: 51000 },
  { id: 'ai-resume', name: 'AI Resume Improver', description: 'Optimize your resume with AI', icon: FaAward, iconColor: '#D97706', iconBg: '#fffbeb', category: 'ai-text', tags: ['ai', 'resume', 'career'], featured: true, href: '/tools/ai/resume', usageCount: 87000 },
  { id: 'ai-cold-email', name: 'AI Cold Email Generator', description: 'Write cold emails that convert', icon: FaEnvelopeOpenText, iconColor: '#EA4335', iconBg: '#fff1f1', category: 'ai-text', tags: ['ai', 'cold email', 'sales'], href: '/tools/ai/cold-email', usageCount: 32000 },
  { id: 'ai-cover-letter-career', name: 'AI Cover Letter Career Kit', description: 'Generate tailored cover letters from live job listings', icon: FaEnvelope, iconColor: '#EA4335', iconBg: '#fff1f1', category: 'career', tags: ['cover letter', 'jobs', 'career'], new: true, href: '/career?tool=cover', usageCount: 58000 },
  { id: 'ai-reply', name: 'AI Chat Reply Generator', description: 'Generate smart chat responses', icon: FaComments, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'ai-text', tags: ['ai', 'chat', 'reply'], href: '/tools/ai/reply', usageCount: 41000 },
  { id: 'ai-tweet', name: 'AI Tweet Rewriter', description: 'Optimize your tweets for engagement', icon: SiX, iconColor: '#111111', category: 'ai-text', tags: ['ai', 'twitter', 'social'], href: '/tools/ai/tweet', usageCount: 28000 },
  { id: 'ai-script', name: 'AI Script Writer', description: 'Write video scripts easily', icon: FaVideo, iconColor: '#DC2626', iconBg: '#fff1f1', category: 'ai-text', tags: ['ai', 'script', 'video'], href: '/tools/ai/script', usageCount: 35000 },
  { id: 'ai-notes', name: 'AI Notes Cleaner', description: 'Clean and organize your notes', icon: FaStickyNote, iconColor: '#EAB308', iconBg: '#fefce8', category: 'ai-text', tags: ['ai', 'notes', 'organize'], href: '/tools/ai/notes', usageCount: 24000 },

  // STUDENT TOOLS
  { id: 'homework-explainer', name: 'Homework Explainer', description: 'Get step-by-step explanations', icon: FaQuestionCircle, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'student', tags: ['homework', 'explain', 'learning'], trending: true, featured: true, href: '/tools/student/homework', usageCount: 156000 },
  { id: 'math-solver', name: 'Math Solver', description: 'Solve any math problem', icon: FaCalculator, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'student', tags: ['math', 'solver', 'calculator'], trending: true, href: '/tools/student/math', usageCount: 198000 },
  { id: 'citation-generator', name: 'Citation Generator', description: 'Generate citations in any format', icon: FaQuoteRight, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'student', tags: ['citation', 'apa', 'mla'], href: '/tools/student/citation', usageCount: 89000 },
  { id: 'flashcard-generator', name: 'Flashcard Generator', description: 'Create flashcards from any text', icon: FaLayerGroup, iconColor: '#0891B2', iconBg: '#ecfeff', category: 'student', tags: ['flashcards', 'study', 'memory'], new: true, href: '/tools/flashcard-generator', usageCount: 67000 },
  { id: 'quiz-generator', name: 'Quiz Generator', description: 'Generate quizzes from content', icon: FaTasks, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'student', tags: ['quiz', 'test', 'study'], href: '/tools/student/quiz', usageCount: 54000 },
  { id: 'notes-summarizer', name: 'Notes Summarizer', description: 'Summarize long notes instantly', icon: FaStickyNote, iconColor: '#EAB308', iconBg: '#fefce8', category: 'student', tags: ['notes', 'summary', 'study'], href: '/tools/student/notes-summary', usageCount: 78000 },
  { id: 'study-planner', name: 'Study Planner', description: 'Plan your study schedule', icon: FaCalendarAlt, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'student', tags: ['planner', 'schedule', 'study'], href: '/tools/student/planner', usageCount: 45000 },
  { id: 'research-simplifier', name: 'Research Simplifier', description: 'Simplify research papers', icon: FaSearch, iconColor: '#0EA5E9', iconBg: '#eff6ff', category: 'student', tags: ['research', 'simplify', 'academic'], href: '/tools/student/research', usageCount: 38000 },
  { id: 'concept-explainer', name: 'Concept Explainer', description: 'Understand complex concepts', icon: FaMicroscope, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'student', tags: ['concept', 'explain', 'learn'], href: '/tools/student/concept', usageCount: 61000 },
  { id: 'ai-tutor', name: 'AI Tutor Chat', description: 'Get tutoring from AI', icon: FaGraduationCap, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'student', tags: ['tutor', 'ai', 'learning'], featured: true, href: '/tools/student/tutor', usageCount: 124000 },
  { id: 'exam-prep', name: 'Exam Prep Generator', description: 'Prepare for any exam', icon: FaFlask, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'student', tags: ['exam', 'prep', 'study'], href: '/tools/student/exam', usageCount: 72000 },
  { id: 'paper-simplifier', name: 'Research Paper Simplifier', description: 'Make papers easy to understand', icon: FaFileAlt, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'student', tags: ['paper', 'research', 'simplify'], href: '/tools/student/paper', usageCount: 43000 },
  { id: 'formula-explainer', name: 'Formula Explainer', description: 'Understand any formula', icon: FaAtom, iconColor: '#0891B2', iconBg: '#ecfeff', category: 'student', tags: ['formula', 'math', 'science'], href: '/tools/student/formula', usageCount: 56000 },
  { id: 'assignment-planner', name: 'Assignment Planner', description: 'Plan and track assignments', icon: FaClipboardList, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'student', tags: ['assignment', 'planner', 'organize'], href: '/tools/student/assignment', usageCount: 34000 },
  { id: 'career-opportunity-hub', name: 'Career Opportunity Hub', description: 'Find internships, learnerships, graduate programs, and remote junior roles', icon: FaBriefcase, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'career', tags: ['career', 'internship', 'learnership', 'jobs'], new: true, featured: true, href: '/career', usageCount: 82000 },
  { id: 'internship-finder', name: 'Internship Finder', description: 'Discover student internships, entry-level jobs, and graduate opportunities', icon: FaSearch, iconColor: '#0EA5E9', iconBg: '#eff6ff', category: 'career', tags: ['internship', 'graduate', 'student jobs'], trending: true, href: '/career?tool=internships', usageCount: 74000 },

  // DOCUMENT TOOLS
  { id: 'pdf-summarizer', name: 'PDF Summarizer', description: 'Summarize any PDF instantly', icon: FaFilePdf, iconColor: '#E5322D', iconBg: '#fff1f1', category: 'document', tags: ['pdf', 'summary', 'ai'], trending: true, featured: true, href: '/tools/pdf/summarize', usageCount: 145000 },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word', icon: FaFileWord, iconColor: '#185ABD', iconBg: '#eff6ff', category: 'document', tags: ['pdf', 'word', 'convert'], href: '/tools/pdf/to-word', usageCount: 189000 },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word docs to PDF', icon: FaFilePdf, iconColor: '#E5322D', iconBg: '#fff1f1', category: 'document', tags: ['word', 'pdf', 'convert'], href: '/tools/pdf/from-word', usageCount: 167000 },
  { id: 'merge-pdfs', name: 'Merge PDFs', description: 'Combine multiple PDFs into one', icon: FaFilePdf, iconColor: '#E5322D', iconBg: '#fff1f1', category: 'document', tags: ['pdf', 'merge', 'combine'], trending: true, href: '/tools/merge-pdfs', usageCount: 134000 },
  { id: 'split-pdfs', name: 'Split PDFs', description: 'Split PDF into separate files', icon: FaFilePdf, iconColor: '#E5322D', iconBg: '#fff1f1', category: 'document', tags: ['pdf', 'split', 'separate'], href: '/tools/split-pdfs', usageCount: 98000 },
  { id: 'compress-pdfs', name: 'Compress PDFs', description: 'Reduce PDF file size', icon: FaFileArchive, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'document', tags: ['pdf', 'compress', 'reduce'], href: '/tools/compress-pdfs', usageCount: 156000 },
  { id: 'ocr-extractor', name: 'OCR Text Extractor', description: 'Extract text from images', icon: FaFileImage, iconColor: '#0EA5E9', iconBg: '#eff6ff', category: 'document', tags: ['ocr', 'text', 'extract'], new: true, href: '/tools/document/ocr', usageCount: 67000 },
  { id: 'resume-optimizer', name: 'Resume Optimizer', description: 'Optimize your resume for ATS', icon: FaFileAlt, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'document', tags: ['resume', 'ats', 'optimize'], href: '/tools/document/resume', usageCount: 89000 },
  { id: 'ai-resume-feedback', name: 'AI Resume Feedback', description: 'Upload your CV for ATS, formatting, and keyword improvements', icon: FaAward, iconColor: '#D97706', iconBg: '#fffbeb', category: 'career', tags: ['cv', 'resume', 'ats', 'career'], new: true, href: '/career?tool=resume', usageCount: 62000 },
  { id: 'contract-simplifier', name: 'Contract Simplifier', description: 'Understand contracts easily', icon: FaFileContract, iconColor: '#111827', iconBg: '#f3f4f6', category: 'document', tags: ['contract', 'legal', 'simplify'], href: '/tools/document/contract', usageCount: 45000 },
  { id: 'terms-simplifier', name: 'T&C Simplifier', description: 'Decode terms and conditions', icon: FaFileSignature, iconColor: '#111827', iconBg: '#f3f4f6', category: 'document', tags: ['terms', 'legal', 'simplify'], href: '/tools/document/terms', usageCount: 38000 },
  { id: 'invoice-generator', name: 'Invoice Generator', description: 'Create professional invoices', icon: FaFileInvoice, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'document', tags: ['invoice', 'business', 'generate'], href: '/tools/document/invoice', usageCount: 76000 },
  { id: 'receipt-generator', name: 'Receipt Generator', description: 'Generate digital receipts', icon: FaFileInvoice, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'document', tags: ['receipt', 'generate'], href: '/tools/document/receipt', usageCount: 34000 },
  { id: 'legal-simplifier', name: 'Legal Doc Simplifier', description: 'Simplify legal documents', icon: FaFileContract, iconColor: '#111827', iconBg: '#f3f4f6', category: 'document', tags: ['legal', 'simplify', 'document'], href: '/tools/document/legal', usageCount: 29000 },
  { id: 'doc-scanner', name: 'Smart Doc Scanner', description: 'Scan and digitize documents', icon: FaFileImage, iconColor: '#0EA5E9', iconBg: '#eff6ff', category: 'document', tags: ['scan', 'document', 'digitize'], href: '/tools/document/scanner', usageCount: 51000 },
  { id: 'agreement-analyzer', name: 'AI Agreement Analyzer', description: 'Analyze any agreement', icon: FaFileSignature, iconColor: '#111827', iconBg: '#f3f4f6', category: 'document', tags: ['agreement', 'analyze', 'ai'], href: '/tools/document/agreement', usageCount: 23000 },

  // CREATOR TOOLS
  { id: 'caption-generator', name: 'Caption Generator', description: 'Generate viral captions', icon: SiInstagram, iconColor: '#E4405F', category: 'creator', tags: ['caption', 'social', 'viral'], trending: true, featured: true, href: '/tools/creator/caption', usageCount: 167000 },
  { id: 'tiktok-hook', name: 'TikTok Hook Generator', description: 'Create viral TikTok hooks', icon: SiTiktok, iconColor: '#111111', category: 'creator', tags: ['tiktok', 'hook', 'viral'], trending: true, href: '/tools/creator/tiktok-hook', usageCount: 145000 },
  { id: 'hashtag-generator', name: 'Hashtag Generator', description: 'Find trending hashtags', icon: FaHashtag, iconColor: '#111827', iconBg: '#f3f4f6', category: 'creator', tags: ['hashtag', 'social', 'trending'], href: '/tools/creator/hashtags', usageCount: 123000 },
  { id: 'viral-tweet', name: 'Viral Tweet Generator', description: 'Create tweets that go viral', icon: SiX, iconColor: '#111111', category: 'creator', tags: ['twitter', 'viral', 'tweet'], href: '/tools/creator/viral-tweet', usageCount: 98000 },
  { id: 'youtube-title', name: 'YouTube Title Generator', description: 'Create clickworthy titles', icon: SiYoutube, iconColor: '#FF0000', category: 'creator', tags: ['youtube', 'title', 'video'], href: '/tools/creator/youtube-title', usageCount: 87000 },
  { id: 'content-ideas', name: 'Content Idea Generator', description: 'Never run out of ideas', icon: FaLightbulb, iconColor: '#EAB308', iconBg: '#fefce8', category: 'creator', tags: ['content', 'ideas', 'brainstorm'], featured: true, href: '/tools/creator/ideas', usageCount: 134000 },
  { id: 'linkedin-post', name: 'LinkedIn Post Generator', description: 'Create engaging LinkedIn posts', icon: FaLinkedin, iconColor: '#0A66C2', category: 'creator', tags: ['linkedin', 'post', 'professional'], href: '/tools/creator/linkedin', usageCount: 67000 },
  { id: 'reddit-post', name: 'Reddit Post Generator', description: 'Craft perfect Reddit posts', icon: SiReddit, iconColor: '#FF4500', category: 'creator', tags: ['reddit', 'post', 'community'], href: '/tools/creator/reddit', usageCount: 34000 },
  { id: 'viral-hook', name: 'Viral Hook Analyzer', description: 'Analyze what makes hooks viral', icon: FaChartLine, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'creator', tags: ['hook', 'viral', 'analyze'], new: true, href: '/tools/creator/hook-analyzer', usageCount: 45000 },
  { id: 'content-calendar', name: 'Content Calendar Generator', description: 'Plan your content schedule', icon: FaCalendarAlt, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'creator', tags: ['calendar', 'content', 'plan'], href: '/tools/creator/calendar', usageCount: 56000 },
  { id: 'podcast-topics', name: 'Podcast Topic Generator', description: 'Find engaging podcast topics', icon: FaPodcast, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'creator', tags: ['podcast', 'topics', 'ideas'], href: '/tools/creator/podcast', usageCount: 28000 },

  // EVERYDAY UTILITIES
  { id: 'qr-generator', name: 'QR Generator', description: 'Create custom QR codes', icon: FaQrcode, iconColor: '#111827', iconBg: '#f3f4f6', category: 'everyday', tags: ['qr', 'generator', 'code'], trending: true, featured: true, href: '/tools/qr', usageCount: 234000 },
  { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords', icon: FaLock, iconColor: '#111827', iconBg: '#f3f4f6', category: 'everyday', tags: ['password', 'security', 'generate'], href: '/tools/utility/password', usageCount: 189000 },
  { id: 'password-checker', name: 'Password Strength Checker', description: 'Check password security', icon: FaKey, iconColor: '#D97706', iconBg: '#fffbeb', category: 'everyday', tags: ['password', 'security', 'check'], href: '/tools/utility/password-check', usageCount: 134000 },
  { id: 'temp-notes', name: 'Temp Notes', description: 'Quick disposable notes', icon: FaStickyNote, iconColor: '#EAB308', iconBg: '#fefce8', category: 'everyday', tags: ['notes', 'temp', 'quick'], href: '/tools/utility/temp-notes', usageCount: 98000 },
  { id: 'word-counter', name: 'Word Counter', description: 'Count words and characters', icon: FaSortAlphaDown, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'everyday', tags: ['word', 'count', 'text'], href: '/tools/utility/word-count', usageCount: 156000 },
  { id: 'char-counter', name: 'Character Counter', description: 'Count characters precisely', icon: FaHashtag, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'everyday', tags: ['character', 'count', 'text'], href: '/tools/utility/char-count', usageCount: 123000 },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert any unit instantly', icon: FaRuler, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'everyday', tags: ['unit', 'convert', 'measurement'], href: '/tools/utility/unit', usageCount: 167000 },
  { id: 'currency-converter', name: 'Currency Converter', description: 'Convert currencies in real-time', icon: FaDollarSign, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'everyday', tags: ['currency', 'convert', 'money'], href: '/tools/utility/currency', usageCount: 145000 },
  { id: 'timezone-converter', name: 'Time Zone Converter', description: 'Convert time zones easily', icon: FaClock, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'everyday', tags: ['timezone', 'time', 'convert'], href: '/tools/utility/timezone', usageCount: 89000 },
  { id: 'south-african-id-validator', name: 'South African ID Validator', description: 'Validate SA ID numbers, age, gender, citizenship, and checksum locally', icon: FaFingerprint, iconColor: '#0F766E', iconBg: '#ecfdf5', category: 'everyday', tags: ['south african id checker', 'sa id validator', 'id verification', 'age checker'], trending: true, featured: true, href: '/tools/south-african-id-validator', usageCount: 118000 },
  { id: 'random-generator', name: 'Random Generator', description: 'Generate random numbers/text', icon: FaRandom, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'everyday', tags: ['random', 'generator'], href: '/tools/utility/random', usageCount: 67000 },
  { id: 'text-compare', name: 'Text Compare', description: 'Compare two texts side by side', icon: FaExchangeAlt, iconColor: '#0891B2', iconBg: '#ecfeff', category: 'everyday', tags: ['text', 'compare', 'diff'], href: '/tools/utility/compare', usageCount: 78000 },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text case instantly', icon: FaFont, iconColor: '#111827', iconBg: '#f3f4f6', category: 'everyday', tags: ['case', 'convert', 'text'], href: '/tools/utility/case', usageCount: 98000 },
  { id: 'link-shortener', name: 'Link Shortener', description: 'Shorten long URLs', icon: FaLink, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'everyday', tags: ['link', 'shorten', 'url'], href: '/tools/link-shortener', usageCount: 145000 },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate unique identifiers', icon: FaFingerprint, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'everyday', tags: ['uuid', 'id', 'generate'], href: '/tools/utility/uuid', usageCount: 56000 },
  { id: 'fake-data', name: 'Fake Data Generator', description: 'Generate test data', icon: FaDatabase, iconColor: '#111827', iconBg: '#f3f4f6', category: 'everyday', tags: ['fake', 'data', 'test'], href: '/tools/utility/fake-data', usageCount: 67000 },

  // DEVELOPER TOOLS
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON', icon: SiJson, iconColor: '#111111', iconBg: '#fff7ed', category: 'developer', tags: ['json', 'format', 'validate'], trending: true, featured: true, href: '/tools/dev/json', usageCount: 234000 },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Format SQL queries', icon: FaDatabase, iconColor: '#111827', iconBg: '#f3f4f6', category: 'developer', tags: ['sql', 'format', 'query'], href: '/tools/dev/sql', usageCount: 123000 },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions', icon: FaCode, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'developer', tags: ['regex', 'test', 'pattern'], href: '/tools/dev/regex', usageCount: 145000 },
  { id: 'base64-encode', name: 'Base64 Encoder', description: 'Encode text to Base64', icon: FaFileCode, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'developer', tags: ['base64', 'encode', 'text'], href: '/tools/dev/base64-encode', usageCount: 167000 },
  { id: 'base64-decode', name: 'Base64 Decoder', description: 'Decode Base64 to text', icon: FaFileCode, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'developer', tags: ['base64', 'decode', 'text'], href: '/tools/dev/base64-decode', usageCount: 156000 },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode and inspect JWTs', icon: FaKey, iconColor: '#D97706', iconBg: '#fffbeb', category: 'developer', tags: ['jwt', 'decode', 'token'], trending: true, href: '/tools/dev/jwt', usageCount: 189000 },
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML', icon: SiHtml5, iconColor: '#E34F26', iconBg: '#fff7ed', category: 'developer', tags: ['html', 'format', 'beautify'], href: '/tools/dev/html', usageCount: 98000 },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Minify CSS code', icon: SiCss, iconColor: '#663399', iconBg: '#f5f3ff', category: 'developer', tags: ['css', 'minify', 'compress'], href: '/tools/dev/css-minify', usageCount: 87000 },
  { id: 'js-beautifier', name: 'JavaScript Beautifier', description: 'Beautify JavaScript code', icon: SiJavascript, iconColor: '#F7DF1E', iconBg: '#111111', category: 'developer', tags: ['javascript', 'beautify', 'format'], href: '/tools/dev/js-beautify', usageCount: 112000 },
  { id: 'markdown-preview', name: 'Markdown Previewer', description: 'Preview Markdown in real-time', icon: SiMarkdown, iconColor: '#111111', iconBg: '#ffffff', category: 'developer', tags: ['markdown', 'preview', 'md'], href: '/tools/dev/markdown', usageCount: 134000 },
  { id: 'color-palette', name: 'Color Palette Generator', description: 'Generate color palettes', icon: FaPalette, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'developer', tags: ['color', 'palette', 'design'], new: true, href: '/tools/dev/color', usageCount: 78000 },
  { id: 'api-tester', name: 'API Tester', description: 'Test API endpoints', icon: SiPostman, iconColor: '#FF6C37', iconBg: '#fff7ed', category: 'developer', tags: ['api', 'test', 'http'], href: '/tools/dev/api', usageCount: 145000 },
  { id: 'curl-generator', name: 'CURL Generator', description: 'Generate CURL commands', icon: FaTerminal, iconColor: '#111827', iconBg: '#f3f4f6', category: 'developer', tags: ['curl', 'api', 'http'], href: '/tools/dev/curl', usageCount: 67000 },
  { id: 'code-diff', name: 'Code Difference Checker', description: 'Compare code differences', icon: FaExchangeAlt, iconColor: '#0891B2', iconBg: '#ecfeff', category: 'developer', tags: ['code', 'diff', 'compare'], href: '/tools/dev/diff', usageCount: 98000 },

  // BUSINESS TOOLS
  { id: 'cv-generator', name: 'CV Generator', description: 'Build a polished CV with sections, templates, and ATS guidance', icon: FaFileAlt, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'business', tags: ['cv', 'resume', 'generator', 'career', 'job'], trending: true, featured: true, href: '/tools/cv-generator', usageCount: 94000 },
  { id: 'biz-resume', name: 'Resume Optimizer', description: 'Optimize for applicant tracking', icon: FaAward, iconColor: '#D97706', iconBg: '#fffbeb', category: 'business', tags: ['resume', 'ats', 'job'], trending: true, featured: true, href: '/tools/business/resume', usageCount: 156000 },
  { id: 'cover-letter', name: 'Cover Letter Generator', description: 'Create compelling cover letters', icon: FaPenNib, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'business', tags: ['cover letter', 'job', 'career'], href: '/tools/business/cover-letter', usageCount: 123000 },
  { id: 'meeting-notes', name: 'Meeting Notes Summarizer', description: 'Summarize meeting notes', icon: FaSearch, iconColor: '#0EA5E9', iconBg: '#eff6ff', category: 'business', tags: ['meeting', 'notes', 'summary'], href: '/tools/business/meeting-notes', usageCount: 89000 },
  { id: 'career-application-tracker', name: 'Career Application Tracker', description: 'Save opportunities, track applications, and prepare interviews', icon: FaTasks, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'career', tags: ['career', 'applications', 'interview'], new: true, href: '/career?tool=tracker', usageCount: 52000 },
  { id: 'spreadsheet-formula', name: 'Spreadsheet Formula Generator', description: 'Generate Excel formulas', icon: FaTable, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'business', tags: ['spreadsheet', 'formula', 'excel'], new: true, href: '/tools/business/formula', usageCount: 67000 },
  { id: 'startup-idea', name: 'Startup Idea Generator', description: 'Generate startup ideas', icon: FaRocket, iconColor: '#DC2626', iconBg: '#fff1f1', category: 'business', tags: ['startup', 'idea', 'business'], href: '/tools/business/startup-idea', usageCount: 78000 },
  { id: 'swot-generator', name: 'SWOT Generator', description: 'Create SWOT analyses', icon: FaBullseye, iconColor: '#DB2777', iconBg: '#fdf2f8', category: 'business', tags: ['swot', 'analysis', 'strategy'], href: '/tools/business/swot', usageCount: 56000 },
  { id: 'marketing-plan', name: 'Marketing Plan Generator', description: 'Create marketing plans', icon: FaChartBar, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'business', tags: ['marketing', 'plan', 'strategy'], href: '/tools/business/marketing', usageCount: 45000 },
  { id: 'business-name', name: 'Business Name Generator', description: 'Generate business names', icon: FaBuilding, iconColor: '#111827', iconBg: '#f3f4f6', category: 'business', tags: ['business', 'name', 'brand'], href: '/tools/business/name', usageCount: 98000 },
  { id: 'pitch-deck', name: 'AI Pitch Deck Writer', description: 'Write pitch deck content', icon: FaChartLine, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'business', tags: ['pitch', 'deck', 'startup'], href: '/tools/business/pitch-deck', usageCount: 34000 },
  { id: 'market-research', name: 'Market Research Summarizer', description: 'Summarize market research', icon: FaSearchDollar, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'business', tags: ['market', 'research', 'analysis'], href: '/tools/business/market-research', usageCount: 29000 },
  { id: 'competitor-analyzer', name: 'Competitor Analyzer', description: 'Analyze your competitors', icon: FaChartLine, iconColor: '#DC2626', iconBg: '#fff1f1', category: 'business', tags: ['competitor', 'analyze', 'business'], href: '/tools/business/competitor', usageCount: 41000 },

  // EXPLAIN THIS TOOLS
  { id: 'explain-screenshot', name: 'Explain This Screenshot', description: 'Get explanations from screenshots', icon: FaDesktop, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'explain', tags: ['screenshot', 'explain', 'visual'], trending: true, featured: true, href: '/tools/explain/screenshot', usageCount: 145000 },
  { id: 'explain-error', name: 'Explain This Error', description: 'Understand any error message', icon: FaBug, iconColor: '#DC2626', iconBg: '#fff1f1', category: 'explain', tags: ['error', 'debug', 'explain'], trending: true, href: '/tools/explain/error', usageCount: 167000 },
  { id: 'explain-code', name: 'Explain This Code', description: 'Understand any code snippet', icon: FaFileCode, iconColor: '#111827', iconBg: '#f3f4f6', category: 'explain', tags: ['code', 'explain', 'learn'], featured: true, href: '/tools/explain/code', usageCount: 189000 },
  { id: 'explain-contract', name: 'Explain This Contract', description: 'Understand contract terms', icon: FaFileContract, iconColor: '#111827', iconBg: '#f3f4f6', category: 'explain', tags: ['contract', 'legal', 'explain'], href: '/tools/explain/contract', usageCount: 78000 },
  { id: 'explain-legal', name: 'Explain Legal Document', description: 'Decode legal documents', icon: FaFileAlt, iconColor: '#111827', iconBg: '#f3f4f6', category: 'explain', tags: ['legal', 'document', 'explain'], href: '/tools/explain/legal', usageCount: 67000 },
  { id: 'explain-chart', name: 'Explain This Chart', description: 'Understand data visualizations', icon: FaChartPie, iconColor: '#7C3AED', iconBg: '#f5f3ff', category: 'explain', tags: ['chart', 'data', 'explain'], href: '/tools/explain/chart', usageCount: 56000 },
  { id: 'explain-homework', name: 'Explain Homework Question', description: 'Get homework help instantly', icon: FaHandsHelping, iconColor: '#2563EB', iconBg: '#eff6ff', category: 'explain', tags: ['homework', 'help', 'explain'], href: '/tools/explain/homework', usageCount: 123000 },
  { id: 'explain-email', name: 'Explain This Email', description: 'Understand complex emails', icon: FaEnvelopeOpenText, iconColor: '#EA4335', iconBg: '#fff1f1', category: 'explain', tags: ['email', 'explain', 'understand'], href: '/tools/explain/email', usageCount: 45000 },
  { id: 'explain-spreadsheet', name: 'Explain This Spreadsheet', description: 'Understand spreadsheet data', icon: FaTable, iconColor: '#16A34A', iconBg: '#f0fdf4', category: 'explain', tags: ['spreadsheet', 'data', 'explain'], href: '/tools/explain/spreadsheet', usageCount: 38000 },
  { id: 'explain-api-error', name: 'Explain This API Error', description: 'Debug API errors quickly', icon: FaExclamationTriangle, iconColor: '#D97706', iconBg: '#fffbeb', category: 'explain', tags: ['api', 'error', 'debug'], href: '/tools/explain/api-error', usageCount: 89000 },
]

export const featuredTools = tools.filter(t => t.featured)
export const trendingTools = tools.filter(t => t.trending)
export const newTools = tools.filter(t => t.new)

export const southAfricaPriorityToolIds = [
  'currency-converter',
  'timezone-converter',
  'south-african-id-validator',
  'ai-humanizer',
  'ai-email',
  'ai-paraphraser',
  'ai-grammar',
  'pdf-to-word',
  'word-to-pdf',
  'qr-generator',
  'math-solver',
  'homework-explainer',
  'career-opportunity-hub',
  'internship-finder',
  'cv-generator',
  'biz-resume',
  'caption-generator',
  'json-formatter',
  'explain-code',
]

const lowIntentPopularIds = new Set(['random-generator', 'fake-data', 'uuid-generator'])

export const southAfricaPopularTools = [
  ...southAfricaPriorityToolIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is Tool => Boolean(tool)),
  ...tools
    .filter((tool) => !southAfricaPriorityToolIds.includes(tool.id) && !lowIntentPopularIds.has(tool.id))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)),
]

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId)
}

export function getToolsCategoryHref(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    ai: 'ai-text',
    dev: 'developer',
    utility: 'everyday',
    pdf: 'document',
  }

  return `/tools?category=${categoryMap[categoryId] || categoryId}`
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase()
  return tools.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.toLowerCase().includes(q))
  )
}
