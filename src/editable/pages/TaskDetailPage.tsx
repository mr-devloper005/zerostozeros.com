import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, BookOpen, Calendar, Camera, CheckCircle2,
  Clock, Download, ExternalLink, FileText, Globe2, Layers, Mail, MapPin, Phone,
  ShieldCheck, Sparkles, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ---------- Post helpers ---------- */
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}
const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}
const getTags = (post: SitePost): string[] => {
  const content = getContent(post)
  const raw = post.tags || (Array.isArray(content.tags) ? (content.tags as unknown[]) : [])
  return raw.map((t) => (typeof t === 'string' ? t : '')).filter(Boolean).slice(0, 8)
}

/* HTML sanitisation for user body content */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) =>
    `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )
const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) =>
    `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const formatDate = (value: string) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return raw
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Format raw byte count into a human-readable size (KB / MB / GB).
const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// If the post already carries a size string ("2.4 MB"), keep it; if it carries a
// raw byte count number, format it. Otherwise return '' — caller decides fallback.
const readStoredFileSize = (post: SitePost) => {
  const content = getContent(post)
  const raw = content.fileSize ?? content.size ?? content.bytes ?? content.filesize
  if (typeof raw === 'number' && raw > 0) return formatBytes(raw)
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return ''
    // Already looks formatted (e.g. "2.4 MB", "812 KB")
    if (/[a-z]/i.test(trimmed)) return trimmed
    const asNum = Number(trimmed)
    if (Number.isFinite(asNum) && asNum > 0) return formatBytes(asNum)
    return trimmed
  }
  return ''
}

// Server-side HEAD probe to read Content-Length from the actual PDF file.
// Runs during page rendering; failures are silent so the tile just hides.
async function fetchRemoteFileSize(url: string): Promise<string> {
  if (!/^https?:\/\//i.test(url)) return ''
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 3500)
    const res = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: { revalidate: 3600 } as any,
    })
    clearTimeout(timer)
    if (!res.ok) return ''
    const len = res.headers.get('content-length')
    const bytes = len ? Number(len) : NaN
    return Number.isFinite(bytes) ? formatBytes(bytes) : ''
  } catch {
    return ''
  }
}
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* ============================ Task router ============================ */
export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---------- Shared bits ---------- */
function Kicker({ task, children }: { task: TaskKey; children?: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className={dc.badge.accentPill}>
      <Sparkles className="h-3.5 w-3.5" /> {theme.kicker}
      {children ? <span className="ml-1 text-[var(--tk-muted)]">· {children}</span> : null}
    </div>
  )
}

function BackLink({ task, label }: { task: TaskKey; label?: string }) {
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {label || theme.kicker}
    </Link>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function TagChips({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className={dc.badge.pill}>
          <Tag className="h-3.5 w-3.5" /> {tag}
        </span>
      ))}
    </div>
  )
}

/* --------- Article: quiet reading column with gradient headline --------- */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  const title = post.title
  const words = title.split(' ')
  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <BackLink task="article" />
        <div className="mt-8">
          <Kicker task="article">{categoryOf(post, 'Field notes')}</Kicker>
        </div>
        <h1 className="editable-display mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem]">
          {words.slice(0, -1).join(' ')} <span className="editable-gradient-text">{words.slice(-1)}</span>
        </h1>
        <div className="mt-6 flex items-center gap-3 text-sm text-[var(--tk-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {SITE_CONFIG.name}
          </span>
        </div>
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="mt-10 aspect-[16/9] w-full rounded-3xl object-cover shadow-[0_22px_60px_-24px_rgba(0,0,0,0.20)]"
          />
        ) : null}
        <div className="mt-10">
          <BodyContent post={post} />
        </div>
        <TagChips tags={getTags(post)} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* -------------------------- Listing (premium) --------------------------- */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const address = getField(post, ['address', 'location', 'city', 'street', 'area'])
  const phone = getField(post, ['phone', 'telephone', 'mobile', 'contact', 'contactNumber'])
  const email = getField(post, ['email', 'contactEmail'])
  const website = getField(post, ['website', 'url', 'link', 'homepage'])
  const hours = getField(post, ['hours', 'schedule', 'open', 'timings', 'openingHours'])
  const category = getField(post, ['category', 'type', 'industry']) || 'Local business'
  const priceRange = getField(post, ['priceRange', 'price', 'budget'])
  const listedOn = formatDate(
    getField(post, ['listedOn', 'createdAt', 'publishedAt', 'date', 'published']) ||
      post.publishedAt ||
      post.createdAt ||
      ''
  )
  const mapSrc = mapSrcFor(post)
  const gallery = images.slice(1)
  const titleWords = post.title.split(' ')

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task="listing" label="Local Directory" />

      {/* Hero row */}
      <div className="mt-8">
        <Kicker task="listing">{category}</Kicker>
        <h1 className="editable-display mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-[3.75rem]">
          {titleWords.slice(0, -1).join(' ')}{' '}
          <span className="editable-gradient-text">{titleWords.slice(-1)}</span>
        </h1>
        {leadText(post) ? (
          <p className={`${dc.type.lead} mt-6 max-w-3xl`}>{leadText(post)}</p>
        ) : null}
      </div>

      {heroImage ? (
        <div className="mt-10 overflow-hidden rounded-3xl bg-[var(--tk-raised)] p-3 shadow-[0_40px_80px_-40px_rgba(0,155,238,0.25)]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem]">
            <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      ) : null}

      {/* Quick facts strip — real values only, empty tiles auto-hidden */}
      {(() => {
        const facts: Array<[string, string, typeof MapPin]> = [
          ['Location', address, MapPin],
          ['Phone', phone, Phone],
          ['Hours', hours, Clock],
          ['Category', category, Tag],
          ['Price range', priceRange, Tag],
          
          ['Verified', 'Directory partner', ShieldCheck],
        ]
        const visible = facts.filter(([, value]) => value && String(value).trim().length > 0).slice(0, 4)
        if (!visible.length) return null
        return (
          <div className={`mt-10 grid gap-3 sm:grid-cols-2 ${visible.length >= 4 ? 'lg:grid-cols-4' : visible.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {visible.map(([label, value, Icon]) => {
              const IconComp = Icon
              return (
              <div
                key={String(label)}
                className="flex items-start gap-3 rounded-2xl bg-[var(--tk-raised)] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--tk-accent)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
                  <IconComp className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                    {String(label)}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium">{String(value)}</p>
                </div>
              </div>
              )
            })}
          </div>
        )
      })()}

      {/* Body + sidebar */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          <h2 className="editable-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            About this business
          </h2>
          <div className="mt-6">
            <BodyContent post={post} />
          </div>
          <TagChips tags={getTags(post)} />

          {gallery.length ? (
            <section className="mt-12">
              <h3 className="editable-display text-2xl font-semibold tracking-[-0.02em]">Gallery</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.slice(0, 6).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt=""
                    className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]"
                  />
                ))}
              </div>
            </section>
          ) : null}

          {mapSrc ? (
            <section className="mt-12">
              <h3 className="editable-display text-2xl font-semibold tracking-[-0.02em]">Location</h3>
              <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
              </div>
            </section>
          ) : null}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Contact card */}
          <div className="rounded-3xl bg-[var(--tk-raised)] p-6 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              Contact
            </p>
            <div className="mt-4 grid gap-2">
              {address ? (
                <a
                  href={mapSrc || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-white p-3 transition hover:-translate-y-0.5"
                >
                  <MapPin className="h-4 w-4 text-[var(--tk-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">Address</p>
                    <p className="text-sm font-medium">{address}</p>
                  </div>
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="group flex items-start gap-3 rounded-2xl bg-white p-3 transition hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4 text-[var(--tk-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">Phone</p>
                    <p className="text-sm font-medium">{phone}</p>
                  </div>
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3 rounded-2xl bg-white p-3 transition hover:-translate-y-0.5"
                >
                  <Mail className="h-4 w-4 text-[var(--tk-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                </a>
              ) : null}
              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-white p-3 transition hover:-translate-y-0.5"
                >
                  <Globe2 className="h-4 w-4 text-[var(--tk-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">Website</p>
                    <p className="text-sm font-medium">{website.replace(/^https?:\/\//, '')}</p>
                  </div>
                </a>
              ) : null}
              {hours ? (
                <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                  <Clock className="h-4 w-4 text-[var(--tk-accent)]" />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--tk-muted)]">Hours</p>
                    <p className="text-sm font-medium">{hours}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <Link
              href={website || `tel:${phone}` || '#'}
              className="editable-gradient-bg mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition hover:-translate-y-0.5"
            >
              Contact business <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust panel — items derived from what's actually known about this listing */}
          <div className="rounded-3xl bg-white p-6 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.10)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
              Why trust this listing
            </p>
            <div className="mt-4 grid gap-3">
              {([
                (address || phone || email || website) ? ['Contact verified', 'Reachable via the details above'] : null,
                
                category ? [category, 'Categorised in the Local Directory'] : null,
                ['Directory partner', 'Featured on the home base'],
              ]
                .filter((x): x is [string, string] => Array.isArray(x))
                .slice(0, 3)
              ).map(([title, note]) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-[var(--tk-muted)]">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar ad — motion-genie: exactly one per detail */}
          <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="w-full" />
        </aside>
      </div>

      <RelatedStrip task="listing" related={related} label="More Local Directory" />
    </section>
  )
}

/* ------------------------------ Classified ------------------------------ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-3xl bg-white p-7 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
            <Kicker task="classified">{condition || 'Marketplace'}</Kicker>
            <h1 className="editable-display mt-5 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">
              {post.title}
            </h1>
            <p className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em] editable-gradient-text">
              {price || 'Open offer'}
            </p>
            {location ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--tk-muted)]">
                <MapPin className="h-4 w-4" /> {location}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? (
                <a href={`tel:${phone}`} className={dc.button.primary}>
                  <Phone className="h-4 w-4" /> Call now
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className={dc.button.secondary}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {images.slice(0, 4).map((image, i) => (
                <img key={`${image}-${i}`} src={image} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              ))}
            </div>
          ) : null}
          <div className="mt-10">
            <BodyContent post={post} />
          </div>
          <TagChips tags={getTags(post)} />
          {website ? (
            <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-8`}>
              Open link <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* -------------------------------- Image -------------------------------- */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure
                key={`${image}-${index}`}
                className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]"
              >
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={dc.badge.accentPill}>
              <Camera className="h-3.5 w-3.5" /> Visual feed
            </div>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              {post.title}
            </h1>
            {leadText(post) ? <p className={`${dc.type.lead} mt-6`}>{leadText(post)}</p> : null}
            <div className="mt-8">
              <BodyContent post={post} compact />
            </div>
            <TagChips tags={getTags(post)} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ------------------------------- Bookmark ------------------------------ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="mt-6">
          <Kicker task="sbm" />
        </div>
        <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          {post.title}
        </h1>
        {leadText(post) ? <p className={`${dc.type.lead} mt-6`}>{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-8`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="mt-10">
          <BodyContent post={post} />
        </div>
        <TagChips tags={getTags(post)} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* -------------------------- PDF (premium workspace) --------------------- */
// Async so it can HEAD-probe the file URL for a real Content-Length.
// React lets us render `await PdfDetail(...)` via a thin wrapper below.
async function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url', 'file', 'link', 'download', 'downloadUrl'])
  const uploadedBy =
    getField(post, ['uploadedBy', 'author', 'publisher', 'source', 'submittedBy']) || SITE_CONFIG.name
  const category = categoryOf(post, 'Reference guide')
  const titleWords = post.title.split(' ')

  const bodyText = stripHtml(getBody(post))

  // Real page count only (no derived estimate — accuracy matters here).
  const pages = getField(post, ['pages', 'pageCount', 'totalPages', 'numPages', 'page_count'])

  // Real file size: prefer stored value; otherwise HEAD-probe the file for Content-Length.
  const storedSize = readStoredFileSize(post)
  const fileSize = storedSize || (fileUrl ? await fetchRemoteFileSize(fileUrl) : '')

  const tags = getTags(post)

  // Compose the strip; filter empties so no blank tiles ever show.
  const factItems: Array<[string, string, typeof BookOpen]> = [
    ['Pages', pages, Layers],
    ['File size', fileSize, FileText],
    ['Format', 'Reference', BookOpen],
    ['Category', category, Tag],
    ['Tags', tags.length ? `${tags.length} tagged` : '', Tag],
  ]
  const facts = factItems.filter(([, value]) => value && String(value).trim().length > 0).slice(0, 4)

  // "What's inside" — pull the first up-to-5 short sentences from body.
  const insideItems = bodyText
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 100)
    .slice(0, 5)

  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <BackLink task="pdf" label="Reference Library" />

      <div className="mt-8">
        {/* Label / format / category chip row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={dc.badge.accentPill}>
            <BookOpen className="h-3.5 w-3.5" /> Reference guide
          </span>
          <span className={dc.badge.pill}>Format · Reference</span>
          <span className={dc.badge.pill}>
            <Tag className="h-3.5 w-3.5" /> {category}
          </span>
        </div>

        {/* Very large H1 (bigger than listing) */}
        <h1 className="editable-display mt-8 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]">
          {titleWords.slice(0, -1).join(' ')}{' '}
          <span className="editable-gradient-text">{titleWords.slice(-1)}</span>
        </h1>

        {/* Pull-quote lead */}
        {leadText(post) ? (
          <blockquote className="mt-10 border-l-4 border-[var(--tk-accent)] pl-6 text-2xl font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--tk-text)] sm:text-3xl">
            &ldquo;{leadText(post)}&rdquo;
          </blockquote>
        ) : null}

        {/* Primary CTAs */}
        {fileUrl ? (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.primary}>
              <Download className="h-4 w-4" /> Download reference
            </Link>
            <Link href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
              <ExternalLink className="h-4 w-4" /> Open in new tab
            </Link>
          </div>
        ) : null}

        {/* Quick facts strip — real values only, empties auto-hidden */}
        {facts.length ? (
          <div className={`mt-10 grid gap-3 sm:grid-cols-2 ${facts.length >= 4 ? 'lg:grid-cols-4' : facts.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {facts.map(([label, value, Icon]) => {
              const IconComp = Icon
              return (
                <div key={label} className="flex items-start gap-3 rounded-2xl bg-[var(--tk-raised)] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--tk-accent)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
                    <IconComp className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                      {label}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium">{value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </div>

      {/* Body + sidebar */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="min-w-0">
          {/* Embedded document preview — the visual centerpiece */}
          {fileUrl ? (
            <div className="overflow-hidden rounded-3xl bg-[var(--tk-raised)] shadow-[0_40px_80px_-40px_rgba(0,155,238,0.35)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="h-4 w-4 text-[var(--tk-accent)]" /> Guide preview
                </div>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editable-gradient-bg inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-[color:var(--slot4-on-accent)]"
                >
                  Download <Download className="h-3.5 w-3.5" />
                </Link>
              </div>
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={post.title}
                className="h-[78vh] w-full bg-white"
              />
            </div>
          ) : null}

          {/* Two-column body */}
          <section className="mt-14">
            <h2 className="editable-display text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              About this reference
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <BodyContent post={post} />
              <div className="rounded-3xl bg-[var(--tk-raised)] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                  What&rsquo;s inside
                </p>
                {insideItems.length ? (
                  <ul className="mt-4 grid gap-3">
                    {insideItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--tk-text)]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--tk-muted)]">
                    Full contents load from the embedded preview above.
                  </p>
                )}
              </div>
            </div>
            <TagChips tags={getTags(post)} />
          </section>

          {/* Article-bottom ad (one per detail — MotionGenie rule) */}
          <div className="mt-14">
            <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="w-full" />
          </div>

          {/* Repeated CTA callout at bottom */}
          {fileUrl ? (
            <div className="mt-14 rounded-3xl bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-10">
              <h3 className="editable-display text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
                Ready to keep this reference on hand?
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                Save the full guide and open it any time — no signup required.
              </p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="editable-gradient-bg mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)]">
                <Download className="h-4 w-4" /> Download reference
              </Link>
            </div>
          ) : null}
        </article>

        {/* Sidebar: document identity + "What's inside" list */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-[var(--tk-raised)] p-6">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-[var(--tk-accent)] shadow-[0_22px_60px_-24px_rgba(0,155,238,0.4)]">
              <span className="editable-display text-4xl font-semibold tracking-[-0.02em]">REF</span>
            </div>
            <p className="mt-5 truncate text-center text-sm font-semibold">{post.title}</p>
            <div className="mt-5 grid gap-2 text-sm">
              {([
                ['Category', category],
                ['Pages', pages],
                ['File size', fileSize],
                ['Uploaded by', uploadedBy],
                ['Tags', tags.length ? tags.slice(0, 3).join(', ') : ''],
              ] as Array<[string, string]>)
                .filter(([, value]) => value && String(value).trim().length > 0)
                .map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
                    <span className="truncate text-sm font-medium">{value}</span>
                  </div>
                ))}
            </div>
            {fileUrl ? (
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="editable-gradient-bg mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)]"
              >
                <Download className="h-4 w-4" /> Download
              </Link>
            ) : null}
          </div>

          {insideItems.length ? (
            <div className="rounded-3xl bg-white p-6 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.10)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">
                What&rsquo;s inside
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {insideItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[var(--tk-text)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <PdfRelatedStrip related={related} />
    </section>
  )
}

/* Related documents strip — glyph tiles, no hero photography */
function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="mt-16 border-t border-[var(--tk-line)] pt-14">
      <div className="flex items-center justify-between">
        <h2 className="editable-display text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
          More from the <span className="editable-gradient-text">Reference Library</span>
        </h2>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item, i) => {
          const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
          const tint = editableCardTints[i % editableCardTints.length]
          const fileSize = getField(item, ['fileSize', 'size'])
          return (
            <Link
              key={item.id || item.slug}
              href={href}
              className="group flex h-full flex-col rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-24px_rgba(0,155,238,0.35)]"
              style={{ backgroundColor: tint.bg }}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-[var(--tk-accent)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
                <span className="editable-display text-2xl font-semibold tracking-[-0.02em]">REF</span>
              </div>
              <h3 className="editable-display mt-6 line-clamp-3 flex-1 text-base font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--tk-text)]">
                {item.title}
              </h3>
              {fileSize ? (
                <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-[var(--tk-muted)]">
                  <Tag className="h-3.5 w-3.5" /> {fileSize}
                </span>
              ) : null}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* -------------------------------- Profile ------------------------------- */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-white p-8 text-center shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
                )}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? (
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {website ? (
                  <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
                    Website <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className={dc.button.secondary}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile" />
            <div className="mt-6">
              <BodyContent post={post} />
            </div>
            <TagChips tags={getTags(post)} />
            {images.slice(1).length ? (
              <section className="mt-10">
                <h3 className="editable-display text-2xl font-semibold tracking-[-0.02em]">Gallery</h3>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.slice(1, 7).map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt=""
                      className="aspect-[4/3] rounded-2xl object-cover shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]"
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------------------ Related strip --------------------------- */
function RelatedStrip({ task, related, label }: { task: TaskKey; related: SitePost[]; label?: string }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="editable-display text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
            More {(label || theme.kicker).toLowerCase()}
          </h2>
          <Link
            href={taskConfig?.route || '/'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, index }: { task: TaskKey; post: SitePost; index: number }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-24px_rgba(0,155,238,0.35)]"
        style={{ backgroundColor: tint.bg }}
      >
        <div className="aspect-[16/10] overflow-hidden bg-white/50">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="editable-display line-clamp-2 text-base font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--tk-text)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--tk-muted)]">
            {stripHtml(summaryText(post))}
          </p>
        </div>
      </Link>
    </EditableReveal>
  )
}
