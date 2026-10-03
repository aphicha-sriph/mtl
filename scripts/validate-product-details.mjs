import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalog = JSON.parse(fs.readFileSync(path.join(projectRoot, 'data/muangthai-official-products-2026-09-30.json'), 'utf8'))

const routeAliases = {
  '21c4eb06-6789-49af-8c7d-827a35f60763': 'takaful-saving-10-4',
  '49b8d9b3-edbd-4f42-9d2f-88294fa763a0': 'pa-takaful-safety',
}

function productId(url) {
  const pathname = new URL(url).pathname
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? pathname
  return decodeURIComponent(segment).replace(/\.pdf$/i, '').trim().toLocaleLowerCase('en-US')
}

function routeFor(card) {
  const id = productId(card.url)
  return routeAliases[id] ?? id
}

function numberTokens(card) {
  const source = [card.entry_age, card.premium_term, card.coverage_term, card.group_size, card.key_fact]
    .filter(Boolean)
    .join(' ')
  return [...new Set(source.match(/\d[\d,]*(?:\.\d+)?%?/g) ?? [])]
    .map((value) => value.replaceAll(',', ''))
    .filter((value) => value.length > 1 || value.includes('%'))
}

const errors = []
for (const card of catalog.cards) {
  const route = routeFor(card)
  const file = path.join(projectRoot, 'dist', 'plans', route, 'index.html')
  if (!fs.existsSync(file)) {
    errors.push(`${card.name}: missing prerendered page ${file}`)
    continue
  }

  const html = fs.readFileSync(file, 'utf8')
  const normalizedHtml = html.replaceAll(',', '')
  const requiredCopy = [
    'จุดเด่นและข้อมูลพื้นฐาน',
    'เงื่อนไขและข้อยกเว้น',
    'คำถามที่พบบ่อย',
    'เรียบเรียงให้อ่านง่ายจาก',
    card.url,
  ]

  for (const copy of requiredCopy) {
    if (!html.includes(copy)) errors.push(`${card.name}: missing required detail marker: ${copy}`)
  }

  const expectedCoverageTab = card.url.includes('flexi-protection-99-20')
    ? 'ผลประโยชน์ตามปี'
    : card.category === 'retirement' || card.category === 'savings_and_index_linked'
      ? 'ผลประโยชน์ตามสัญญา'
      : 'ผลประโยชน์และวงเงิน'
  if (!html.includes(expectedCoverageTab)) {
    errors.push(`${card.name}: missing coverage tab label: ${expectedCoverageTab}`)
  }

  for (const token of numberTokens(card)) {
    if (!normalizedHtml.includes(token)) errors.push(`${card.name}: source number ${token} is absent from the rendered page`)
  }
}

if (errors.length) {
  console.error(`Product detail validation failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Validated complete detail structure, official source links, and source numbers for ${catalog.cards.length} product pages.`)
