'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  MotionGenie-style dark footer.

  - Multi-column: brand+description, discovery (renamed task labels),
    resources, account.
  - Task labels shown here are the RENAMED display labels from taskThemes
    so the footer stays in sync with the rest of the site.
*/

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks
    .filter((task) => task.enabled)
    .map((task) => ({
      key: task.key,
      href: task.route,
      label: getTaskTheme(task.key as never).kicker,
    }))
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h3 className="editable-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              Ready to dive into <span className="editable-gradient-text">{SITE_CONFIG.name}</span>?
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Browse local businesses and open the reference library — everything on one home base.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="editable-gradient-bg inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5"
            >
              Get started <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/60"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="/favicon.ico" alt="Logo" className="h-10 w-10 rounded-xl" />
            <span className="editable-display text-lg font-semibold tracking-[-0.01em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
          
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Discover</h4>
          <div className="mt-5 grid gap-3">
            {taskLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group inline-flex items-center justify-between gap-3 text-sm font-medium text-white/70 transition duration-300 hover:text-white"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Resources</h4>
          <div className="mt-5 grid gap-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-white/70 transition duration-300 hover:text-white">{label}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">Account</h4>
          <div className="mt-5 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-sm font-medium text-white/70 transition duration-300 hover:text-white">Submit a post</Link>
                <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/70 transition duration-300 hover:text-white">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white/70 transition duration-300 hover:text-white">Sign in</Link>
                <Link href="/signup" className="text-sm font-medium text-white/70 transition duration-300 hover:text-white">Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>{globalContent.footer?.bottomNote || 'Crafted for discovery.'}</span>
        </div>
      </div>
    </footer>
  )
}
