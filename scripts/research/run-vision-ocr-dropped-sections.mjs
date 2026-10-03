import { execFile } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const projectRoot = path.resolve(import.meta.dirname, '../..')
const inputPath = path.join(projectRoot, 'data', 'muangthai-product-detail-content-2026-10-01.json')
const outputDirectory = path.join(projectRoot, 'tmp', 'vision-ocr-dropped-pages')
const binaryPath = process.env.VISION_OCR_BINARY ?? '/tmp/mlt-vision-ocr-pdf-page'
const concurrency = Number(process.env.OCR_CONCURRENCY ?? 4)

const input = JSON.parse(await readFile(inputPath, 'utf8'))
const products = new Map(input.products.map((product) => [product.routeId, product]))
const jobs = new Map()

for (const dropped of input.limitations.droppedDocumentBlocks) {
  const product = products.get(dropped.routeId)
  const source = product?.sourceRefs.find((candidate) => candidate.id === `${dropped.routeId}:document`)
  if (!product || !source?.localPath) throw new Error(`Missing document source for ${dropped.routeId}`)
  const key = `${source.localPath}#page=${dropped.page}`
  const job = jobs.get(key) ?? {
    key,
    pdf: source.localPath,
    page: dropped.page,
    blocks: [],
  }
  job.blocks.push({ routeId: dropped.routeId, section: dropped.section, reason: dropped.reason })
  jobs.set(key, job)
}

await mkdir(outputDirectory, { recursive: true })
const queue = [...jobs.values()]
let cursor = 0
const results = []

async function worker() {
  while (cursor < queue.length) {
    const job = queue[cursor]
    cursor += 1
    const pdfPath = path.join(projectRoot, job.pdf)
    const { stdout } = await execFileAsync(binaryPath, [pdfPath, String(job.page)], {
      maxBuffer: 50 * 1024 * 1024,
    })
    const ocr = JSON.parse(stdout)
    const fileName = `${path.basename(job.pdf, '.pdf')}-page-${job.page}.json`
    const outputPath = path.join(outputDirectory, fileName)
    await writeFile(outputPath, `${JSON.stringify({ ...job, ocr }, null, 2)}\n`, 'utf8')
    results.push({ ...job, outputPath: path.relative(projectRoot, outputPath), lineCount: ocr.lines.length })
    process.stderr.write(`[${results.length}/${queue.length}] ${job.pdf} page ${job.page}\n`)
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()))
results.sort((left, right) => left.key.localeCompare(right.key))
const manifest = {
  generatedAt: new Date().toISOString(),
  engine: 'macOS Vision VNRecognizeTextRequest revision 3',
  languages: ['th-TH', 'en-US'],
  droppedBlockCount: input.limitations.droppedDocumentBlocks.length,
  uniquePageCount: results.length,
  results,
}
await writeFile(
  path.join(outputDirectory, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)
console.log(JSON.stringify({ droppedBlocks: manifest.droppedBlockCount, uniquePages: manifest.uniquePageCount }, null, 2))
