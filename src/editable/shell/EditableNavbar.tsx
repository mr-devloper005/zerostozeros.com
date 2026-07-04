'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  MotionGenie-style top nav.

  - Logo (brand name) on the left, links to /
  - Center/left: About + Contact only. NO task-archive links.
  - Right: search icon → /search, then auth actions.
  - Mobile menu mirrors the same links.
*/

const staticNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/85 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <img src="/favicon.ico" alt="Logo" className="h-10 w-10 rounded-xl" />
          <span className="editable-display text-lg font-semibold tracking-[-0.01em] text-[var(--editable-nav-text)]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Center static links */}
        <div className="ml-2 hidden items-center gap-1 md:flex">
          {staticNav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
                  active
                    ? 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-body-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--slot4-line)] bg-white text-[var(--slot4-body-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full border border-[var(--slot4-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--slot4-body-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition duration-300 hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--slot4-body-text)] transition duration-300 hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="editable-gradient-bg hidden items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,155,238,0.5)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--slot4-line)] bg-white text-[var(--slot4-body-text)] transition duration-300 sm:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--slot4-line)] to-transparent" />

      {open ? (
        <div className="border-t border-[var(--slot4-line)] bg-white px-4 py-5 sm:hidden">
          <div className="grid gap-1">
            {[{ label: 'Home', href: '/' }, ...staticNav, { label: 'Search', href: '/search' }].map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-accent)]'
                      : 'text-[var(--slot4-body-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-3 border-t border-[var(--slot4-line)] pt-3">
              {session ? (
                <div className="grid gap-2">
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-full border border-[var(--slot4-line)] bg-white px-4 py-3 text-center text-sm font-semibold">Submit</Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-full px-4 py-3 text-center text-sm font-medium text-[var(--slot4-muted-text)]">Log out</button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-[var(--slot4-line)] bg-white px-4 py-3 text-center text-sm font-semibold">Sign in</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="editable-gradient-bg rounded-xl px-4 py-3 text-center text-sm font-semibold text-[color:var(--slot4-on-accent)]">Get started</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
