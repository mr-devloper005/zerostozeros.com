import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal, editableCardTints } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* Editorial hero — dark full-bleed card, gradient accent phrase, pill CTA. */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.85)_100%)]" />
        <div className="absolute inset-x-8 top-8 flex items-center justify-between sm:inset-x-10">
          <span className={`${dc.badge.gradientPill}`}>{label}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
            {getEditableCategory(post)}
          </span>
        </div>
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <h3 className="editable-display max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="editable-gradient-bg mt-8 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 group-hover:-translate-y-0.5">
            Open story <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* Rail card — pastel-tinted, borderless, soft shadow, rotating tint by index. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-2xl ${pal.shadow} ${dc.motion.lift}`}
      style={{ backgroundColor: tint.bg }}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio} bg-white/50`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black backdrop-blur">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-3 text-xl font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 130)}
        </p>
      </div>
    </Link>
  )
}

/* Compact index card — indexed list-style card for dense rows. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group block min-w-0 rounded-2xl bg-white p-5 ${pal.shadow} ${dc.motion.lift}`}
    >
      <div className="flex items-start gap-4">
        <span className="editable-gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-[color:var(--slot4-on-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`inline-flex items-center gap-2 ${dc.type.eyebrow}`}>
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="editable-display mt-2 line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 105)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* Wide list card — image left, text right, arrow CTA. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-5 overflow-hidden rounded-3xl bg-[var(--slot4-panel-bg)] p-4 ${dc.motion.lift} sm:grid-cols-[220px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[180px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={`${dc.type.eyebrow}`}>Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-3xl">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 180)}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
          Open article <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
