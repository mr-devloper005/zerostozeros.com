'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, Building2, CheckCircle2, FileText,
  Image as ImageIcon, Library, Lock, Megaphone, Send, Sparkles, UserRound,
} from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  profile: UserRound,
  pdf: Library,
  sbm: Bookmark,
}

const fieldClass =
  'w-full rounded-xl border border-[var(--slot4-line)] bg-white px-4 py-3 text-sm text-[var(--slot4-page-text)] outline-none transition duration-300 placeholder:text-[var(--slot4-soft-muted-text)] focus:-translate-y-0.5 focus:border-[var(--slot4-page-text)]'

const labelClass = 'text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTaskLabel = getTaskTheme(task).kicker

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  /* -------- Locked / logged-out state -------- */
  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <EditableReveal index={0}>
                <div className="relative">
                  <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[var(--slot4-tint-2)]" />
                  <div className="relative flex min-h-72 items-center justify-center rounded-[1.75rem] bg-[var(--slot4-dark-bg)] p-12 text-[var(--slot4-dark-text)]">
                    <Lock className="h-24 w-24 text-[var(--slot4-accent-fill)]" />
                  </div>
                </div>
              </EditableReveal>
              <div>
                <EditableReveal index={1}>
                  <span className={dc.badge.accentPill}>
                    <Sparkles className="h-3.5 w-3.5" /> {pagesContent.create.locked.badge}
                  </span>
                </EditableReveal>
                <EditableReveal index={2}>
                  <h1 className={`${dc.type.heroTitle} mt-6 max-w-xl`}>
                    Sign in to add a{' '}
                    <span className="editable-gradient-text">new entry</span>.
                  </h1>
                </EditableReveal>
                <EditableReveal index={3}>
                  <p className={`${dc.type.lead} mt-6 max-w-lg`}>
                    {pagesContent.create.locked.description}
                  </p>
                </EditableReveal>
                <EditableReveal index={4}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link href="/login" className={dc.button.primary}>
                      Sign in <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/signup" className={dc.button.secondary}>
                      Create account
                    </Link>
                  </div>
                </EditableReveal>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  /* -------- Publishing workspace -------- */
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Header */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-16 pb-8 sm:px-6 sm:pt-24 lg:px-8">
          <EditableReveal index={0}>
            <span className={dc.badge.accentPill}>
              <Sparkles className="h-3.5 w-3.5" /> {pagesContent.create.hero.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-6 max-w-3xl`}>
              Add an entry to your{' '}
              <span className="editable-gradient-text">home base</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.lead} mt-6 max-w-2xl`}>
              {pagesContent.create.hero.description}
            </p>
          </EditableReveal>
        </section>

        {/* Workspace grid */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Task picker sidebar */}
            <aside>
              <EditableReveal index={0}>
                <div className="rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-6">
                  <p className={labelClass}>Pick a lane</p>
                  <div className="mt-4 grid gap-3">
                    {enabledTasks.map((item, i) => {
                      const Icon = taskIcon[item.key as TaskKey] || FileText
                      const active = item.key === task
                      const kicker = getTaskTheme(item.key as TaskKey).kicker
                      const note = getTaskTheme(item.key as TaskKey).note
                      const tint = editableCardTints[i % editableCardTints.length]
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setTask(item.key as TaskKey)}
                          className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition duration-300 ${
                            active
                              ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                              : 'border-[var(--slot4-line)] bg-white hover:-translate-y-0.5 hover:border-[var(--slot4-page-text)]'
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              active ? 'bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]' : ''
                            }`}
                            style={active ? undefined : { backgroundColor: tint.icon }}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <span className="editable-display block text-lg font-normal leading-tight tracking-[-0.01em]">
                              {kicker}
                            </span>
                            <span className={`mt-1 block truncate text-xs ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                              {note}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </EditableReveal>
            </aside>

            {/* Form */}
            <EditableReveal index={1}>
              <form
                onSubmit={submit}
                className="rounded-[1.75rem] border border-[var(--slot4-line)] bg-white p-6 sm:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className={labelClass}>New entry · {activeTaskLabel}</p>
                    <h2 className="editable-display mt-2 text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className={dc.badge.accentPill}>{session.name}</span>
                </div>

                <div className="mt-8 grid gap-5">
                  <div>
                    <label className={labelClass} htmlFor="cf-title">Title</label>
                    <input
                      id="cf-title"
                      className={`${fieldClass} mt-2`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="A clear, descriptive title"
                      required
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="cf-cat">Category</label>
                      <input
                        id="cf-cat"
                        className={`${fieldClass} mt-2`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Coffee, Guides, Field notes"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="cf-url">Source URL</label>
                      <input
                        id="cf-url"
                        className={`${fieldClass} mt-2`}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://…"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cf-img">Featured image URL</label>
                    <input
                      id="cf-img"
                      className={`${fieldClass} mt-2`}
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://…/hero.jpg"
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cf-sum">Summary</label>
                    <textarea
                      id="cf-sum"
                      className={`${fieldClass} mt-2 min-h-24`}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="A short summary (1–2 sentences)"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cf-body">Main content</label>
                    <textarea
                      id="cf-body"
                      className={`${fieldClass} mt-2 min-h-48`}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Details, notes, description…"
                      required
                    />
                  </div>
                </div>

                {created ? (
                  <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[var(--slot4-tint-2)] p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-page-text)]" />
                    <div>
                      <p className="editable-display text-lg font-normal leading-tight tracking-[-0.01em]">
                        {pagesContent.create.successTitle}
                      </p>
                      <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">
                        Saved as draft: <span className="font-medium text-[var(--slot4-page-text)]">{created.title}</span>
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--slot4-line)] pt-6">
                  <button type="submit" className={dc.button.accent}>
                    <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                  </button>
                  <Link href="/" className="text-sm font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]">
                    Cancel
                  </Link>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--slot4-muted-text)]">
                    Saved locally on your device <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
