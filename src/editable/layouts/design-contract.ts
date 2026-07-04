import type { CSSProperties } from 'react'

/*
  hirekit-temlis inspired design contract for zerostozeros.com.

  Palette: cream page, deep-purple primary (accent phrases, links), neon-green
  accent (loud CTAs), near-black ink. Instrument Serif for display, Inter for
  body/UI. Soft-corner buttons (0.75rem — NOT pill, NOT sharp). Bordered cards
  with no resting shadow, just hairline `#e0e0e0`. Adjust these tokens to
  reskin the whole site.
*/

export const editableRootStyle = {
  // Core palette
  '--slot4-page-bg': '#fcfaed',
  '--slot4-page-text': '#120e00',
  '--slot4-panel-bg': '#f4f0e2',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#555555',
  '--slot4-soft-muted-text': '#8a8a8a',
  '--slot4-body-text': '#131313',
  '--slot4-accent': '#520080',         // deep purple — headline phrases, links
  '--slot4-accent-fill': '#c6fe01',    // neon green — CTA surface
  '--slot4-accent-b': '#520080',
  '--slot4-accent-soft': '#ebe1fd',
  '--slot4-on-accent': '#120e00',      // ink on top of neon accent
  '--slot4-dark-bg': '#120e00',
  '--slot4-dark-text': '#fcfaed',
  '--slot4-media-bg': '#f4f0e2',
  '--slot4-line': '#e0e0e0',
  '--slot4-line-soft': '#ececec',
  // Wash tints (soft mint, purple, orange)
  '--slot4-tint-1': '#ebe1fd', // purple soft
  '--slot4-tint-2': '#d7fdcf', // mint soft
  '--slot4-tint-3': '#feeecd', // orange soft
  '--slot4-tint-4': '#f4f0e2', // cream raised
  '--slot4-tint-5': '#ebe1fd',
  '--slot4-tint-6': '#d7fdcf',
  '--slot4-icon-1': '#c9b5f5',
  '--slot4-icon-2': '#b4ff1f',
  '--slot4-icon-3': '#fedb9c',
  '--slot4-icon-4': '#e0d9c7',
  '--slot4-icon-5': '#c9b5f5',
  '--slot4-icon-6': '#b4ff1f',
  '--slot4-gradient': 'none',
  '--slot4-body-gradient': 'none',
  // Shell variables consumed by nav/footer
  '--editable-page-bg': '#fcfaed',
  '--editable-page-text': '#120e00',
  '--editable-container': '1200px',
  '--editable-border': '#e0e0e0',
  '--editable-nav-bg': '#fcfaed',
  '--editable-nav-text': '#120e00',
  '--editable-nav-active': '#520080',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#120e00',
  '--editable-cta-text': '#c6fe01',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#120e00',
  '--editable-footer-text': '#fcfaed',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  bodyText: 'text-[var(--slot4-body-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-panel-bg)]',
  warmBg: 'bg-[var(--slot4-tint-3)]',
  lavenderBg: 'bg-[var(--slot4-tint-1)]',
  grayBg: 'bg-[var(--slot4-panel-bg)]',
  border: 'border-[var(--slot4-line)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

// Rotating soft washes used to give each tile in a grid its own tint.
export const editableCardTints = [
  { bg: 'var(--slot4-tint-1)', icon: 'var(--slot4-icon-1)' },
  { bg: 'var(--slot4-tint-2)', icon: 'var(--slot4-icon-2)' },
  { bg: 'var(--slot4-tint-3)', icon: 'var(--slot4-icon-3)' },
  { bg: 'var(--slot4-tint-4)', icon: 'var(--slot4-icon-4)' },
  { bg: 'var(--slot4-tint-5)', icon: 'var(--slot4-icon-5)' },
  { bg: 'var(--slot4-tint-6)', icon: 'var(--slot4-icon-6)' },
] as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8',
    // hirekit rhythm: 5rem md → 7rem lg → 9rem xl
    sectionY: 'py-16 sm:py-24 lg:py-32',
    sectionYLarge: 'py-20 sm:py-28 lg:py-36',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[260px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow:
      'inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]',
    // Instrument Serif hero — huge, tight leading, no negative letter-spacing needed
    heroTitle:
      'text-[3rem] font-normal leading-[1.02] tracking-[-0.01em] sm:text-[4.5rem] lg:text-[5.5rem]',
    sectionTitle:
      'text-[2.25rem] font-normal leading-[1.05] tracking-[-0.01em] sm:text-[3rem] lg:text-[3.5rem]',
    body: 'text-base leading-[1.55] text-[var(--slot4-body-text)]',
    lead: 'text-lg leading-[1.55] text-[var(--slot4-muted-text)] sm:text-xl',
    // Italic Instrument Serif accent phrase (highlight word within headlines)
    emphasis: 'editable-gradient-text',
  },
  surface: {
    // Bordered, no resting shadow — hirekit signature
    card: 'rounded-[1.25rem] border border-[var(--slot4-line)] bg-white',
    soft: 'rounded-[1.25rem] border border-[var(--slot4-line)] bg-[var(--slot4-panel-bg)]',
    dark: 'rounded-[1.25rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]',
    tinted: 'rounded-[1.25rem] border border-[var(--slot4-line)]',
  },
  button: {
    // Soft-corner (0.75rem), NOT pill — hirekit signature
    // Primary: near-black surface + neon-green ink
    primary:
      'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-accent-fill)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]',
    // Secondary: transparent + ink border
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--slot4-page-text)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] active:scale-[0.98]',
    // Loudest CTA: neon-green surface + near-black ink
    accent:
      'editable-gradient-bg inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--slot4-body-text)] transition duration-300 hover:text-[var(--slot4-accent)]',
    dark:
      'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-accent-fill)] transition duration-300 hover:-translate-y-0.5 active:scale-[0.98]',
  },
  badge: {
    // Small pill chips — still rounded-full for chips, buttons stay soft-corner
    pill: 'inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-line)] bg-white px-3 py-1 text-xs font-medium text-[var(--slot4-muted-text)]',
    accentPill:
      'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--slot4-accent)]',
    gradientPill:
      'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-xs font-semibold text-[var(--slot4-on-accent)]',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[1.25rem] bg-[var(--slot4-media-bg)]',
    frameFull: 'relative overflow-hidden rounded-[1.75rem] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[16/10]',
    ratioSquare: 'aspect-square',
    ratioWide: 'aspect-[16/9]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:border-[var(--slot4-page-text)]',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-500 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Adjust the palette + fonts only through editableRootStyle and editable-global.css — everything downstream reads them via CSS vars.',
  'Keep page structure in src/editable/sections/HomeSections.tsx.',
  'Use wide readable grids; never create skinny paragraph columns.',
  'Use horizontal rails for dense post browsing.',
  'Do not replace posts with mock arrays.',
  'All post links go through postHref() so task routes keep working.',
] as const
