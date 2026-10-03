import { execFile } from 'node:child_process'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const projectRoot = path.resolve(import.meta.dirname, '../..')
const ocrDirectory = path.join(projectRoot, 'tmp', 'vision-ocr-dropped-pages')
const imageDirectory = path.join(projectRoot, 'tmp', 'vision-ocr-page-images')
const files = (await readdir(ocrDirectory)).filter((file) => file.endsWith('.json') && file !== 'manifest.json')

await mkdir(imageDirectory, { recursive: true })
let cursor = 0
async function worker() {
  while (cursor < files.length) {
    const file = files[cursor]
    cursor += 1
    const job = JSON.parse(await readFile(path.join(ocrDirectory, file), 'utf8'))
    const outputBase = path.join(imageDirectory, path.basename(file, '.json'))
    await execFileAsync('pdftoppm', [
      '-f', String(job.page),
      '-l', String(job.page),
      '-r', '180',
      '-png',
      '-singlefile',
      path.join(projectRoot, job.pdf),
      outputBase,
    ])
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()))
console.log(JSON.stringify({ renderedPages: files.length, imageDirectory: path.relative(projectRoot, imageDirectory) }))
