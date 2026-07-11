import { Fragment } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight, BookOpen, BriefcaseBusiness, ChevronDown, Download, FileText,
  Globe, MapPin, Phone, Search, Tag, UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [
    ...media,
    ...images,
    ...(isUrl(image) ? [image] : []),
    ...(isUrl(logo) ? [logo] : []),
  ]
    .filter(Boolean)
    .slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-7 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

// Shared pastel-wash card base (soft shadow, rotating tint applied inline).
const cardBase =
  'group block rounded-[var(--tk-radius)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_-24px_rgba(0,155,238,0.35)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = theme.kicker
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  // Motion-genie-style single ad placement per task archive:
  //   listing → in-feed slot;  pdf → header slot.
  const showFeedAd = task === 'listing'
  const showHeaderAd = task === 'pdf'

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,155,238,0.14),rgba(230,114,0,0.05)_45%,transparent_70%)] blur-3xl" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <EditableReveal index={1}>
              <h1 className={`${dc.type.heroTitle} mt-6 max-w-3xl text-balance`}>
                {voice?.headline?.split(' ').slice(0, -2).join(' ') || `Browse the ${label}`}
                {voice?.headline ? (
                  <>
                    {' '}
                    <span className="editable-gradient-text">
                      {voice.headline.split(' ').slice(-2).join(' ')}
                    </span>
                  </>
                ) : null}
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`${dc.type.lead} mt-6 max-w-2xl`}>{voice?.description || theme.note}</p>
            </EditableReveal>

            {voice?.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span key={chip} className={dc.badge.pill}>
                      {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-10 flex flex-col gap-4 rounded-3xl border border-[var(--tk-line)] bg-white p-4 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.10)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-[var(--tk-muted)]">
                  <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span>{' '}
                  {posts.length === 1 ? 'post' : 'posts'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-white pl-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="editable-gradient-bg inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        {showHeaderAd ? (
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 pt-2 sm:px-6 lg:px-8">
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <Fragment key={post.id || post.slug || index}>
                  <EditableReveal index={index % 6}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>
                  {showFeedAd && index === 5 ? (
                    <div className="col-span-full my-2">
                      <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-[var(--tk-line)] bg-white px-8 py-16 text-center shadow-[0_22px_60px_-24px_rgba(0,0,0,0.08)]">
              <Search className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">
                Try another category, or check back after fresh {label.toLowerCase()} entries land.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-medium transition hover:-translate-y-0.5 hover:border-[var(--tk-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full bg-[var(--tk-raised)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="editable-gradient-bg rounded-xl px-5 py-2.5 font-semibold text-[color:var(--slot4-on-accent)] transition hover:-translate-y-0.5"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({
  post,
  task,
  basePath,
  index,
}: {
  post: SitePost
  task: TaskKey
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} index={index} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} index={index} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Field notes')
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`} style={{ backgroundColor: tint.bg }}>
      <div className="aspect-[16/10] overflow-hidden bg-white/50">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-accent)]">
          <span>{category}</span>
          <span className="text-[var(--tk-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read post" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link
      href={href}
      className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}
      style={{ backgroundColor: tint.bg }}
    >
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
        {logo ? (
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-xl font-semibold tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-2 line-clamp-1 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website
            </span>
          ) : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link
      href={href}
      className={`${cardBase} flex flex-col p-6 sm:p-7`}
      style={{ backgroundColor: tint.bg }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-semibold tracking-[-0.03em] editable-gradient-text">
          {price || 'Open offer'}
        </span>
        {condition ? (
          <span className={dc.badge.accentPill}>{condition}</span>
        ) : null}
      </div>
      <h2 className="editable-display mt-5 text-xl font-semibold leading-[1.2] tracking-[-0.02em]">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-white/60 pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-5 block break-inside-avoid overflow-hidden rounded-2xl bg-[var(--tk-raised)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_-24px_rgba(0,155,238,0.35)]"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.78))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.01em] text-white">
            {post.title}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
            View image <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`} style={{ backgroundColor: tint.bg }}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--tk-accent)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">
          Saved · {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-1.5 text-lg font-semibold leading-[1.2] tracking-[-0.02em]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? (
          <p className="mt-3 truncate text-xs font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p>
        ) : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getCategory(post, 'Reference')
  const fileSize = getField(post, ['fileSize', 'size'])
  const pages = getField(post, ['pages', 'pageCount'])
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`} style={{ backgroundColor: tint.bg }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--tk-accent)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
          <BookOpen className="h-7 w-7" />
        </div>
        <span className={dc.badge.pill}>{category}</span>
      </div>
      <h2 className="editable-display mt-6 text-xl font-semibold leading-[1.2] tracking-[-0.02em]">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-[var(--tk-muted)]">
        {pages ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
            <FileText className="h-3.5 w-3.5" /> {pages} pages
          </span>
        ) : null}
        {fileSize ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
            <Tag className="h-3.5 w-3.5" /> {fileSize}
          </span>
        ) : null}
      </div>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-accent)]">
        Open guide <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <Link
      href={href}
      className={`${cardBase} flex flex-col items-center p-7 text-center`}
      style={{ backgroundColor: tint.bg }}
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.14)]">
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />
        )}
      </div>
      <h2 className="editable-display mt-5 text-lg font-semibold tracking-[-0.02em]">{post.title}</h2>
      {role ? (
        <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p>
      ) : null}
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
