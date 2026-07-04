import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Compass, Library, MapPin, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'

const pillars = [
  { icon: MapPin,   title: 'Local Directory',   body: 'Location, hours and direct contact rows sit at the top of every business entry.' },
  { icon: Library,  title: 'Reference Library', body: 'Downloadable guides carry file metadata and preview panes so you know what you are opening.' },
  { icon: Compass,  title: 'One home base',     body: 'Discovery, verification and download flow through one connected surface.' },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-20 pb-14 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
          <EditableReveal index={0}>
            <span className={dc.badge.accentPill}>
              <Sparkles className="h-3.5 w-3.5" /> {pagesContent.about.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-balance`}>
              About{' '}
              <span className="editable-gradient-text">{SITE_CONFIG.name}</span> —
              a calm home base for local discovery and reference.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.lead} mt-8 max-w-3xl`}>
              {pagesContent.about.description}
            </p>
          </EditableReveal>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <EditableReveal index={0}>
              <article className="rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-8 sm:p-12">
                <span className={dc.badge.accentPill}>Our story</span>
                <h2 className={`${dc.type.sectionTitle} mt-6`}>
                  A single surface — <span className="editable-gradient-text">many lanes</span>.
                </h2>
                <div className="mt-8 space-y-6 text-[17px] leading-[1.65] text-[var(--slot4-body-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </EditableReveal>

            {/* Pillars */}
            <div className="grid gap-5">
              {pillars.map((pillar, i) => {
                const tint = editableCardTints[i % editableCardTints.length]
                const Icon = pillar.icon
                return (
                  <EditableReveal key={pillar.title} index={i}>
                    <div
                      className="rounded-[1.5rem] border border-[var(--slot4-line)] p-7 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]"
                      style={{ backgroundColor: tint.bg }}
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: tint.icon }}
                      >
                        <Icon className="h-5 w-5 text-[var(--slot4-page-text)]" />
                      </span>
                      <h3 className="editable-display mt-6 text-2xl font-normal tracking-[-0.01em]">
                        {pillar.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
                        {pillar.body}
                      </p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="max-w-3xl">
              <EditableReveal index={0}>
                <span className={dc.badge.accentPill}>What we stand for</span>
              </EditableReveal>
              <EditableReveal index={1}>
                <h2 className={`${dc.type.sectionTitle} mt-6`}>
                  Quiet discovery, <span className="editable-gradient-text">useful outcomes</span>.
                </h2>
              </EditableReveal>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="flex h-full flex-col rounded-[1.5rem] border border-[var(--slot4-line)] bg-white p-8">
                    <CheckCircle2 className="h-6 w-6 text-[var(--slot4-accent)]" />
                    <h3 className="editable-display mt-6 text-2xl font-normal leading-[1.15] tracking-[-0.01em]">
                      {value.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">
                      {value.description}
                    </p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <EditableReveal index={0}>
                <h2 className="editable-display text-4xl font-normal leading-[1.05] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
                  Ready to start <span className="editable-gradient-text">exploring</span>?
                </h2>
              </EditableReveal>
              <EditableReveal index={1}>
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <p className="max-w-md text-white/70">
                    Browse the Local Directory, save a guide from the Reference Library, or add your own entry.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/listings" className={dc.button.accent}>
                      Open the directory <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/60"
                    >
                      Talk to us
                    </Link>
                  </div>
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
