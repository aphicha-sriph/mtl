import { access, readdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDirectory = join(projectRoot, 'dist')

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectHtml(path))
    else if (entry.name === 'index.html') files.push(path)
  }
  return files
}

const pages = await collectHtml(distDirectory)
const expectedRoutes = JSON.parse(await readFile(join(distDirectory, 'routes-manifest.json'), 'utf8'))
const failures = []
const titles = new Set()
const canonicals = new Set()

for (const page of pages) {
  const html = await readFile(page, 'utf8')
  const route = page === join(distDirectory, 'index.html')
    ? '/'
    : `/${dirname(page).slice(distDirectory.length + 1)}`
  const rawTitle = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const title = rawTitle?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  const rawDesc = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]
  const description = rawDesc?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length

  if (!title || title.length < 20 || title.length > 70) failures.push(`${route}: title length ${title?.length ?? 0}`)
  if (!description || description.length < 80 || description.length > 220) failures.push(`${route}: description length ${description?.length ?? 0}`)
  if (!canonical) failures.push(`${route}: missing canonical`)
  if (h1Count !== 1) failures.push(`${route}: expected one h1, found ${h1Count}`)
  if (!html.includes('application/ld+json')) failures.push(`${route}: missing structured data`)
  if (!html.includes('name="robots" content="index,follow')) failures.push(`${route}: not indexable`)
  if (title && titles.has(title)) failures.push(`${route}: duplicate title`)
  if (canonical && canonicals.has(canonical)) failures.push(`${route}: duplicate canonical`)
  if (title) titles.add(title)
  if (canonical) canonicals.add(canonical)

  for (const imageTag of html.match(/<img\s[^>]+>/g) ?? []) {
    if (!/\swidth="\d+"/.test(imageTag) || !/\sheight="\d+"/.test(imageTag)) failures.push(`${route}: image missing intrinsic dimensions`)
    const source = imageTag.match(/\ssrc="([^"]+)"/)?.[1]
    if (source?.startsWith('/')) {
      try { await access(join(distDirectory, source)) }
      catch { console.warn(`${route}: missing image ${source}`) }
    }
  }
}

await access(join(distDirectory, 'robots.txt'))
if (process.env.SITE_URL || process.env.VITE_SITE_URL) await access(join(distDirectory, 'sitemap.xml'))

if (pages.length !== expectedRoutes.length) failures.push(`expected ${expectedRoutes.length} prerendered pages, found ${pages.length}`)

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`SEO validation passed for ${pages.length} prerendered pages.`)
}
