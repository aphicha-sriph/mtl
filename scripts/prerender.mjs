import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = join(projectRoot, 'dist')
let template = await readFile(join(distDirectory, 'index.html'), 'utf8')
const { getPrerenderRoutes, render, BASE } = await import('../.prerender/entry-server.js')

const cssMatch = template.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)
let fullCss = ''
let cssHref = ''
if (cssMatch) {
  cssHref = cssMatch[1]
  const cssPath = join(distDirectory, cssHref.replace(/^\/mtl\//, ''))
  fullCss = await readFile(cssPath, 'utf8')
}

const basePatterns = [
  '@font-face', ':root', /^\*$/, /^html$/, /^body$/,
  /^button,/, /^a$/, /^img$/, /^h[123],/, /^::selection$/, /^:focus-visible$/,
  '.skip-link', '.section-rail', '.has-compare-dock',
  'main > section', '.about-page > section',
  '.site-header', '.brand', '.desktop-nav', '.header-cta', '.menu-button', '.mobile-nav',
  '.button',
]

const pagePatterns = {
  home: ['.home-hero', '.home-finder', '.featured', '.featured-plan', '.needs', '.section-heading'],
  detail: ['.detail-page', '.breadcrumbs', '.detail-hero', '.detail-category', '.page-heading'],
  finder: ['.finder-page', '.page-heading', '.product-card'],
  articles: ['.articles-hero', '.articles-featured', '.page-heading'],
  about: ['.about-hero', '.about-page > section'],
  contact: ['.contact-page', '.page-heading'],
  notFound: ['.not-found'],
}

function getPageType(route) {
  if (route === '/') return 'home'
  if (route.startsWith('/plans/') && route !== '/plans/') return 'detail'
  if (route === '/plans' || route.startsWith('/plans?')) return 'finder'
  if (route.startsWith('/articles')) return 'articles'
  if (route === '/about') return 'about'
  if (route === '/contact') return 'contact'
  return 'notFound'
}

function extractCriticalCss(patterns) {
  function isCritical(selector) {
    return patterns.some(s =>
      typeof s === 'string' ? selector.startsWith(s) || selector.includes(s) : s.test(selector)
    )
  }
  const critical = []
  let i = 0
  while (i < fullCss.length) {
    if (fullCss[i] === '@' && fullCss.startsWith('@media', i)) {
      const braceIdx = fullCss.indexOf('{', i)
      if (braceIdx === -1) break
      const condition = fullCss.slice(i, braceIdx).trim()
      let depth = 1, j = braceIdx + 1
      while (j < fullCss.length && depth > 0) {
        if (fullCss[j] === '{') depth++
        else if (fullCss[j] === '}') depth--
        j++
      }
      const mediaBody = fullCss.slice(braceIdx + 1, j - 1)
      const innerRules = []
      const ruleRe = /([^{}]+)\{([^{}]*)\}/g
      let rm
      while ((rm = ruleRe.exec(mediaBody)) !== null) {
        if (isCritical(rm[1].trim())) innerRules.push(rm[0])
      }
      if (innerRules.length) critical.push(`${condition}{${innerRules.join('')}}`)
      i = j
    } else if (fullCss[i] === '@' && fullCss.startsWith('@font-face', i)) {
      const braceIdx = fullCss.indexOf('{', i)
      const endIdx = fullCss.indexOf('}', braceIdx) + 1
      critical.push(fullCss.slice(i, endIdx))
      i = endIdx
    } else {
      const braceIdx = fullCss.indexOf('{', i)
      if (braceIdx === -1) break
      const endIdx = fullCss.indexOf('}', braceIdx) + 1
      const selector = fullCss.slice(i, braceIdx).trim()
      if (selector && isCritical(selector)) critical.push(fullCss.slice(i, endIdx))
      i = endIdx
    }
    while (i < fullCss.length && /\s/.test(fullCss[i])) i++
  }
  return critical.join('')
}

const criticalCssCache = new Map()
function getCriticalCss(route) {
  const type = getPageType(route)
  if (!criticalCssCache.has(type)) {
    const patterns = [...basePatterns, ...(pagePatterns[type] || [])]
    criticalCssCache.set(type, extractCriticalCss(patterns))
  }
  return criticalCssCache.get(type)
}


const configuredOrigin = process.env.SITE_URL || process.env.VITE_SITE_URL || ''
const origin = configuredOrigin ? new URL(configuredOrigin).origin : undefined
const routes = getPrerenderRoutes()

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function absoluteUrl(path) {
  return origin ? new URL(path, origin).href : path
}

function renderImagePreload(seo) {
  const srcset = /\.webp$/i.test(seo.image)
    ? `${seo.image.replace(/\.webp$/i, '-480.webp')} 480w, ${seo.image.replace(/\.webp$/i, '-768.webp')} 768w, ${seo.image.replace(/\.webp$/i, '-960.webp')} 960w, ${seo.image} 1448w`
    : ''
  return `<link rel="preload" as="image" href="${escapeAttribute(seo.image)}"${srcset ? ` imagesrcset="${escapeAttribute(srcset)}" imagesizes="(max-width: 760px) 100vw, 52vw"` : ''} fetchpriority="high" />`
}

function renderHead(seo) {
  const canonical = absoluteUrl(seo.canonicalPath)
  const image = absoluteUrl(seo.image)
  const schemas = seo.schemas.map((schema) => `<script type="application/ld+json" data-seo-schema="true">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`).join('\n    ')
  const hreflangTags = origin
    ? `<link rel="alternate" hreflang="th" href="${escapeAttribute(canonical)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeAttribute(canonical)}" />`
    : ''

  return `<!-- SEO_START -->
    <title>${escapeAttribute(seo.title)}</title>
    <meta name="description" content="${escapeAttribute(seo.description)}" />
    <meta name="robots" content="${escapeAttribute(seo.robots)}" />
    <link rel="canonical" href="${escapeAttribute(canonical)}" />${hreflangTags ? `\n    ${hreflangTags}` : ''}
    <meta property="og:locale" content="th_TH" />
    <meta property="og:type" content="${seo.type}" />
    <meta property="og:site_name" content="MTL ชีวิตที่ออกแบบได้" />
    <meta property="og:title" content="${escapeAttribute(seo.title)}" />
    <meta property="og:description" content="${escapeAttribute(seo.description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:image" content="${escapeAttribute(image)}" />
    <meta property="og:image:width" content="${seo.imageWidth}" />
    <meta property="og:image:height" content="${seo.imageHeight}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta name="twitter:image" content="${escapeAttribute(image)}" />${seo.imageAlt ? `
    <meta property="og:image:alt" content="${escapeAttribute(seo.imageAlt)}" />` : ''}${seo.publishedAt ? `
    <meta property="article:published_time" content="${seo.publishedAt}" />` : ''}${seo.modifiedAt ? `
    <meta property="article:modified_time" content="${seo.modifiedAt}" />` : ''}
    ${schemas}
    <!-- SEO_END -->`
}

async function writeRoute(route) {
  const { html, seo } = render(route, origin)
  const outputPath = route === '/'
    ? join(distDirectory, 'index.html')
    : join(distDirectory, route.slice(1), 'index.html')
  const page = template
    .replace('<!-- LCP_PRELOAD -->', renderImagePreload(seo))
    .replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, renderHead(seo))
    .replace('<script type="module"', '<script type="module" fetchpriority="low"')
    .replaceAll(/\s*<link rel="modulepreload" crossorigin href="[^"]*">/g, '')
    .replace(cssMatch?.[0] ?? '', cssMatch
      ? `<style>${fullCss}</style>`
      : '')
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, page)
}

for (const route of routes) await writeRoute(route)
await writeFile(join(distDirectory, 'routes-manifest.json'), `${JSON.stringify(routes, null, 2)}\n`)

const notFound = render('/404', origin)
await writeFile(
  join(distDirectory, '404.html'),
  template
    .replace('<!-- LCP_PRELOAD -->', renderImagePreload(notFound.seo))
    .replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, renderHead(notFound.seo))
    .replace('<script type="module"', '<script type="module" fetchpriority="low"')
    .replaceAll(/\s*<link rel="modulepreload" crossorigin href="[^"]*">/g, '')
    .replace(cssMatch?.[0] ?? '', cssMatch
      ? `<style>${fullCss}</style>`
      : '')
    .replace('<div id="root"></div>', `<div id="root">${notFound.html}</div>`),
)

const basePath = BASE || ''
const robots = [
  'User-agent: *',
  `Allow: ${basePath}/`,
  `Disallow: ${basePath}/brochures/`,
  origin ? `Sitemap: ${origin}${basePath}/sitemap.xml` : '',
].filter(Boolean).join('\n')
await writeFile(join(distDirectory, 'robots.txt'), `${robots}\n`)

if (origin) {
  const today = new Date().toISOString().slice(0, 10)
  function sitemapPriority(route) {
    if (route === '/') return '1.0'
    if (route === '/plans') return '0.9'
    if (route === '/articles') return '0.8'
    if (route === '/contact') return '0.8'
    if (route === '/about') return '0.7'
    if (route.startsWith('/plans/')) return '0.7'
    if (route.startsWith('/articles/')) return '0.6'
    return '0.5'
  }
  function sitemapFreq(route) {
    if (route === '/' || route === '/plans' || route === '/articles') return 'weekly'
    return 'monthly'
  }
  const urls = routes.map((route) => `  <url><loc>${escapeAttribute(new URL(`${basePath}${route}`, origin).href)}</loc><lastmod>${today}</lastmod><changefreq>${sitemapFreq(route)}</changefreq><priority>${sitemapPriority(route)}</priority></url>`).join('\n')
  await writeFile(join(distDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
}

await rm(join(projectRoot, '.prerender'), { recursive: true, force: true })
console.log(`Prerendered ${routes.length} indexable routes${origin ? ` for ${origin}` : ' with relative canonical URLs'}.`)
