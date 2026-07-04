import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  hirekit-temlis inspired task surfaces.

  Shared visual language: cream page, deep-purple primary, neon-green loud CTA,
  bordered cards, Instrument Serif display + Inter body. Only the eyebrow
  kicker and note copy vary per task. All tokens delivered via `--tk-*`.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentB: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Instrument Serif', 'Times New Roman', Georgia, serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#fcfaed',
  surface: '#ffffff',
  raised: '#f4f0e2',
  text: '#120e00',
  muted: '#555555',
  line: '#e0e0e0',
  accent: '#520080',
  accentB: '#c6fe01',
  accentSoft: '#ebe1fd',
  onAccent: '#120e00',
  glow: 'rgba(82,0,128,0.10)',
  radius: '1.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field notes',
    note: 'Long-form essays, guides and stories worth your time.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Find, compare and connect with local businesses near you.',
  },
  classified: {
    ...base,
    kicker: 'Marketplace',
    note: 'Fresh offers, deals and listings ready to act on.',
  },
  image: {
    ...base,
    kicker: 'Visual feed',
    note: 'A gallery-first stream of standout images and photo stories.',
  },
  sbm: {
    ...base,
    kicker: 'Saved shelf',
    note: 'Curated links and resources worth bookmarking.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, reports and reference material.',
  },
  profile: {
    ...base,
    kicker: 'People',
    note: 'Discover creators, businesses and voices behind the platform.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-b': t.accentB,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--tk-gradient': 'none',
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accentB,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
