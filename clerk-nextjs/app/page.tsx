import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SONKE Studio | AI Ecosystem for Productivity, Learning, and Creativity",
  description:
    "SONKE Studio is the AI ecosystem where productivity, creativity, education, and intelligent workflows come together for students, creators, developers, businesses, and everyday users.",
};

const categories = [
  {
    title: "Student Tools",
    icon: "ST",
    description: "Study smarter with tutoring, flashcards, homework support, and concept explainers.",
    preview: "Tutor + Flashcards + Exam Prep",
  },
  {
    title: "Everyday Utilities",
    icon: "EU",
    description: "Daily tools for writing, conversion, quick calculations, and practical life productivity.",
    preview: "Currency + Notes + Word Count",
  },
  {
    title: "Developer Tools",
    icon: "DT",
    description: "Technical utilities and AI workflows for code, APIs, JSON, SQL, and debugging.",
    preview: "Regex + JSON + API + SQL",
  },
  {
    title: "Creator Tools",
    icon: "CT",
    description: "Generate hooks, captions, content ideas, and social assets with creator-focused logic.",
    preview: "Captions + Ideas + Calendar",
  },
  {
    title: "Business Tools",
    icon: "BT",
    description: "Workflows for strategy, market research, pitches, and operational communication.",
    preview: "SWOT + Pitch + Research",
  },
  {
    title: "Explain This",
    icon: "EX",
    description: "Break down complexity across code, charts, contracts, and technical errors.",
    preview: "Code + Contracts + Errors",
  },
  {
    title: "Document Tools",
    icon: "DO",
    description: "Structured support for OCR, legal docs, invoices, resumes, and document automation.",
    preview: "OCR + Invoices + Contracts",
  },
  {
    title: "AI Text Tools",
    icon: "AI",
    description: "Refine tone, clarity, and structure for modern communication and writing workflows.",
    preview: "Humanizer + Rewrite + Tone",
  },
];

export default function Home() {
  return (
    <main className="flex-1 sonke-gradient">
      <section className="mx-auto max-w-6xl px-6 py-24 sonke-fade-up sm:px-8">
        <p className="inline-flex rounded-full border border-teal-700/15 bg-teal-50 px-4 py-1 text-xs font-semibold tracking-wide text-teal-900">
          SONKE means &quot;together&quot; in isiZulu
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          One intelligent ecosystem where productivity, creativity, education, and AI come together.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--ink-soft)]">
          SONKE Studio is not a random collection of AI tools. It is a purpose-built platform for
          real people and real outcomes, designed to make AI useful, accessible, creative,
          educational, and deeply human.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Discover The Story
          </Link>
          <Link
            href="/tools"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-teal-600 hover:text-teal-700"
          >
            Explore Platform
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Built in South Africa",
            "Designed for productivity",
            "Powered by intelligent AI systems",
            "Focused on real-world usefulness",
          ].map((point) => (
            <div key={point} className="sonke-card rounded-2xl p-4 text-sm font-medium">
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Category Ecosystem
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Purpose-built experiences, not generic AI wrappers.
            </h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article key={category.title} className="sonke-card rounded-3xl p-5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-sm font-semibold text-teal-900">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold">{category.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                {category.description}
              </p>
              <div className="mt-4 rounded-xl border border-dashed border-teal-700/20 bg-teal-50/60 p-3 text-xs font-medium text-teal-900">
                {category.preview}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="sonke-card rounded-3xl p-6 lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Why SONKE Is Different</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              SONKE is building specialized intelligent ecosystems, not 1000 random tools.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Every SONKE category is designed around real tasks and real workflows. That means
              purpose-built interfaces, human-centered usability, and outcomes that help users move
              faster without losing clarity or control.
            </p>
          </article>
          <article className="sonke-card rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Who It Is For</p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Students, creators, developers, entrepreneurs, businesses, professionals, and
              everyday users who want AI that feels practical, modern, and collaborative.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
        <div className="sonke-card rounded-3xl p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Vision For The Future</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
            Building a globally recognized AI ecosystem where intelligent productivity feels human.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--ink-soft)]">
            SONKE aims to become a next-generation AI workspace for the modern generation:
            connected, useful, and designed for long-term growth. Built in South Africa for a
            global generation, and powered by the belief that better technology should bring people
            together.
          </p>
        </div>
      </section>
    </main>
  );
}
