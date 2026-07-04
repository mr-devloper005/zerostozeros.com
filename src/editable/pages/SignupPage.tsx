import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Create account',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

const perks = [
  'Add a business to the Local Directory',
  'Upload guides to the Reference Library',
  'Share field notes and posts to the home base',
]

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-28">
          {/* Form column */}
          <EditableReveal index={0}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[var(--slot4-tint-1)]" />
              <div className="relative rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-8 sm:p-10">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="editable-display text-3xl font-normal leading-[1.1] tracking-[-0.01em]">
                    {pagesContent.auth.signup.formTitle}
                  </h1>
                  <span className={dc.badge.pill}>{SITE_CONFIG.name}</span>
                </div>
                <div className="mt-6">
                  <EditableLocalSignupForm />
                </div>
                <div className="mt-8 flex items-center gap-3 border-t border-[var(--slot4-line)] pt-6 text-sm text-[var(--slot4-muted-text)]">
                  <span>Already have an account?</span>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline"
                  >
                    {pagesContent.auth.signup.loginCta}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </EditableReveal>

          {/* Copy column */}
          <div className="lg:pl-6">
            <EditableReveal index={1}>
              <span className={dc.badge.accentPill}>
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.auth.signup.badge}
              </span>
            </EditableReveal>
            <EditableReveal index={2}>
              <h2 className={`${dc.type.heroTitle} mt-6 max-w-xl`}>
                Create your account and{' '}
                <span className="editable-gradient-text">start publishing</span>.
              </h2>
            </EditableReveal>
            <EditableReveal index={3}>
              <p className={`${dc.type.lead} mt-6 max-w-lg`}>
                {pagesContent.auth.signup.description}
              </p>
            </EditableReveal>
            <EditableReveal index={4}>
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
        </section>
      </main>
    </EditableSiteShell>
  )
}
