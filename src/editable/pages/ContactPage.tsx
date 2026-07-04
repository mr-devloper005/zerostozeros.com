'use client'

import Link from 'next/link'
import {
  ArrowUpRight, Building2, FileText, Image as ImageIcon, Library, Mail, MapPin,
  Phone, Sparkles, Bookmark,
} from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Directory onboarding', body: 'Add a business to the Local Directory, verify operational details, and go live quickly.' },
      { icon: Phone,     title: 'Partnership support',  body: 'Talk through bulk publishing, local growth and operational setup questions.' },
      { icon: MapPin,    title: 'Coverage requests',    body: 'Need a new geography or category lane? We can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText,  title: 'Field-note submissions', body: 'Pitch essays, columns and long-form ideas that fit the tone of the home base.' },
      { icon: Mail,      title: 'Partnerships',           body: 'Coordinate collaborations and issue-level campaigns.' },
      { icon: Sparkles,  title: 'Contributor support',    body: 'Get help with voice, formatting and workflow questions.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features and visual campaigns.' },
      { icon: Sparkles,  title: 'Licensing and use',      body: 'Reach out about usage rights, commercial requests and visual partnerships.' },
      { icon: Mail,      title: 'Media kits',             body: 'Request creator decks, editorial support or visual feature placement.' },
    ]
  }
  return [
    { icon: Library,   title: 'Reference Library submissions', body: 'Suggest guides, reports and reference material worth keeping on hand.' },
    { icon: Bookmark,  title: 'Curation partnerships',         body: 'Coordinate curated shelves, reference collections and link programs.' },
    { icon: Sparkles,  title: 'Curator support',               body: 'Need help organising shelves, collections or profile-connected boards?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-20 pb-8 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
          <EditableReveal index={0}>
            <span className={dc.badge.accentPill}>
              <Sparkles className="h-3.5 w-3.5" /> {pagesContent.contact.eyebrow}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-4xl text-balance`}>
              Say hello — we{' '}
              <span className="editable-gradient-text">read every message</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.lead} mt-6 max-w-3xl`}>
              {pagesContent.contact.description}
            </p>
          </EditableReveal>
        </section>

        {/* Lanes + form */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Lanes column */}
            <div>
              <EditableReveal index={0}>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                  Reach the right lane
                </p>
              </EditableReveal>
              <div className="mt-6 grid gap-4">
                {lanes.map((lane, i) => {
                  const tint = editableCardTints[i % editableCardTints.length]
                  const Icon = lane.icon
                  return (
                    <EditableReveal key={lane.title} index={i}>
                      <div
                        className="rounded-[1.5rem] border border-[var(--slot4-line)] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]"
                        style={{ backgroundColor: tint.bg }}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{ backgroundColor: tint.icon }}
                        >
                          <Icon className="h-4 w-4 text-[var(--slot4-page-text)]" />
                        </span>
                        <h3 className="editable-display mt-5 text-xl font-normal leading-[1.2] tracking-[-0.01em]">
                          {lane.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
                          {lane.body}
                        </p>
                      </div>
                    </EditableReveal>
                  )
                })}
              </div>
            </div>

            {/* Form column */}
            <EditableReveal index={1}>
              <div className="relative">
                <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[var(--slot4-tint-3)]" />
                <div className="relative rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-6 sm:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="editable-display text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl">
                      {pagesContent.contact.formTitle}
                    </h2>
                    <Link href="/about" className="hidden text-xs font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)] sm:inline-flex sm:items-center sm:gap-1">
                      About us <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="mt-6">
                    <EditableContactLeadForm />
                  </div>
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
