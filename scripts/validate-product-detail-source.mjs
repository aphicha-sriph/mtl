import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalog = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/muangthai-official-products-2026-09-30.json'), 'utf8'))
const dataset = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/muangthai-product-detail-content-2026-10-01.json'), 'utf8'))
const verifiedDataset = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/muangthai-verified-exclusions-2026-10-01.json'), 'utf8'))
const verifiedBenefitsDataset = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/muangthai-verified-benefits-2026-10-01.json'), 'utf8'))
const compact = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src/data/productDetailDisplay.json'), 'utf8'))
const allowedHosts = new Set(['www.muangthai.co.th', 'cdn-ols.muangthai.co.th'])
const errors = []

function routeId(url) {
  const segment = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? url
  return decodeURIComponent(segment).replace(/\.pdf$/i, '').trim().toLocaleLowerCase('en-US')
}

function numberTokens(value) {
  const thaiDigits = '๐๑๒๓๔๕๖๗๘๙'
  const normalized = value.replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)))
  return (normalized.match(/\d[\d,]*(?:\.\d+)?(?:\s*%)?/g) ?? []).map((token) => token.replace(/[\s,]+/g, ''))
}

function numberTokensArePreserved(sourceText, displayText) {
  const sourceCounts = new Map()
  for (const token of numberTokens(sourceText ?? '')) sourceCounts.set(token, (sourceCounts.get(token) ?? 0) + 1)
  for (const token of numberTokens(displayText)) {
    const remaining = sourceCounts.get(token) ?? 0
    if (remaining < 1) return false
    sourceCounts.set(token, remaining - 1)
  }
  return true
}

function allBlocks(product) {
  return [
    ...product.overview,
    ...product.highlights,
    ...product.facts,
    ...product.benefitPeriods,
    ...product.notes,
    ...product.faqs,
    ...(product.contractValidity ? [product.contractValidity] : []),
    ...product.exclusions,
    ...product.warnings,
  ]
}

const expectedRoutes = catalog.cards.map((card) => routeId(card.url)).sort()
const actualRoutes = dataset.products.map((product) => product.routeId).sort()
if (dataset.routeCount !== 43 || dataset.products.length !== 43) errors.push('Expected 43 product routes')
if (dataset.canonicalProductCount !== 42) errors.push('Expected 42 canonical products')
if (JSON.stringify(expectedRoutes) !== JSON.stringify(actualRoutes)) errors.push('Dataset route set differs from official catalog')
if (new Set(actualRoutes).size !== 43) errors.push('Dataset route IDs are not unique')
if (JSON.stringify(compact.products.map((product) => product.routeId).sort()) !== JSON.stringify(actualRoutes)) {
  errors.push('Compact display dataset is out of sync')
}

const compactByRoute = new Map(compact.products.map((product) => [product.routeId, product]))
const sourceDatasetByRoute = new Map(dataset.products.map((product) => [product.routeId, product]))
const verifiedBenefitByRoute = new Map(verifiedBenefitsDataset.records.map((record) => [record.routeId, record]))
const verifiedRoutes = new Set(actualRoutes)
let verifiedBlockCount = 0
let verifiedDisplayItemCount = 0

for (const product of verifiedDataset.products) {
  if (!verifiedRoutes.has(product.routeId)) errors.push(`${product.routeId}: verified OCR route is not in the official catalog`)
  const compactProduct = compactByRoute.get(product.routeId)
  for (const [section, blocks] of Object.entries(product.sections)) {
    const compactBlocks = []
    for (const block of blocks) {
      if (!allowedHosts.has(new URL(block.sourceUrl).hostname)) errors.push(`${block.id}: disallowed verified OCR source host`)
      if (block.pageConvention !== '1-based physical PDF page' || !Number.isInteger(block.page) || block.page < 1) {
        errors.push(`${block.id}: invalid PDF page provenance`)
      }
      if (/[-�]/u.test(block.exactOCRText)) errors.push(`${block.id}: unsafe glyph in OCR evidence`)
      if (block.status === 'unverified' && block.displayItems.length > 0) errors.push(`${block.id}: unverified OCR block emitted display items`)
      if (block.status === 'verified') {
        verifiedBlockCount += 1
        if (block.displayItems.length === 0) errors.push(`${block.id}: verified OCR block has no display items`)
      }
      for (const item of block.displayItems) {
        verifiedDisplayItemCount += 1
        if (item.visuallyVerified !== true) errors.push(`${item.id}: display item was not visually verified`)
        if (!/[฀-๿]/u.test(item.displayText) || /[-�]/u.test(item.displayText)) {
          errors.push(`${item.id}: verified display text is not safe readable Thai`)
        }
        if (JSON.stringify(numberTokens(item.sourceText)) !== JSON.stringify(numberTokens(item.displayText))) {
          errors.push(`${item.id}: verified OCR numeric tokens differ`)
        }
      }
      if (block.status === 'verified') {
        compactBlocks.push({
          page: block.page,
          displayItems: block.displayItems.map((item) => ({ displayText: item.displayText })),
        })
      }
    }
    const hasRicherVerifiedBenefits = section === 'benefits'
      && verifiedBenefitByRoute.get(product.routeId)?.status === 'verified'
      && verifiedBenefitByRoute.get(product.routeId)?.emit === true
    const expectedCompactBlocks = hasRicherVerifiedBenefits ? [] : compactBlocks
    if (JSON.stringify(compactProduct?.verified?.[section] ?? []) !== JSON.stringify(expectedCompactBlocks)) {
      errors.push(`${product.routeId}/${section}: compact verified OCR projection is out of sync`)
    }
  }
}

if (verifiedDataset.droppedBlockCount !== 114) errors.push('Expected OCR evidence for all 114 dropped document blocks')
if (verifiedDataset.verifiedBlockCount !== verifiedBlockCount) errors.push('Verified OCR block count metadata is out of sync')

if (verifiedBenefitsDataset.records.length !== 20) errors.push('Expected 20 manually reviewed dropped benefit records')
if (verifiedBenefitByRoute.size !== verifiedBenefitsDataset.records.length) errors.push('Verified benefit routes are not unique')
let emittedBenefitScheduleCount = 0
for (const record of verifiedBenefitsDataset.records) {
  const sourceProduct = sourceDatasetByRoute.get(record.routeId)
  const source = sourceProduct?.sourceRefs.find((candidate) => candidate.id === record.sourceId)
  const compactProduct = compactByRoute.get(record.routeId)
  if (!source?.authoritative || source.localPath !== record.localPath) {
    errors.push(`${record.routeId}: verified benefit provenance does not match an authoritative source`)
  }
  if (record.emit !== (record.status === 'verified')) errors.push(`${record.routeId}: verified benefit status and emit flag differ`)
  if (!record.emit && (record.periods.length > 0 || record.displayItems.length > 0)) {
    errors.push(`${record.routeId}: unverified benefit record emitted display content`)
  }
  if (/[-�]/u.test(`${record.ocrText ?? ''}${record.sourceText ?? ''}`)) {
    errors.push(`${record.routeId}: unsafe glyph in verified benefit evidence`)
  }
  const expectedSchedule = record.emit
    ? {
        page: record.page,
        periods: record.periods.map((period) => ({ period: period.period, displayItems: period.displayItems })),
        displayItems: record.displayItems,
      }
    : null
  if (JSON.stringify(compactProduct?.verifiedBenefitSchedule ?? null) !== JSON.stringify(expectedSchedule)) {
    errors.push(`${record.routeId}: compact verified benefit schedule is out of sync`)
  }
  if (record.emit) emittedBenefitScheduleCount += 1
  for (const period of record.periods) {
    if (!numberTokensArePreserved(record.sourceText, period.period)) errors.push(`${record.routeId}: benefit period numeric tokens changed`)
    for (const item of period.displayItems) {
      if (!/[฀-๿]/u.test(item) || /[-�]/u.test(item)) errors.push(`${record.routeId}: unsafe benefit display item`)
      if (!numberTokensArePreserved(record.sourceText, item)) errors.push(`${record.routeId}: benefit display numeric tokens changed`)
    }
  }
  for (const item of record.displayItems) {
    if (!/[฀-๿]/u.test(item) || /[-�]/u.test(item)) errors.push(`${record.routeId}: unsafe benefit note`)
    if (!numberTokensArePreserved(record.sourceText, item)) errors.push(`${record.routeId}: benefit note numeric tokens changed`)
  }
}

for (const product of dataset.products) {
  const sources = new Map(product.sourceRefs.map((source) => [source.id, source]))
  for (const source of product.sourceRefs) {
    if (!allowedHosts.has(new URL(source.url).hostname)) errors.push(`${product.routeId}: disallowed source host`)
    if (source.localPath && !source.sha256) errors.push(`${product.routeId}: local document is missing sha256`)
  }
  for (const block of allBlocks(product)) {
    const source = sources.get(block.sourceId)
    if (!source?.authoritative) errors.push(`${product.routeId}/${block.id}: non-authoritative or missing source`)
    if (!block.sourceLocator) errors.push(`${product.routeId}/${block.id}: missing source locator`)
    if (!/[\u0E00-\u0E7F]/u.test(block.displayText)) errors.push(`${product.routeId}/${block.id}: display text is not readable Thai`)
    if (/[\uE000-\uF8FF�]/u.test(block.displayText)) errors.push(`${product.routeId}/${block.id}: unsafe PDF glyph found`)
    if (JSON.stringify(numberTokens(block.sourceText)) !== JSON.stringify(numberTokens(block.displayText))) {
      errors.push(`${product.routeId}/${block.id}: numeric tokens differ`)
    }
  }
  if (product.faqs.some((faq) => faq.editorial !== true)) errors.push(`${product.routeId}: FAQ must be editorial`)
}

if (errors.length > 0) {
  console.error(`Product detail source validation failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Validated authoritative provenance and numeric fidelity for ${dataset.products.length} product routes, ${dataset.validation.emittedBlockCount} source blocks, ${verifiedDisplayItemCount} visually verified OCR items, and ${emittedBenefitScheduleCount} reviewed benefit schedules.`)
