import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Bookmark, Building2, CheckCircle2, Compass, FileText, Image as ImageIcon,
  Library, MapPin, Megaphone, Search, Sparkles, Star, UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { editableCardTints, editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'

/*
  MotionGenie-styled home sections.

  Section order:
    1. EditableHomeHero        — big gradient headline + pill search + hero image
    2. EditableStoryRail       — six pastel-tinted "category" feature cards
    3. EditableMagazineSplit   — alternating deep-dive rows (post-showcase)
    4. EditableTimeCollections — time-window post grids with rotating tints
    5. EditableHomeCta         — final "start exploring" CTA slab
*/

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: Library,
  profile: UserRound,
}

function displayLabel(task: TaskKey) {
  return getTaskTheme(task).kicker
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function firstUsableImage(posts: SitePost[]) {
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (img && !img.includes('placeholder')) return img
  }
  return ''
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

/* ============================== 1. Hero =============================== */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImage = firstUsableImage(pool)
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const totalCount = pool.length
  const categoryCount = enabledTasks.length
  const heroTitleWords = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Ambient gradient wash */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,155,238,0.14),rgba(230,114,0,0.05)_45%,transparent_70%)] blur-3xl" />

      <div className={`relative ${container} pt-16 pb-14 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24`}>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Copy column */}
          <div>
            <EditableReveal index={0}>
              <span className={dc.badge.accentPill}>
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.home.hero.badge || 'Discovery, done right'}
              </span>
            </EditableReveal>

            <EditableReveal index={1}>
              <h1 className={`${dc.type.heroTitle} mt-6 max-w-2xl text-balance`}>
                {heroTitleWords.split(' ').slice(0, -2).join(' ')}{' '}
                <span className="editable-gradient-text">
                  {heroTitleWords.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
            </EditableReveal>

            <EditableReveal index={2}>
              <p className={`mt-6 max-w-xl ${dc.type.lead}`}>{pagesContent.home.hero.description}</p>
            </EditableReveal>

            {/* Search pill */}
            <EditableReveal index={3}>
              <form
                action="/search"
                className="mt-8 flex w-full max-w-xl items-center overflow-hidden rounded-full border border-[var(--slot4-line)] bg-white shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)] transition duration-300 focus-within:-translate-y-0.5 focus-within:border-[var(--slot4-accent)]"
              >
                <div className="flex flex-1 items-center gap-3 pl-5">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    placeholder={pagesContent.home.hero.searchPlaceholder || 'Search directory & reference library…'}
                    className="w-full min-w-0 bg-transparent py-4 text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </div>
                <button className="editable-gradient-bg m-1.5 shrink-0 rounded-xl px-6 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)]">
                  Search
                </button>
              </form>
            </EditableReveal>

            {/* Category quick-jumps as pill chips */}
            <EditableReveal index={4}>
              <div className="mt-6 flex flex-wrap gap-2">
                {enabledTasks.slice(0, 6).map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--slot4-line)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--slot4-body-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    {displayLabel(task.key as TaskKey)}
                  </Link>
                ))}
              </div>
            </EditableReveal>
          </div>

          {/* Media column — pastel-framed hero image */}
          <EditableReveal index={2} className="relative">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[var(--slot4-panel-bg)]" />
              <div className="relative overflow-hidden rounded-[2rem] bg-[var(--slot4-tint-3)] p-3 shadow-[0_40px_80px_-40px_rgba(0,155,238,0.35)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-white">
                  {heroImage ? (
                    <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--slot4-soft-muted-text)]">
                      <Compass className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              {/* Floating stat chip */}
              <div className="absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-[var(--slot4-line)] bg-white p-4 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
                <span className="editable-gradient-bg flex h-10 w-10 items-center justify-center rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none">{totalCount}+</p>
                  <p className="text-xs text-[var(--slot4-muted-text)]">Posts published</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 flex items-center gap-3 rounded-2xl border border-[var(--slot4-line)] bg-white p-4 shadow-[0_22px_60px_-24px_rgba(0,0,0,0.14)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--slot4-tint-4)] text-[var(--slot4-accent)]">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-lg font-semibold leading-none">{categoryCount}</p>
                  <p className="text-xs text-[var(--slot4-muted-text)]">Live categories</p>
                </div>
              </div>
            </div>
          </EditableReveal>
        </div>

        {/* Trust band — real-data driven, no fake testimonials */}
        <EditableReveal index={5}>
          <div className="mt-20 grid gap-4 rounded-3xl bg-[var(--slot4-panel-bg)] p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {[
              { value: `${totalCount}+`, label: 'Posts published' },
              { value: `${categoryCount}`, label: 'Discovery lanes' },
              { value: '100%', label: 'Free to browse' },
              { value: '24/7', label: 'Open library' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="editable-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                  <span className="editable-gradient-text">{stat.value}</span>
                </p>
                <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </EditableReveal>
      </div>

      {/* Bottom fade into next section */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--slot4-line)] to-transparent" />
      {/* Suppress unused warnings while keeping API stable */}
      <span data-primary-task={primaryTask} data-primary-route={primaryRoute} className="sr-only" />
    </section>
  )
}

/* =========================== 2. Category rail =========================== */
export function EditableStoryRail({ primaryRoute, primaryTask, posts, timeSections }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled)
  if (!categories.length) return null

  // Suppress warnings while keeping API stable
  void primaryTask; void posts; void timeSections; void primaryRoute

  return (
    <section className="bg-white">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <EditableReveal index={0}>
          <div className="mx-auto max-w-3xl text-center">
            <span className={dc.badge.accentPill}>
              <Compass className="h-3.5 w-3.5" /> One home, many lanes
            </span>
            <h2 className={`${dc.type.sectionTitle} mt-5`}>
              A single place to <span className="editable-gradient-text">discover, verify, download</span>.
            </h2>
            <p className={`${dc.type.lead} mx-auto mt-5 max-w-2xl`}>
              Every lane below opens onto real posts — no marketing filler. Jump into whichever fits your search.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((task, index) => {
            const Icon = taskIcon[task.key as TaskKey] || FileText
            const tint = editableCardTints[index % editableCardTints.length]
            const theme = getTaskTheme(task.key as TaskKey)
            return (
              <EditableReveal key={task.key} index={index}>
                <Link
                  href={task.route}
                  className={`group relative flex h-full flex-col rounded-3xl p-8 ${dc.motion.lift}`}
                  style={{ backgroundColor: tint.bg }}
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: tint.icon }}
                  >
                    <Icon className="h-7 w-7 text-[var(--slot4-page-text)]" />
                  </span>
                  <h3 className="editable-display mt-6 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">
                    {theme.kicker}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{theme.note}</p>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)]">
                    Open lane
                    <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================ 3. Deep-dive alternating feature rows ================= */
function DeepDiveRow({
  post,
  href,
  index,
  eyebrow,
}: { post: SitePost; href: string; index: number; eyebrow: string }) {
  const flipped = index % 2 === 1
  const image = getEditablePostImage(post)
  const tint = editableCardTints[index % editableCardTints.length]
  return (
    <EditableReveal index={index} className="relative">
      <div className={`grid gap-10 lg:grid-cols-2 lg:items-center ${flipped ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div>
          <span className={dc.badge.accentPill}>{eyebrow}</span>
          <h3 className="editable-display mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {post.title}
          </h3>
          <p className={`${dc.type.body} mt-5 max-w-xl text-[var(--slot4-muted-text)]`}>
            {getExcerpt(post, 220) || 'Open the post for details.'}
          </p>
          <Link
            href={href}
            className="mt-7 inline-flex items-center gap-2 rounded-xl editable-gradient-bg px-6 py-3 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5"
          >
            Open post <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[2rem] p-3"
            style={{ backgroundColor: tint.bg }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-white">
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.03]" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </EditableReveal>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 3)
  if (!activity.length) return null
  const eyebrows = ['Fresh drop', 'From the library', 'Community pick']
  return (
    <section className="bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-20 sm:py-24 lg:py-28`}>
        <EditableReveal index={0}>
          <div className="mx-auto max-w-3xl text-center">
            <span className={dc.badge.accentPill}>
              <Sparkles className="h-3.5 w-3.5" /> Recently added
            </span>
            <h2 className={`${dc.type.sectionTitle} mt-5`}>
              Real posts, <span className="editable-gradient-text">real time</span>.
            </h2>
            <p className={`${dc.type.lead} mx-auto mt-5 max-w-2xl`}>
              Every card below is a live entry from the platform — the newest addition sits at the top.
            </p>
          </div>
        </EditableReveal>

        <div className="mt-16 space-y-20">
          {activity.map((post, i) => (
            <DeepDiveRow
              key={post.id || post.slug}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              index={i}
              eyebrow={eyebrows[i % eyebrows.length]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================ 4. Time-window collections (real data) ================ */
function TileCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const tint = editableCardTints[index % editableCardTints.length]
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl ${dc.motion.lift}`}
        style={{ backgroundColor: tint.bg }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
          {category ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
              {category}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--slot4-page-text)]">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">
            {getExcerpt(post, 110)}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent)]">
            Read post <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string; accent: string }> = {
  spotlight: { eyebrow: 'Last 7 days', title: 'Fresh this week', accent: 'new drops' },
  browse: { eyebrow: 'Trending', title: 'Popular this month', accent: 'active picks' },
  index: { eyebrow: 'Evergreen', title: 'From the archive', accent: 'stays useful' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore', accent: 'browse' }
        const isAlt = sIndex % 2 === 1
        return (
          <section key={section.key} className={isAlt ? 'bg-[var(--slot4-panel-bg)]' : 'bg-white'}>
            <div className={`${container} py-16 sm:py-20 lg:py-24`}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <EditableReveal index={0}>
                  <div>
                    <span className={dc.badge.accentPill}>{copy.eyebrow}</span>
                    <h2 className={`${dc.type.sectionTitle} mt-4`}>
                      {copy.title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="editable-gradient-text">{copy.title.split(' ').slice(-1)}</span>
                    </h2>
                  </div>
                </EditableReveal>
                <EditableReveal index={1}>
                  <Link
                    href={section.href || primaryRoute}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--slot4-body-text)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    See all <ArrowRight className="h-4 w-4" />
                  </Link>
                </EditableReveal>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <TileCard
                    key={post.id || post.slug}
                    post={post}
                    href={postHref(primaryTask, post, primaryRoute)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ============================== 5. CTA slab ============================= */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${container} py-24 sm:py-28`}>
        <div className="mx-auto max-w-4xl text-center">
          <EditableReveal index={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <CheckCircle2 className="h-3.5 w-3.5" /> Start exploring
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h2 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Got something worth <span className="editable-gradient-text">sharing?</span>
            </h2>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-white/70">
              Add your business, upload a reference guide, or share a post — everything lives on the same home base.
            </p>
          </EditableReveal>
          <EditableReveal index={3}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/create"
                className="editable-gradient-bg inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-[color:var(--slot4-on-accent)] transition duration-300 hover:-translate-y-0.5"
              >
                Publish a post <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/60"
              >
                Talk to us
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}
