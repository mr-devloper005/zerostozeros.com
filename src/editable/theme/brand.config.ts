import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

// hirekit-temlis inspired palette:
// - cream page (#fcfaed)
// - deep purple primary (#520080) reserved for headings/links/accent surfaces
// - neon-green accent (#c6fe01) — loudest CTA surface, ink stays near-black
export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents: {
    primary: '#520080',
    secondary: '#c6fe01',
    surface: '#fcfaed',
    gradient: 'none',
  },
} as const
