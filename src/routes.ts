import { getProductById, products, type CatalogProduct } from './data/catalog'
import { articles, type Article } from './data/articles'
import { routeUrl } from './basePath'

const routeAliases: Record<string, string> = {
  '21c4eb06-6789-49af-8c7d-827a35f60763': 'takaful-saving-10-4',
  '49b8d9b3-edbd-4f42-9d2f-88294fa763a0': 'pa-takaful-safety',
}

export function productSlug(product: CatalogProduct) {
  return routeAliases[product.id] ?? product.id
}

export function productPath(product: CatalogProduct) {
  return routeUrl(`/plans/${productSlug(product)}`)
}

export function productFromSlug(slug: string) {
  const canonicalId = Object.entries(routeAliases).find(([, alias]) => alias === slug)?.[0] ?? slug
  return getProductById(canonicalId)
}

export function articlePath(article: Article) {
  return routeUrl(`/articles/${article.slug}`)
}

export const staticRoutes = ['/', '/plans', '/articles', '/hospitals', '/about', '/contact'] as const

export function getPrerenderRoutes() {
  return [
    ...staticRoutes,
    ...products.map(p => `/plans/${productSlug(p)}`),
    ...articles.map(a => `/articles/${a.slug}`),
  ]
}
