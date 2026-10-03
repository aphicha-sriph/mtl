import { createHash } from 'node:crypto'
import { readFile, mkdir, rename, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const projectRoot = path.resolve(import.meta.dirname, '..')
const manifestPath = path.join(projectRoot, 'data', 'muangthai-official-brochures-2026-09-30.json')
const outputDirectory = path.join(projectRoot, 'public', 'brochures')
const verifyOnly = process.argv.includes('--verify')
const allowedHosts = new Set(['www.muangthai.co.th', 'cdn-ols.muangthai.co.th'])

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const uniqueDocuments = new Map()

for (const item of manifest.items) {
  const sourceUrl = item.source_url ?? new URL(item.brochure_path, manifest.base_url).href
  const parsedUrl = new URL(sourceUrl)

  if (!allowedHosts.has(parsedUrl.hostname)) {
    throw new Error(`Disallowed document host for ${item.name}: ${parsedUrl.hostname}`)
  }
  if (!/^[a-z0-9][a-z0-9.-]*\.pdf$/i.test(item.local_file)) {
    throw new Error(`Unsafe local PDF filename for ${item.name}: ${item.local_file}`)
  }

  const existing = uniqueDocuments.get(item.local_file)
  if (existing && existing.sourceUrl !== sourceUrl) {
    throw new Error(`Conflicting sources for ${item.local_file}`)
  }
  uniqueDocuments.set(item.local_file, { ...item, sourceUrl })
}

await mkdir(outputDirectory, { recursive: true })

async function inspectPdf(filePath) {
  const contents = await readFile(filePath)
  const signature = contents.subarray(0, 5).toString('ascii')
  if (signature !== '%PDF-') throw new Error(`Invalid PDF signature: ${filePath}`)
  if (contents.length < 1024) throw new Error(`PDF is unexpectedly small: ${filePath}`)
  return {
    bytes: contents.length,
    sha256: createHash('sha256').update(contents).digest('hex'),
  }
}

async function syncDocument(document) {
  const destination = path.join(outputDirectory, document.local_file)

  if (verifyOnly || document.kind === 'local_summary') {
    return { file: document.local_file, ...(await inspectPdf(destination)) }
  }

  const response = await fetch(document.sourceUrl, {
    redirect: 'follow',
    headers: { 'user-agent': 'MTL-brochure-sync/1.0' },
  })
  if (!response.ok) {
    throw new Error(`${document.local_file}: HTTP ${response.status}`)
  }

  const finalUrl = new URL(response.url)
  if (!allowedHosts.has(finalUrl.hostname)) {
    throw new Error(`${document.local_file}: redirected to disallowed host ${finalUrl.hostname}`)
  }

  const contents = Buffer.from(await response.arrayBuffer())
  if (contents.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error(`${document.local_file}: response is not a PDF`)
  }

  const temporaryPath = `${destination}.download`
  await writeFile(temporaryPath, contents)
  try {
    await rename(temporaryPath, destination)
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined)
    throw error
  }

  return {
    file: document.local_file,
    bytes: contents.length,
    sha256: createHash('sha256').update(contents).digest('hex'),
  }
}

const documents = [...uniqueDocuments.values()]
const results = []
const failures = []
const concurrency = verifyOnly ? 8 : 4

for (let index = 0; index < documents.length; index += concurrency) {
  const batch = documents.slice(index, index + concurrency)
  const settled = await Promise.allSettled(batch.map(syncDocument))

  settled.forEach((result, batchIndex) => {
    if (result.status === 'fulfilled') {
      results.push(result.value)
    } else {
      failures.push({ file: batch[batchIndex].local_file, error: result.reason.message })
    }
  })
}

const totalBytes = results.reduce((total, result) => total + result.bytes, 0)
console.log(JSON.stringify({
  mode: verifyOnly ? 'verify' : 'sync',
  documents: documents.length,
  passed: results.length,
  failed: failures.length,
  totalBytes,
  failures,
}, null, 2))

if (failures.length > 0) process.exitCode = 1
