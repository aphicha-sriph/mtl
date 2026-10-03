import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(projectRoot, 'data/muangthai-product-detail-content-2026-10-01.json')
const verifiedPath = path.join(projectRoot, 'data/muangthai-verified-exclusions-2026-10-01.json')
const verifiedBenefitsPath = path.join(projectRoot, 'data/muangthai-verified-benefits-2026-10-01.json')
const outputPath = path.join(projectRoot, 'src/data/productDetailDisplay.json')
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
const verified = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'))
const verifiedBenefits = JSON.parse(fs.readFileSync(verifiedBenefitsPath, 'utf8'))

const verifiedByRoute = new Map(verified.products.map((product) => [product.routeId, product]))
const verifiedBenefitsByRoute = new Map(verifiedBenefits.records.map((record) => [record.routeId, record]))

function displayBlock(block) {
  if (!block) return null
  return {
    displayText: block.displayText,
    ...(block.title ? { title: block.title } : {}),
    ...(block.label ? { label: block.label } : {}),
    ...(block.periodLabel ? { periodLabel: block.periodLabel } : {}),
    ...(block.question ? { question: block.question } : {}),
  }
}

function verifiedSection(routeId, section) {
  const product = verifiedByRoute.get(routeId)
  if (!product) return []

  if (section === 'benefits') {
    const richerBenefits = verifiedBenefitsByRoute.get(routeId)
    if (richerBenefits?.status === 'verified' && richerBenefits.emit) return []
  }

  return product.sections[section]
    .filter((block) => block.status === 'verified')
    .map((block) => ({
      page: block.page,
      displayItems: block.displayItems.map((item) => ({ displayText: item.displayText })),
    }))
    .filter((block) => block.displayItems.length > 0)
}

function verifiedBenefitSchedule(routeId) {
  const record = verifiedBenefitsByRoute.get(routeId)
  if (!record || record.status !== 'verified' || !record.emit) return null
  return {
    page: record.page,
    periods: record.periods.map((period) => ({
      period: period.period,
      displayItems: period.displayItems,
    })),
    displayItems: record.displayItems,
  }
}

const compact = {
  schemaVersion: source.schemaVersion,
  snapshotDate: source.snapshotDate,
  products: source.products.map((product) => ({
    routeId: product.routeId,
    overview: product.overview.map(displayBlock),
    highlights: product.highlights.map(displayBlock),
    facts: product.facts.map(displayBlock),
    benefitPeriods: product.benefitPeriods.map(displayBlock),
    notes: product.notes.map(displayBlock),
    faqs: product.faqs.map(displayBlock),
    contractValidity: displayBlock(product.contractValidity),
    exclusions: product.exclusions.map(displayBlock),
    warnings: product.warnings.map(displayBlock),
    verified: {
      benefits: verifiedSection(product.routeId, 'benefits'),
      notes: verifiedSection(product.routeId, 'notes'),
      contractValidity: verifiedSection(product.routeId, 'contractValidity'),
      exclusions: verifiedSection(product.routeId, 'exclusions'),
      warnings: verifiedSection(product.routeId, 'warnings'),
    },
    verifiedBenefitSchedule: verifiedBenefitSchedule(product.routeId),
  })),
}

fs.writeFileSync(outputPath, `${JSON.stringify(compact, null, 2)}\n`)
console.log(`Generated compact display content for ${compact.products.length} product routes.`)
