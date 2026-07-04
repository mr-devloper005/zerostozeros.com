import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/login',
    title: 'Sign in',
    description: pagesContent.auth.login.metadataDescription,
  })
}

const perks = [
  'Save guides and directory entries for later',
  'Track what you have published on the home base',
  'One account across the directory and the library',
]

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          {/* Copy column */}
          <div>
            <EditableReveal index={0}>
              <span className={dc.badge.accentPill}>
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.auth.login.badge}
              </span>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`${dc.type.heroTitle} mt-6 max-w-xl`}>
                Welcome back to your{' '}
                <span className="editable-gradient-text">home base</span>.
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`${dc.type.lead} mt-6 max-w-lg`}>
                {pagesContent.auth.login.description}
              </p>
            </EditableReveal>
            <EditableReveal index={3}>
              <ul className="mt-10 grid gap-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm leading-6 text-[var(--slot4-body-text)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                    {perk}
                  </li>
                ))}
              </ul>
            </EditableReveal>
          </div>

          {/* Form column */}
          <EditableReveal index={2}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[var(--slot4-tint-2)]" />
              <div className="relative rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-8 sm:p-10">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="editable-display text-3xl font-normal leading-[1.1] tracking-[-0.01em]">
                    {pagesContent.auth.login.formTitle}
                  </h2>
                  <span className={dc.badge.pill}>{SITE_CONFIG.name}</span>
                </div>
                <div className="mt-6">
                  <EditableLocalLoginForm />
                </div>
                <div className="mt-8 flex items-center gap-3 border-t border-[var(--slot4-line)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                  <span>New here?</span>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline"
                  >
                    {pagesContent.auth.login.createCta}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
