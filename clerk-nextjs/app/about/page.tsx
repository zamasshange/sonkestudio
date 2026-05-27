import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SONKE | Platform, Founder, and Vision",
  description:
    "Learn why SONKE exists, how it was built by Zama Shange under BDL Corp, and how this South African AI platform is creating a globally ambitious ecosystem.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
      <section className="sonke-card rounded-3xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">About SONKE</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Together, powered by AI.</h1>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-[color:var(--ink-soft)]">
          SONKE means &quot;together&quot; in isiZulu. That word is the core of our platform philosophy:
          bringing people, productivity, creativity, education, and AI together in one intelligent
          ecosystem. SONKE was created because many AI platforms feel disconnected, overwhelming,
          repetitive, and built only for technical users. We built SONKE to be useful, inclusive,
          and genuinely human for everyday people.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="sonke-card rounded-3xl p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Founder Story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Founded by Zama Shange</h2>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink-soft)]">
            SONKE was founded and developed by South African creator and developer Zama Shange
            under BDL Corp. The mission is clear: build modern AI experiences from South Africa
            that are globally competitive, deeply practical, and accessible to students, creators,
            developers, entrepreneurs, and businesses.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-soft)]">
            This is about building for the next generation, blending African innovation with global
            technology standards, and proving that meaningful AI platforms can be visionary,
            world-class, and human-first.
          </p>
        </article>

        <article className="sonke-card rounded-3xl p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">BDL Corp</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">The Innovation Company Behind SONKE</h2>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--ink-soft)]">
            BDL Corp is a modern technology and innovation brand focused on AI experiences,
            digital innovation, modern productivity, future-focused software, and intelligent
            platforms. SONKE is one of its flagship ecosystem products.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-soft)]">
            Together, SONKE, BDL Corp, and Zama Shange represent one connected identity: building
            practical AI ecosystems with long-term global ambition.
          </p>
        </article>
      </section>

      <section className="mt-8 sonke-card rounded-3xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Why SONKE Exists</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            "To make AI genuinely useful in real life.",
            "To make advanced tools feel accessible and collaborative.",
            "To support productivity, education, and creativity in one platform.",
            "To deliver specialized workflows instead of generic tool overload.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-teal-700/15 bg-teal-50/60 p-4 text-sm font-medium text-slate-800">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 sonke-card rounded-3xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">Built In South Africa, Designed For The World</p>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-[color:var(--ink-soft)]">
          SONKE is proudly built in South Africa for a global generation. Our platform is designed
          for people everywhere who want AI that feels less robotic and more useful, focused,
          creative, and empowering.
        </p>
      </section>
    </main>
  );
}
