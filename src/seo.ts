import { assetUrl, routeUrl } from './basePath'
import { DISPLAYED_CARD_COUNT, type CatalogProduct } from './data/catalog'
import { articles, getArticleBySlug, type Article } from './data/articles'
import { getDetailedProductContent } from './data/productDetails'
import { articlePath, productFromSlug, productPath } from './routes'

export interface SeoData {
  title: string
  description: string
  canonicalPath: string
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  type: 'website' | 'article'
  robots: string
  schemas: Record<string, unknown>[]
  publishedAt?: string
  modifiedAt?: string
}

const brandName = 'MTL ชีวิตที่ออกแบบได้'
const siteName = 'MTL ชีวิตที่ออกแบบได้ — เมืองไทยประกันชีวิต'
const defaultImage = assetUrl('/images/hero-family.webp')
const defaultImageAlt = 'ครอบครัวไทยหลายวัยใช้เวลาร่วมกันอย่างมีความสุข'

function absoluteUrl(path: string, origin?: string) {
  if (!origin) return path
  return new URL(path, origin).href
}

function truncate(value: string, maxLength: number) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1).trim()}…`
}

const categoryKeywords: Record<string, string> = {
  whole_life: 'ประกันชีวิต',
  health: 'ประกันสุขภาพ',
  critical_illness: 'ประกันโรคร้ายแรง',
  retirement: 'ประกันบำนาญ',
  savings_and_index_linked: 'ประกันออมทรัพย์',
  personal_accident: 'ประกันอุบัติเหตุ',
  unit_linked: 'ประกันยูนิตลิงค์',
  universal_life: 'ประกันยูนิเวอร์แซลไลฟ์',
  group: 'ประกันกลุ่ม',
  takaful: 'ประกันตะกาฟุล',
}

const categorySearchTerms: Record<string, string> = {
  whole_life: 'ประกันชีวิตลดหย่อนภาษี',
  health: 'ประกันสุขภาพเหมาจ่าย',
  critical_illness: 'ประกันโรคร้ายแรง',
  retirement: 'ประกันบำนาญเกษียณ',
  savings_and_index_linked: 'ประกันออมทรัพย์',
  personal_accident: 'ประกันอุบัติเหตุ',
  unit_linked: 'ยูนิตลิงค์ลงทุน',
  universal_life: 'ยูนิเวอร์แซลไลฟ์',
  group: 'ประกันกลุ่มพนักงาน',
  takaful: 'ตะกาฟุลอิสลาม',
}

function productSeo(product: CatalogProduct, origin?: string): SeoData {
  const canonicalPath = productPath(product)
  const productUrl = absoluteUrl(canonicalPath, origin)
  const keyword = categoryKeywords[product.category] ?? 'ประกัน'
  const searchTerm = categorySearchTerms[product.category] ?? keyword
  const description = truncate(
    `${product.name} ${keyword} เมืองไทยประกันชีวิต — ${product.helperText} เช็คเบี้ย อายุรับ ความคุ้มครอง สิทธิลดหย่อนภาษี ดาวน์โหลดโบรชัวร์ฟรี`,
    160,
  )

  const detailedContent = getDetailedProductContent(product)
  const faqSchema: Record<string, unknown>[] = detailedContent.faqs.length > 0
    ? [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: detailedContent.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.join(' '),
          },
        })),
      }]
    : []

  return {
    title: truncate(`${product.name} | ${searchTerm} เมืองไทยประกันชีวิต`, 70),
    description,
    canonicalPath,
    image: product.imagePath,
    imageAlt: `ภาพประกอบแผน${product.name} ${keyword} เมืองไทยประกันชีวิต`,
    imageWidth: 1448,
    imageHeight: 1086,
    type: 'article',
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: product.name,
        description: product.helperText,
        image: absoluteUrl(product.imagePath, origin),
        category: product.categoryLabel,
        brand: { '@type': 'Brand', name: 'เมืองไทยประกันชีวิต' },
        provider: {
          '@type': 'Organization',
          name: 'บริษัท เมืองไทยประกันชีวิต จำกัด (มหาชน)',
          url: 'https://www.muangthai.co.th',
        },
        url: productUrl,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
          { '@type': 'ListItem', position: 2, name: 'แผนประกัน', item: absoluteUrl(routeUrl('/plans'), origin) },
          { '@type': 'ListItem', position: 3, name: product.categoryLabel, item: absoluteUrl(routeUrl(`/plans?category=${product.category}`), origin) },
          { '@type': 'ListItem', position: 4, name: product.name, item: productUrl },
        ],
      },
      ...faqSchema,
    ],
  }
}

function articleSeo(article: Article, origin?: string): SeoData {
  const canonicalPath = articlePath(article)
  const articleUrl = absoluteUrl(canonicalPath, origin)

  return {
    title: truncate(`${article.seoTitle} | บทความ MTL เมืองไทยประกันชีวิต`, 70),
    description: truncate(article.description, 160),
    canonicalPath,
    image: article.image,
    imageAlt: article.imageAlt,
    imageWidth: 1448,
    imageHeight: 1086,
    type: 'article',
    publishedAt: article.publishedAt,
    modifiedAt: article.publishedAt,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        image: absoluteUrl(article.image, origin),
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        inLanguage: 'th-TH',
        keywords: article.keywords.join(', '),
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        author: { '@type': 'Organization', name: brandName, url: absoluteUrl(routeUrl('/'), origin) },
        publisher: {
          '@type': 'Organization',
          name: brandName,
          url: absoluteUrl(routeUrl('/'), origin),
          logo: { '@type': 'ImageObject', url: absoluteUrl(assetUrl('/icon.svg'), origin) },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
          { '@type': 'ListItem', position: 2, name: 'บทความ', item: absoluteUrl(routeUrl('/articles'), origin) },
          { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
        ],
      },
    ],
  }
}

export function getSeoData(location: string, origin?: string): SeoData {
  const url = new URL(location, origin ?? 'https://local.invalid')
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const common = {
    canonicalPath: routeUrl(path),
    image: defaultImage,
    imageAlt: defaultImageAlt,
    imageWidth: 1586,
    imageHeight: 992,
    type: 'website' as const,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  }

  if (path.startsWith('/plans/')) {
    const product = productFromSlug(decodeURIComponent(path.slice('/plans/'.length)))
    if (product) return productSeo(product, origin)
  }

  if (path.startsWith('/articles/')) {
    const article = getArticleBySlug(decodeURIComponent(path.slice('/articles/'.length)))
    if (article) return articleSeo(article, origin)
  }

  if (path === '/plans') {
    return {
      ...common,
      title: `เปรียบเทียบประกันชีวิต ประกันสุขภาพ ${DISPLAYED_CARD_COUNT} แผน | เมืองไทยประกันชีวิต`,
      description: 'เปรียบเทียบแผนประกันชีวิต ประกันสุขภาพ โรคร้ายแรง ออมทรัพย์ บำนาญ อุบัติเหตุ จากเมืองไทยประกันชีวิต เช็คเบี้ย สิทธิลดหย่อนภาษี ดาวน์โหลดโบรชัวร์ พร้อมข้อมูลก่อนตัดสินใจ',
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `ค้นหาและเปรียบเทียบแผนประกัน ${DISPLAYED_CARD_COUNT} รายการ`,
          description: `รวมข้อมูลแผนประกันชีวิตและประกันสุขภาพ ${DISPLAYED_CARD_COUNT} รายการจากเมืองไทยประกันชีวิต`,
          url: absoluteUrl(routeUrl('/plans'), origin),
          isPartOf: { '@type': 'WebSite', name: siteName, url: absoluteUrl(routeUrl('/'), origin) },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
            { '@type': 'ListItem', position: 2, name: 'แผนประกัน' },
          ],
        },
      ],
    }
  }

  if (path === '/articles') {
    return {
      ...common,
      title: 'บทความประกันชีวิต ประกันสุขภาพ วางแผนการเงิน ลดหย่อนภาษี | MTL',
      description: 'รวมบทความประกันชีวิต ประกันสุขภาพ วางแผนการเงิน ลดหย่อนภาษี วางแผนเกษียณ จากเมืองไทยประกันชีวิต อธิบายเข้าใจง่าย พร้อมแนวทางตรวจสอบข้อมูล',
      image: assetUrl('/images/articles/annual-review-v2.webp'),
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'บทความวางแผนประกันและการเงิน',
          description: 'ความรู้เรื่องประกันชีวิต ประกันสุขภาพ การเงิน ภาษี และเกษียณสำหรับคนไทย',
          url: absoluteUrl(routeUrl('/articles'), origin),
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: articles.length,
            itemListElement: articles.map((article, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: article.title,
              url: absoluteUrl(articlePath(article), origin),
            })),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
            { '@type': 'ListItem', position: 2, name: 'บทความ' },
          ],
        },
      ],
    }
  }

  if (path === '/hospitals') {
    return {
      ...common,
      title: 'โรงพยาบาลคู่สัญญา เมืองไทยประกันชีวิต | ค้นหาโรงพยาบาลทั่วประเทศ',
      description: 'ค้นหาโรงพยาบาลคู่สัญญาเมืองไทยประกันชีวิต ครอบคลุมกว่า 168 แห่งทั่วประเทศ รวม MTL Smile Hospital Network โรงพยาบาลเอกชน โรงพยาบาลรัฐ คลินิก Fax Claim ไม่สำรองจ่าย',
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'โรงพยาบาลคู่สัญญาเมืองไทยประกันชีวิต',
          description: 'รายชื่อโรงพยาบาลคู่สัญญาเมืองไทยประกันชีวิตทั่วประเทศ',
          url: absoluteUrl(routeUrl('/hospitals'), origin),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
            { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลคู่สัญญา' },
          ],
        },
      ],
    }
  }

  if (path === '/about') {
    return {
      ...common,
      title: 'ที่ปรึกษาประกันชีวิต เมืองไทยประกันชีวิต | ทีมผู้เชี่ยวชาญวางแผนประกัน',
      description: 'รู้จักทีมที่ปรึกษาประกันชีวิต เมืองไทยประกันชีวิต ผู้เชี่ยวชาญวางแผนประกันชีวิต ประกันสุขภาพ ออมทรัพย์ เกษียณ อธิบายชัดเจน วางแผนตรงชีวิตจริง',
      image: assetUrl('/images/about/team-portrait.webp'),
      imageAlt: 'ทีมที่ปรึกษาประกันชีวิต เมืองไทยประกันชีวิต',
      schemas: [
        { '@context': 'https://schema.org', '@type': 'AboutPage', name: 'เกี่ยวกับทีมที่ปรึกษา', url: absoluteUrl(routeUrl('/about'), origin) },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
            { '@type': 'ListItem', position: 2, name: 'เกี่ยวกับเรา' },
          ],
        },
      ],
    }
  }

  if (path === '/contact') {
    return {
      ...common,
      title: 'ติดต่อที่ปรึกษาประกันชีวิต ปรึกษาฟรี | เมืองไทยประกันชีวิต',
      description: 'ติดต่อที่ปรึกษาประกันชีวิต เมืองไทยประกันชีวิต ปรึกษาฟรี โทร LINE ส่งข้อมูลให้ติดต่อกลับ วางแผนประกันชีวิต ประกันสุขภาพ ออมทรัพย์ เกษียณ ลดหย่อนภาษี',
      schemas: [
        { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'ติดต่อที่ปรึกษาประกัน', url: absoluteUrl(routeUrl('/contact'), origin) },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
            { '@type': 'ListItem', position: 2, name: 'ติดต่อเรา' },
          ],
        },
      ],
    }
  }

  if (path !== '/') {
    return {
      ...common,
      title: 'ไม่พบหน้าที่ค้นหา — MTL ชีวิตที่ออกแบบได้',
      description: 'ไม่พบหน้าที่คุณกำลังมองหา กลับไปสำรวจแผนประกันทั้งหมดได้จากหน้าแผนประกัน',
      robots: 'noindex,follow',
      schemas: [],
    }
  }

  return {
    ...common,
    title: 'ประกันชีวิต ประกันสุขภาพ เมืองไทยประกันชีวิต | เปรียบเทียบแผน ลดหย่อนภาษี',
    description: `เปรียบเทียบประกันชีวิต ประกันสุขภาพ โรคร้ายแรง ออมทรัพย์ บำนาญ อุบัติเหตุ ${DISPLAYED_CARD_COUNT} แผน จากเมืองไทยประกันชีวิต เช็คเบี้ย สิทธิลดหย่อนภาษี ดาวน์โหลดโบรชัวร์ฟรี`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: absoluteUrl(routeUrl('/'), origin),
        inLanguage: 'th-TH',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${absoluteUrl(routeUrl('/plans'), origin)}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: brandName,
        url: absoluteUrl(routeUrl('/'), origin),
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl(assetUrl('/icon.svg'), origin),
        },
        sameAs: ['https://www.muangthai.co.th'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: 'Thai',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SiteNavigationElement',
        name: ['หน้าแรก', 'แผนประกัน', 'เปรียบเทียบ', 'บทความ', 'เกี่ยวกับเรา', 'ติดต่อเรา'],
        url: [
          absoluteUrl(routeUrl('/'), origin),
          absoluteUrl(routeUrl('/plans'), origin),
          absoluteUrl(routeUrl('/plans?compare=1'), origin),
          absoluteUrl(routeUrl('/articles'), origin),
          absoluteUrl(routeUrl('/about'), origin),
          absoluteUrl(routeUrl('/contact'), origin),
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: absoluteUrl(routeUrl('/'), origin) },
        ],
      },
    ],
  }
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.append(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value))
}

export function applySeoData(seo: SeoData) {
  const canonical = new URL(seo.canonicalPath, window.location.origin).href
  const image = new URL(seo.image, window.location.origin).href
  document.title = seo.title
  document.documentElement.lang = 'th'

  upsertMeta('meta[name="description"]', { name: 'description', content: seo.description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: seo.robots })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
  upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: String(seo.imageWidth) })
  upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: String(seo.imageHeight) })
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'th_TH' })
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title })
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
  if (seo.imageAlt) upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: seo.imageAlt })
  if (seo.publishedAt) upsertMeta('meta[property="article:published_time"]', { property: 'article:published_time', content: seo.publishedAt })
  if (seo.modifiedAt) upsertMeta('meta[property="article:modified_time"]', { property: 'article:modified_time', content: seo.modifiedAt })

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    document.head.append(canonicalLink)
  }
  canonicalLink.href = canonical

  document.head.querySelectorAll('script[data-seo-schema]').forEach((node) => node.remove())
  seo.schemas.forEach((schema) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seoSchema = 'true'
    script.textContent = JSON.stringify(schema).replace(/</g, '\\u003c')
    document.head.append(script)
  })
}
