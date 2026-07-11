import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Local Directory & Reference Library`,
      description: 'Browse a curated Local Directory of businesses and open the Reference Library of downloadable guides — one home base for discovery.',
      openGraphTitle: `${slot4BrandConfig.siteName} — Local Directory & Reference Library`,
      openGraphDescription: 'Browse local businesses and open the reference library — one home base for discovery.',
      keywords: ['local directory', 'reference library', 'community', 'downloadable guides', 'discovery'],
    },
    hero: {
      badge: 'Discovery, done right',
      title: ['Local businesses, verified', 'and easy to reach.'],
      description: 'Browse the Local Directory to find a business, or open the Reference Library for downloadable guides. Everything lives on one home base.',
      primaryCta: { label: 'Open the directory', href: '/listings' },
      secondaryCta: { label: 'Browse the library', href: '/pdf' },
      searchPlaceholder: 'Search directory & reference library…',
      focusLabel: 'Focus',
      featureCardBadge: 'Latest additions',
      featureCardTitle: 'Fresh entries land on the home page first.',
      featureCardDescription: 'Recent posts shape the visual identity of this home base without changing any core platform behavior.',
    },
    intro: {
      badge: 'What lives here',
      title: 'A single home base for local discovery and reference material.',
      paragraphs: [
        'The Local Directory keeps community businesses easy to find — with location, contact and quick actions surfaced up-front.',
        'The Reference Library keeps downloadable guides and reports at hand — with previews, quick facts and a one-click save.',
        'Whether you start with a business you want to visit or a guide you want to keep, discovery flows through one connected surface.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Local Directory with location, hours and direct contact rows.',
        'Reference Library with guide previews and file metadata.',
        'One connected home base — no jumping between separate microsites.',
        'Every entry stays discoverable through search and category chips.',
      ],
      primaryLink: { label: 'Open the directory', href: '/listings' },
      secondaryLink: { label: 'Browse the library', href: '/pdf' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Everything you need to discover, verify and download.',
      description: 'Explore the directory, save guides for later, and stay on one connected home base.',
      primaryCta: { label: 'Open the directory', href: '/listings' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest entries in this lane.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calm home base for local discovery and reference material.',
    description: `${slot4BrandConfig.siteName} keeps a Local Directory and a Reference Library on one connected surface — so discovery feels quiet and useful, not chaotic.`,
    paragraphs: [
      'Instead of scattering businesses, guides and community entries across separate microsites, everything lives on one home base with a single navigation rhythm.',
      'Whether you arrive to look up a nearby business or to save a reference guide, you can keep exploring related entries without losing context.',
    ],
    values: [
      {
        title: 'Directory-first discovery',
        description: 'Location, contact and quick-actions rows sit right at the top of every business entry so you can act without scrolling.',
      },
      {
        title: 'Reference-quality guides',
        description: 'Downloadable guides carry file metadata, quick facts and preview panes so you know what you are opening before you open it.',
      },
      {
        title: 'One connected home base',
        description: 'A single visual system unifies the directory, the library, and every supporting page — clean navigation, clear structure.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Talk to the team behind the directory and library.',
    description: 'Have a business to list, a guide to add, or a correction to file? Tell us what you need and we will route it through the right lane.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the Local Directory, the Reference Library and every other lane on the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find businesses, guides and posts faster.',
      description: 'Type a keyword, a category, or a business name — the search runs across every lane at once.',
      placeholder: 'Search directory & reference library…',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Submit new entries for the Local Directory or add a guide to the Reference Library.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to add a new entry.',
      description: 'Use your account to open the publishing workspace and add businesses, guides or posts.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add a business, upload a guide, share a post.',
      description: 'Choose the lane, fill in the details, and preview a clean entry before it lands on the home base.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit entry',
    successTitle: 'Entry submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Member access',
      title: 'Welcome back to your home base.',
      description: 'Sign in to keep browsing, save entries, and manage what you have published.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Sign-in successful. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create your account.',
      badge: 'Get started',
      title: 'Create an account and start publishing.',
      description: 'Create an account to open the publishing workspace and add businesses, guides or posts.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related field notes',
      fallbackTitle: 'Post details',
    },
    listing: {
      relatedTitle: 'More from the Local Directory',
      fallbackTitle: 'Business details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Related profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
