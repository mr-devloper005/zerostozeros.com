import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Field notes worth your calm attention.',
    description: 'Longer reads on the community, the businesses in the directory, and the guides in the library.',
    filterLabel: 'Choose topic',
    secondaryNote: 'Reading surfaces need space, hierarchy and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Marketplace',
    headline: 'Fresh offers and time-sensitive notices.',
    description: 'Practical, action-oriented posts. Scan fast, act quickly.',
    filterLabel: 'Filter marketplace category',
    secondaryNote: 'Prioritise urgency, short summaries and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved shelf',
    headline: 'A curated shelf of useful links.',
    description: 'Bookmarks worth keeping — tools, resources, references, and collections.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need calm metadata and light grouping.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'Creators, businesses and voices behind the home base.',
    description: 'Identity, trust and reputation cues shown before the grid begins.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity and credibility visible before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Creator profiles'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'Downloadable guides, ready for your reference.',
    description: 'Full-file previews, quick facts and one-click save. The Reference Library keeps working guides at hand.',
    filterLabel: 'Filter reference type',
    secondaryNote: 'Reference surfaces need file context, preview panes and clear browsing.',
    chips: ['Guides', 'Reports', 'Save & share'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Local businesses, verified and easy to reach.',
    description: 'Location, hours and direct contact rows — surfaced up-front so you can act without scrolling.',
    filterLabel: 'Filter directory category',
    secondaryNote: 'Prioritise location, comparison and direct action paths.',
    chips: ['Directory', 'Compare', 'Local discovery'],
  },
  image: {
    eyebrow: 'Visual feed',
    headline: 'A gallery-first stream of standout visuals.',
    description: 'Image-led posts with a portfolio-like rhythm — visuals carry the page.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
