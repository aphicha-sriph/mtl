import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import process from 'node:process'
import ts from 'typescript'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const catalogPath = path.join(projectRoot, 'data', 'muangthai-official-products-2026-09-30.json')
const brochureManifestPath = path.join(projectRoot, 'data', 'muangthai-official-brochures-2026-09-30.json')
const catalogSourcePath = path.join(projectRoot, 'src', 'data', 'catalog.ts')
const brochureTextDirectory = path.join(projectRoot, 'tmp', 'brochure-text')
const outputPath = path.join(projectRoot, 'data', 'muangthai-product-detail-content-2026-10-01.json')

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))
const brochureManifest = JSON.parse(await readFile(brochureManifestPath, 'utf8'))
const catalogSource = await readFile(catalogSourcePath, 'utf8')
const sourceFile = ts.createSourceFile('catalog.ts', catalogSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

function unwrap(node) {
  let current = node
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression
  }
  return current
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) return node.text
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  throw new Error(`Unsupported property name in catalog.ts: ${node.getText(sourceFile)}`)
}

function literalValue(node) {
  const value = unwrap(node)
  if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) return value.text
  if (ts.isNumericLiteral(value)) return Number(value.text)
  if (value.kind === ts.SyntaxKind.TrueKeyword) return true
  if (value.kind === ts.SyntaxKind.FalseKeyword) return false
  if (value.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isArrayLiteralExpression(value)) return value.elements.map(literalValue)
  if (ts.isObjectLiteralExpression(value)) {
    const result = {}
    for (const property of value.properties) {
      if (!ts.isPropertyAssignment(property)) continue
      result[propertyName(property.name)] = literalValue(property.initializer)
    }
    return result
  }
  throw new Error(`Unsupported literal in catalog.ts: ${value.getText(sourceFile)}`)
}

function readConstObject(name) {
  let result
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      result = literalValue(node.initializer)
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  if (!result) throw new Error(`Unable to find ${name} in catalog.ts`)
  return result
}

const editorialByName = readConstObject('editorialByName')
const thaiTermLabels = readConstObject('thaiTermLabels')
const productKindLabels = readConstObject('productKindLabels')

const documentsByName = new Map(brochureManifest.items.map((item) => [item.name, item]))
const cardsByName = new Map(catalog.cards.map((card) => [card.name, card]))
const documentHashes = new Map()
for (const document of brochureManifest.items) {
  if (documentHashes.has(document.local_file)) continue
  const file = await readFile(path.join(projectRoot, 'public', 'brochures', document.local_file))
  documentHashes.set(document.local_file, createHash('sha256').update(file).digest('hex'))
}

function routeIdFromUrl(url) {
  const pathname = new URL(url).pathname
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? pathname
  return decodeURIComponent(segment).replace(/\.pdf$/i, '').trim().toLocaleLowerCase('en-US')
}

const routeIdsByName = new Map(catalog.cards.map((card) => [card.name, routeIdFromUrl(card.url)]))

function localize(value) {
  if (value == null) return null
  return thaiTermLabels[value] ?? value
}

function numericTokens(value) {
  const thaiDigits = '๐๑๒๓๔๕๖๗๘๙'
  const normalized = value.replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)))
  return (normalized.match(/\d[\d,]*(?:\.\d+)?(?:\s*%)?/g) ?? []).map((token) =>
    token.replace(/[\s,]+/g, ''),
  )
}

function sameNumericTokens(sourceText, displayText) {
  return JSON.stringify(numericTokens(sourceText)) === JSON.stringify(numericTokens(displayText))
}

function numericSafeDisplay(sourceText, candidate) {
  if (sameNumericTokens(sourceText, candidate)) return candidate
  if (numericTokens(sourceText).length === 0) {
    const withoutIntroducedDigits = candidate
      .replace(/\b1\b/g, 'หนึ่ง')
      .replace(/\b2\b/g, 'สอง')
    if (sameNumericTokens(sourceText, withoutIntroducedDigits)) return withoutIntroducedDigits
  }
  return sourceText
}

function sourceShape(card) {
  if (/\.pdf(?:$|\?)/i.test(card.url)) return 'pdf_only'
  if (card.product_kind === 'segment_page_not_separate_policy') return 'segment'
  if (card.product_kind.startsWith('bundle_')) return 'bundle'
  if (card.product_kind.startsWith('two_')) return 'multi_contract'
  if (card.name === 'สมาร์ท ซิลเวอร์ และ สมาร์ท ซิลเวอร์ พลัส') return 'multi_contract'
  return 'single'
}

function authoritativeSourceId(card, routeId) {
  return /\.pdf(?:$|\?)/i.test(card.url) ? `${routeId}:document` : `${routeId}:page`
}

function makeBlock({ id, sourceId, sourceLocator, sourceText, displayText = sourceText, editorial = false, ...rest }) {
  if (!sourceId || !sourceLocator || typeof sourceText !== 'string' || typeof displayText !== 'string') {
    throw new Error(`Invalid content block ${id}`)
  }
  return { id, sourceId, sourceLocator, sourceText, displayText, editorial, ...rest }
}

function normalizeLines(page) {
  return page
    .split(/\r?\n/)
    .map((line) => line.replace(/[\t ]+/g, ' ').trim())
    .filter(Boolean)
}

function pdfTextQuality(text) {
  const trimmed = text.replace(/\f/g, '').trim()
  const thai = (trimmed.match(/[\u0E00-\u0E7F]/g) ?? []).length
  const replacement = (trimmed.match(/\uFFFD/g) ?? []).length
  if (trimmed.length < 100) return { usable: false, reason: 'image_only_or_empty_text_layer' }
  if (thai < 20) return { usable: false, reason: 'legacy_or_unreadable_text_encoding' }
  if (replacement / Math.max(trimmed.length, 1) > 0.03) {
    return { usable: false, reason: 'damaged_text_encoding' }
  }
  return { usable: true, reason: null }
}

function excerptFromPages(
  pages,
  pattern,
  { before = 0, after = 6, maxChars = 1400, stopPattern = null } = {},
) {
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const lines = normalizeLines(pages[pageIndex])
    const matchIndex = lines.findIndex((line) => pattern.test(line))
    if (matchIndex === -1) continue
    const start = Math.max(0, matchIndex - before)
    const selected = []
    for (let lineIndex = start; lineIndex < Math.min(lines.length, matchIndex + after + 1); lineIndex += 1) {
      if (lineIndex > matchIndex && stopPattern?.test(lines[lineIndex])) break
      selected.push(lines[lineIndex])
    }
    let text = selected.join('\n')
    if (text.length > maxChars) text = text.slice(0, maxChars).trimEnd()
    return {
      page: pageIndex + 1,
      heading: lines[matchIndex],
      text,
    }
  }
  return null
}

async function documentText(document) {
  if (!document || document.kind === 'local_summary') {
    return { quality: { usable: false, reason: document ? 'local_summary_not_authoritative' : 'missing_document' }, pages: [] }
  }
  const textPath = path.join(brochureTextDirectory, document.local_file.replace(/\.pdf$/i, '.txt'))
  const text = await readFile(textPath, 'utf8')
  return { quality: pdfTextQuality(text), pages: text.split('\f') }
}

function sourceRefsFor(card, document, routeId, textQuality) {
  const refs = []
  const isPdfCanonical = /\.pdf(?:$|\?)/i.test(card.url)
  if (!isPdfCanonical) {
    refs.push({
      id: `${routeId}:page`,
      kind: 'official_page',
      url: card.url,
      authoritative: true,
      capturedAt: catalog.snapshot_date,
      extractionMethod: 'catalog_snapshot',
    })
  }
  if (document) {
    const kind = document.kind ?? 'brochure'
    const url = document.source_url ?? new URL(document.brochure_path, brochureManifest.base_url).href
    refs.push({
      id: `${routeId}:document`,
      kind:
        kind === 'local_summary'
          ? 'local_summary'
          : kind === 'product_info'
            ? 'official_product_info'
            : 'official_brochure',
      url,
      localPath: `public/brochures/${document.local_file}`,
      authoritative: kind !== 'local_summary',
      capturedAt: brochureManifest.snapshot_date,
      sha256: documentHashes.get(document.local_file),
      extractionMethod:
        kind === 'local_summary'
          ? 'local_summary_pdf'
          : textQuality?.usable
            ? 'pdf_text_layer'
            : textQuality?.reason === 'image_only_or_empty_text_layer'
              ? 'image_only'
              : 'legacy_or_damaged_text_layer',
    })
  } else if (isPdfCanonical) {
    refs.push({
      id: `${routeId}:document`,
      kind: 'official_brochure',
      url: card.url,
      authoritative: true,
      capturedAt: catalog.snapshot_date,
      extractionMethod: 'remote_pdf',
    })
  }
  return refs
}

const droppedDocumentBlocks = []

function documentExcerptIssue(excerpt) {
  if (!excerpt) return 'not_found'
  if (/[\uE000-\uF8FF\uFFFD]/u.test(excerpt.text)) return 'unsafe_or_unresolved_glyph'
  if (/(?:muangthai\.co\.th|MTL_|\+66\s*\(0\)|ถนนรัชดาภิเษก|บมจ\.\s*เมืองไทยประกันชีวิต|โทร\.\s*ทุกวัน)/iu.test(excerpt.text)) {
    return 'footer_or_contact_text_mixed_into_excerpt'
  }
  if (/(?:ผ้\s+ู|ท่\s+ี)/u.test(excerpt.text)) return 'broken_thai_character_spacing'
  const thaiCharacters = (excerpt.text.match(/[\u0E00-\u0E7F]/g) ?? []).length
  if (thaiCharacters < 12) return 'insufficient_readable_thai'
  const lines = excerpt.text.split('\n').filter(Boolean)
  const tableLikeLines = lines.filter((line) => numericTokens(line).length >= 4).length
  if (lines.length >= 3 && tableLikeLines / lines.length > 0.34) return 'table_like_or_merged_columns'
  const shortTableCells = lines.filter((line) => line.length <= 24).length
  const repeatedCoverageCells = lines.filter((line) => /^(?:ไม่คุ้มครอง|คุ้มครอง)$/u.test(line)).length
  if (lines.length >= 8 && (shortTableCells / lines.length > 0.3 || repeatedCoverageCells >= 2)) {
    return 'table_like_or_merged_columns'
  }
  return null
}

function cleanPdfDisplay(text) {
  return text
    .replace(/ผู้/gu, 'ผู้')
    .replace(/ซ้ือ/gu, 'ซื้อ')
    .replace(/ท่ี/gu, 'ที่')
    .replace(/ฟ้ืน/gu, 'ฟื้น')
}

function pdfBlock(routeId, section, sourceId, excerpt, editorial = false) {
  if (!excerpt) return null
  const issue = documentExcerptIssue(excerpt)
  if (issue) {
    droppedDocumentBlocks.push({ routeId, section, page: excerpt.page, reason: issue })
    return null
  }
  const displayText = cleanPdfDisplay(excerpt.text)
  return makeBlock({
    id: `${routeId}:${section}:pdf`,
    sourceId,
    sourceLocator: `PDF page ${excerpt.page}, excerpt around “${excerpt.heading.slice(0, 90)}”`,
    sourceText: excerpt.text,
    displayText,
    editorial: editorial || displayText !== excerpt.text,
  })
}

const products = []
const ocrLimitations = []

for (const [index, card] of catalog.cards.entries()) {
  const routeId = routeIdFromUrl(card.url)
  const canonicalProductId = card.same_product_as
    ? routeIdsByName.get(card.same_product_as)
    : routeId
  const document = documentsByName.get(card.name)
  const primarySourceId = authoritativeSourceId(card, routeId)
  const editorial = editorialByName[card.name]
  if (!editorial) throw new Error(`Missing source-backed catalog editorial for ${card.name}`)

  const { quality, pages } = await documentText(document)
  const sourceRefs = sourceRefsFor(card, document, routeId, quality)
  if (document && document.kind !== 'local_summary' && !quality.usable) {
    ocrLimitations.push({ routeId, file: document.local_file, reason: quality.reason })
  }

  const benefitExcerpt = quality.usable
    ? excerptFromPages(
        pages,
        /(ตาราง.{0,30}(ผลประโยชน์|ความคุ้มครอง)|ผลประโยชน์.{0,30}ความคุ้มครอง|ผลประโยชน์โดยย่อ|ตารางแสดง.{0,30}แผนความคุ้มครอง)/,
        {
          after: 9,
          maxChars: 1800,
          stopPattern: /(หมายเหตุ|คำเตือน|ความสมบูรณ์ของสัญญา|กรณี.{0,40}(จะไม่คุ้มครอง|ไม่จ่าย)|ข้อยกเว้น)/,
        },
      )
    : null
  const noteExcerpt = quality.usable
    ? excerptFromPages(pages, /หมายเหตุ\s*:?/, {
        after: 6,
        maxChars: 1400,
        stopPattern: /(คำเตือน|ความสมบูรณ์ของสัญญา|กรณี.{0,40}(จะไม่คุ้มครอง|ไม่จ่าย)|ข้อยกเว้น)/,
      })
    : null
  const contractExcerpt = quality.usable
    ? excerptFromPages(pages, /(ความสมบูรณ์ของสัญญา|โมฆียะ|มาตรา\s*865)/, {
        before: 0,
        after: 7,
        maxChars: 1800,
        stopPattern: /(กรณี.{0,40}(จะไม่คุ้มครอง|ไม่จ่าย)|ข้อยกเว้น|คำเตือน)/,
      })
    : null
  const exclusionExcerpt = quality.usable
    ? excerptFromPages(pages, /(กรณี.{0,40}(จะไม่คุ้มครอง|ไม่จ่าย)|ข้อยกเว้น|ไม่คุ้มครอง)/, {
        before: 0,
        after: 9,
        maxChars: 1800,
        stopPattern: /(คำเตือน|หมายเหตุ|ความสมบูรณ์ของสัญญา)/,
      })
    : null
  const warningExcerpt = quality.usable
    ? excerptFromPages(pages, /คำเตือน\s*:?/, { after: 2, maxChars: 900 })
    : null
  const selectedExcerpts = [
    benefitExcerpt,
    noteExcerpt,
    contractExcerpt,
    exclusionExcerpt,
    warningExcerpt,
  ].filter(Boolean)
  const selectedExcerptIssue = selectedExcerpts
    .map(documentExcerptIssue)
    .find((issue) => issue === 'unsafe_or_unresolved_glyph') ?? null
  if (document && document.kind !== 'local_summary' && selectedExcerptIssue) {
    ocrLimitations.push({ routeId, file: document.local_file, reason: selectedExcerptIssue })
  }

  const overview = [
    makeBlock({
      id: `${routeId}:overview`,
      sourceId: primarySourceId,
      sourceLocator: `catalog editorialByName[${JSON.stringify(card.name)}].helperText`,
      sourceText: editorial.helperText,
      displayText: editorial.helperText,
      editorial: true,
    }),
  ]

  const highlights = [
    makeBlock({
      id: `${routeId}:highlight:suitability`,
      sourceId: primarySourceId,
      sourceLocator: `catalog editorialByName[${JSON.stringify(card.name)}].suitability`,
      sourceText: editorial.suitability,
      displayText: editorial.suitability,
      editorial: true,
      title: 'เหมาะกับใคร',
    }),
  ]

  const facts = []
  const factDefinitions = [
    ['entryAge', 'อายุรับประกัน', card.entry_age],
    ['premiumTerm', 'ระยะชำระเบี้ย', card.premium_term],
    ['coverageTerm', 'ระยะคุ้มครอง', card.coverage_term],
    ['groupSize', 'ขนาดกลุ่ม', card.group_size],
    ['productKind', 'ประเภทผลิตภัณฑ์', card.product_kind],
  ]
  for (const [key, label, sourceText] of factDefinitions) {
    if (!sourceText) continue
    const candidate = key === 'productKind' ? productKindLabels[sourceText] ?? sourceText : localize(sourceText)
    const displayText = numericSafeDisplay(sourceText, candidate)
    facts.push(
      makeBlock({
        id: `${routeId}:fact:${key}`,
        sourceId: primarySourceId,
        sourceLocator: `official catalog cards[${index}].${key === 'entryAge' ? 'entry_age' : key === 'premiumTerm' ? 'premium_term' : key === 'coverageTerm' ? 'coverage_term' : key === 'groupSize' ? 'group_size' : 'product_kind'}`,
        sourceText,
        displayText,
        editorial: displayText !== sourceText,
        label,
      }),
    )
  }

  const pdfSourceId = `${routeId}:document`
  const benefitFromPdf = document && document.kind !== 'local_summary'
    ? pdfBlock(routeId, 'benefit', pdfSourceId, benefitExcerpt)
    : null
  const benefitPeriods = benefitFromPdf
    ? [{
        ...benefitFromPdf,
        periodLabel: card.coverage_term
          ? numericSafeDisplay(card.coverage_term, localize(card.coverage_term))
          : 'ตามตารางผลประโยชน์',
        periodSourceText: card.coverage_term ?? null,
      }]
    : [
        makeBlock({
          id: `${routeId}:benefit:catalog`,
          sourceId: primarySourceId,
          sourceLocator: `catalog editorialByName[${JSON.stringify(card.name)}].helperText`,
          sourceText: editorial.helperText,
          displayText: editorial.helperText,
          editorial: true,
          periodLabel: card.coverage_term
            ? numericSafeDisplay(card.coverage_term, localize(card.coverage_term))
            : 'ตามเงื่อนไขของผลิตภัณฑ์',
          periodSourceText: card.coverage_term ?? null,
        }),
      ]

  const notes = [
    makeBlock({
      id: `${routeId}:note:caveat`,
      sourceId: primarySourceId,
      sourceLocator: `catalog editorialByName[${JSON.stringify(card.name)}].caveat`,
      sourceText: editorial.caveat,
      displayText: editorial.caveat,
      editorial: true,
    }),
  ]
  if (document && document.kind !== 'local_summary') {
    const note = pdfBlock(routeId, 'note', pdfSourceId, noteExcerpt)
    if (note) notes.push(note)
  }

  const faqs = []
  const faqDefinitions = [
    ['entryAge', 'รับสมัครอายุเท่าไร?', card.entry_age],
    ['premiumTerm', 'ต้องชำระเบี้ยนานเท่าไร?', card.premium_term],
    ['coverageTerm', 'คุ้มครองนานเท่าไร?', card.coverage_term],
  ]
  for (const [key, question, sourceText] of faqDefinitions) {
    if (!sourceText) continue
    const displayText = numericSafeDisplay(sourceText, localize(sourceText))
    faqs.push(
      makeBlock({
        id: `${routeId}:faq:${key}`,
        sourceId: primarySourceId,
        sourceLocator: `official catalog cards[${index}].${key === 'entryAge' ? 'entry_age' : key === 'premiumTerm' ? 'premium_term' : 'coverage_term'}`,
        sourceText,
        displayText,
        editorial: true,
        question,
      }),
    )
  }

  const contractValidity = document && document.kind !== 'local_summary'
    ? pdfBlock(routeId, 'contractValidity', pdfSourceId, contractExcerpt)
    : null
  const exclusions = []
  if (document && document.kind !== 'local_summary') {
    const exclusion = pdfBlock(routeId, 'exclusion', pdfSourceId, exclusionExcerpt)
    if (exclusion) exclusions.push(exclusion)
  }
  const warnings = []
  if (document && document.kind !== 'local_summary') {
    const warning = pdfBlock(routeId, 'warning', pdfSourceId, warningExcerpt)
    if (warning) warnings.push(warning)
  }

  products.push({
    routeId,
    canonicalProductId,
    name: card.name,
    category: card.category,
    productKind: card.product_kind,
    sourceShape: sourceShape(card),
    sourceRefs,
    overview,
    highlights,
    facts,
    benefitPeriods,
    notes,
    faqs,
    contractValidity,
    exclusions,
    warnings,
    extraction: {
      documentTextUsable: quality.usable,
      limitation: quality.reason ?? selectedExcerptIssue,
    },
  })
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

const validationErrors = []
if (products.length !== 43) validationErrors.push(`Expected 43 routes, received ${products.length}`)
if (new Set(products.map((product) => product.routeId)).size !== 43) {
  validationErrors.push('Route IDs are not unique')
}
if (new Set(products.map((product) => product.canonicalProductId)).size !== 42) {
  validationErrors.push('Expected 42 canonical products')
}

const expectedRouteIds = catalog.cards.map((card) => routeIdFromUrl(card.url)).sort()
const actualRouteIds = products.map((product) => product.routeId).sort()
if (JSON.stringify(actualRouteIds) !== JSON.stringify(expectedRouteIds)) {
  validationErrors.push('Route ID set differs from official catalog')
}

const shapeCounts = Object.fromEntries(
  [...new Set(products.map((product) => product.sourceShape))].map((shape) => [
    shape,
    products.filter((product) => product.sourceShape === shape).length,
  ]),
)
const expectedShapeCounts = { single: 33, segment: 1, bundle: 2, multi_contract: 3, pdf_only: 4 }
if (Object.entries(expectedShapeCounts).some(([shape, count]) => shapeCounts[shape] !== count)) {
  validationErrors.push(`Unexpected sourceShape counts: ${JSON.stringify(shapeCounts)}`)
}

for (const product of products) {
  const sources = new Map(product.sourceRefs.map((source) => [source.id, source]))
  if (product.routeId === 'kids-health-insurance') {
    if (product.canonicalProductId !== 'd-health-lite') {
      validationErrors.push('kids-health-insurance must map to d-health-lite')
    }
  } else if (product.canonicalProductId !== product.routeId) {
    validationErrors.push(`${product.routeId}: unexpected canonical alias`)
  }
  for (const source of product.sourceRefs) {
    const host = new URL(source.url).hostname
    if (!['www.muangthai.co.th', 'cdn-ols.muangthai.co.th'].includes(host)) {
      validationErrors.push(`${product.routeId}/${source.id}: disallowed source host ${host}`)
    }
    if (source.localPath && !source.sha256) {
      validationErrors.push(`${product.routeId}/${source.id}: missing document sha256`)
    }
  }
  for (const block of allBlocks(product)) {
    const source = sources.get(block.sourceId)
    if (!source) validationErrors.push(`${product.routeId}/${block.id}: missing sourceRef`)
    if (source && !source.authoritative) {
      validationErrors.push(`${product.routeId}/${block.id}: cites non-authoritative source`)
    }
    if (!block.sourceLocator) validationErrors.push(`${product.routeId}/${block.id}: missing sourceLocator`)
    if (!/[\u0E00-\u0E7F]/u.test(block.displayText)) {
      validationErrors.push(`${product.routeId}/${block.id}: displayText is not readable Thai`)
    }
    if (/[\uE000-\uF8FF\uFFFD]/u.test(block.displayText)) {
      validationErrors.push(`${product.routeId}/${block.id}: displayText has unsafe glyphs`)
    }
    if (!sameNumericTokens(block.sourceText, block.displayText)) {
      validationErrors.push(`${product.routeId}/${block.id}: numeric tokens differ`)
    }
    if (block.periodSourceText && !sameNumericTokens(block.periodSourceText, block.periodLabel)) {
      validationErrors.push(`${product.routeId}/${block.id}: periodLabel numeric tokens differ`)
    }
  }
  if (product.faqs.some((faq) => faq.editorial !== true)) {
    validationErrors.push(`${product.routeId}: FAQ missing editorial:true`)
  }
}

if (validationErrors.length > 0) {
  throw new Error(`Validation failed:\n${validationErrors.join('\n')}`)
}

const output = {
  schemaVersion: 1,
  snapshotDate: '2026-10-01',
  sourceOwner: catalog.source_owner,
  sourcePolicy: {
    authoritativeKinds: ['official_page', 'official_brochure', 'official_product_info', 'official_policy'],
    nonAuthoritativeKinds: ['local_summary'],
    rule: 'Content blocks may cite authoritative first-party P/D/I sources only. Missing legal sections remain [] or null.',
  },
  routeCount: products.length,
  canonicalProductCount: new Set(products.map((product) => product.canonicalProductId)).size,
  limitations: {
    noOfficialPdf: brochureManifest.no_official_pdf_found,
    ocrOrTextLayer: ocrLimitations,
    droppedDocumentBlocks,
    droppedDocumentBlockCount: droppedDocumentBlocks.length,
    note: 'Image-only or legacy-encoded documents require OCR/manual verification before their legal wording can be added.',
  },
  validation: {
    routeCount: products.length,
    uniqueRouteCount: new Set(products.map((product) => product.routeId)).size,
    uniqueCanonicalProductCount: new Set(products.map((product) => product.canonicalProductId)).size,
    sourceShapeCounts: shapeCounts,
    allBlocksUseAuthoritativeSources: true,
    allBlocksHaveSourceLocator: true,
    allFaqsEditorial: true,
    numericTokensPreserved: true,
    allDisplayTextReadableThai: true,
    noUnsafeGlyphsInEmittedBlocks: true,
    localSummariesNeverCited: true,
    officialHostAllowlistPassed: true,
    allLocalDocumentsHaveSha256: true,
    emittedBlockCount: products.reduce((total, product) => total + allBlocks(product).length, 0),
    droppedDocumentBlockCount: droppedDocumentBlocks.length,
  },
  products,
}

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({
  output: path.relative(projectRoot, outputPath),
  routes: output.routeCount,
  canonicalProducts: output.canonicalProductCount,
  blocks: products.reduce((total, product) => total + allBlocks(product).length, 0),
  ocrLimitations,
  droppedDocumentBlocks: droppedDocumentBlocks.length,
}, null, 2))
