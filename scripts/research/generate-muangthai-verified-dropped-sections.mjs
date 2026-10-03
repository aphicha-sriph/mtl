import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const inputPath = path.join(projectRoot, 'data', 'muangthai-product-detail-content-2026-10-01.json')
const ocrDirectory = path.join(projectRoot, 'tmp', 'vision-ocr-dropped-pages')
const outputPath = path.join(projectRoot, 'data', 'muangthai-verified-exclusions-2026-10-01.json')

const input = JSON.parse(await readFile(inputPath, 'utf8'))
const productsByRoute = new Map(input.products.map((product) => [product.routeId, product]))
const ocrFiles = (await readdir(ocrDirectory)).filter((file) => file.endsWith('.json') && file !== 'manifest.json')
const ocrPages = new Map()

for (const file of ocrFiles) {
  const page = JSON.parse(await readFile(path.join(ocrDirectory, file), 'utf8'))
  ocrPages.set(`${page.pdf}#page=${page.page}`, page)
}

const sectionNames = {
  benefit: 'benefits',
  note: 'notes',
  contractValidity: 'contractValidity',
  exclusion: 'exclusions',
  warning: 'warnings',
}

const verifiedExclusions = {
  'muang-thai-lifetime-protection-99-20': [
    { lines: [18, 19, 20, 21], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [22], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [23, 24, 25], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'smart-protection-99-20': [
    { lines: [17, 18, 20, 21], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสู่สถานะเดิมครั้งล่าสุด หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [24], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [25, 27, 29], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'flexi-protection-99-20': [
    { lines: [18, 19, 20], displayText: '(1) ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสู่สถานะเดิมครั้งล่าสุด หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [21], displayText: '(2) ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [22, 23], displayText: '(3) ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'super-saver-25-16': [
    { lines: [16, 18, 21], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสู่สถานะเดิมครั้งล่าสุด หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [22], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [24, 26], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'muangthai-smart-linked-pro-10-1-global-index-linked': [
    { lines: [10, 11], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครองหรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [12], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [13, 14], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'muangthai-smart-index-15-3-global-index-linked': [
    { lines: [17, 18], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสู่สถานะเดิมครั้งล่าสุด หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [19], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [20, 21], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'muangthai-smart-index-15-6-global-index-linked': [
    { lines: [17, 18], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสู่สถานะเดิมครั้งล่าสุด หรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [19], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [20, 21], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  'm-one-plus': [
    { lines: [11, 12], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครองหรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [13], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [14, 15], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
  mgrow615: [
    { lines: [10, 11], displayText: '1. ไม่คุ้มครองกรณีฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครองหรือวันที่อนุมัติเพิ่มทุนประกัน โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่ม' },
    { lines: [12], displayText: '2. ไม่คุ้มครองกรณีผู้รับประโยชน์ฆ่าผู้เอาประกันภัยโดยเจตนา' },
    { lines: [13, 14], displayText: '3. ไม่คุ้มครองเมื่อแจ้งอายุคลาดเคลื่อน และอายุจริงอยู่นอกช่วงอัตราเบี้ยที่บริษัทรับประกันตามปกติ' },
  ],
}

const verifiedBenefits = {
  'flexi-protection-99-20': [
    { lines: [5, 6], displayText: 'ปรับวงเงินคุ้มครองชีวิตเป็นวงเงินค่ารักษาพยาบาลในวัยเกษียณได้' },
    { lines: [8, 9, 10], displayText: 'มีความคุ้มครองค่ารักษาพยาบาลตั้งแต่อายุ 65 ปี ทั้งผู้ป่วยในและผู้ป่วยนอกแบบเหมาจ่าย' },
    { lines: [12, 13], displayText: 'เลือกชำระเบี้ย 5 ปีหรือ 20 ปี และไม่ต้องชำระเบี้ยในวัยเกษียณ' },
    { lines: [14, 15], displayText: 'เบี้ยประกันภัยคงที่ ไม่เพิ่มตามอายุ' },
    { lines: [16, 17], displayText: 'ใช้สิทธิลดหย่อนภาษีได้สูงสุด 100,000 บาทต่อปี ตามหลักเกณฑ์ที่กำหนด' },
  ],
  'muangthai-smart-index-15-3-global-index-linked': [
    { lines: [3, 4, 5, 6], displayText: 'เปิดโอกาสรับผลตอบแทนผ่านดัชนี S&P Multi-Asset Global Macro ESG Index' },
    { lines: [7, 8, 9], displayText: 'การันตีว่าเบี้ยที่จ่ายยังอยู่ครบเมื่อครบกำหนดสัญญา พร้อมเงินคืนรวมตลอดสัญญา 331%' },
    { lines: [10, 11, 12], displayText: 'ความคุ้มครองชีวิตเพิ่มเป็นขั้นบันได สูงสุด 300%' },
    { lines: [13], displayText: 'ไม่ต้องตรวจและไม่ต้องตอบคำถามสุขภาพ (2)' },
    { lines: [14, 15, 16], displayText: 'ใช้สิทธิลดหย่อนภาษีได้สูงสุดไม่เกิน 100,000 บาท (3)' },
  ],
  'muangthai-smart-index-15-6-global-index-linked': [
    { lines: [6, 7, 8, 9], displayText: 'เปิดโอกาสรับผลตอบแทนผ่านดัชนี S&P Multi-Asset Global Macro ESG Index' },
    { lines: [10, 11, 12, 13], displayText: 'ชำระเบี้ย 6 ปี คุ้มครอง 15 ปี และการันตีเงินคืนทุก 2 ปี' },
    { lines: [14, 15, 16], displayText: 'ความคุ้มครองชีวิตเพิ่มเป็นขั้นบันได สูงสุด 600%' },
    { lines: [17], displayText: 'ไม่ต้องตรวจและไม่ต้องตอบคำถามสุขภาพ' },
    { lines: [18, 19], displayText: 'ใช้สิทธิลดหย่อนภาษีได้สูงสุดไม่เกิน 100,000 บาท (3)' },
  ],
  'd-care': [
    { lines: [15, 16], displayText: 'ให้ความคุ้มครองถึงอายุ 81 ปี' },
    { lines: [17, 18], displayText: 'เลือกผลประโยชน์ได้สูงสุด 200%' },
    { lines: [19, 20, 21, 22, 23, 24], displayText: 'เลือกกลุ่มโรคร้ายแรงได้ตามความกังวล ได้แก่ กลุ่มมะเร็ง กลุ่มหลอดเลือดและหัวใจ กลุ่มระบบประสาทและกล้ามเนื้อ กลุ่มการเปลี่ยนอวัยวะสำคัญ และกลุ่มโรคอื่น ๆ หรือกลุ่มโรคยอดฮิต' },
    { lines: [25, 28, 30], displayText: 'เลือกคุ้มครองได้ตั้งแต่ระยะเริ่มต้นต่อเนื่องถึงระยะรุนแรง หรือเลือกเฉพาะระยะรุนแรง' },
  ],
  'kids-care': [
    { lines: [1], displayText: 'คุ้มครองโรคร้ายแรงที่พบบ่อยในเด็ก 15 โรค' },
    { lines: [2, 3], displayText: 'เมื่อตรวจพบโรคร้ายแรง รับเงินก้อน 100% ของจำนวนเงินเอาประกันภัย' },
    { lines: [4, 5], displayText: 'ซื้อได้ตั้งแต่อายุ 30 วัน - 15 ปี ต่ออายุถึง 20 ปี และคุ้มครองถึงอายุ 21 ปี' },
  ],
  'unit-linked-regular-premium': [
    { lines: [3, 4, 5, 6, 7], displayText: 'เพิ่ม ลด หรือปรับความคุ้มครองชีวิตให้เหมาะกับสถานการณ์ได้ตลอดอายุสัญญา' },
    { lines: [8, 9, 12, 15, 16, 18, 19, 21], displayText: 'ปรับจำนวนเบี้ยได้ เพิ่มส่วนเงินออมได้ หรือพักชำระเบี้ยได้โดยความคุ้มครองชีวิตยังคงอยู่ ทั้งนี้เป็นไปตามเงื่อนไข' },
    { lines: [11, 14, 17, 19], displayText: 'เลือกและสับเปลี่ยนกองทุนได้ฟรี ไม่จำกัดจำนวนครั้ง' },
    { lines: [22, 23, 24, 25, 26, 27, 28, 29], displayText: 'สมัครบริการ MTL Portfolio Management ได้ฟรี โดยมี 5 พอร์ตแนะนำให้เลือกตามระดับความเสี่ยง' },
  ],
  'm-one-plus': [
    { lines: [4, 5, 6], displayText: 'ชำระเบี้ยครั้งเดียว เริ่มต้น 50,000 บาท และคุ้มครองถึงอายุ 99 ปี หากมูลค่าการลงทุนเพียงพอ' },
    { lines: [7, 8, 9], displayText: 'เลือกความคุ้มครองชีวิตได้ยืดหยุ่น เริ่มต้น 1.5 เท่าของเบี้ยชำระครั้งเดียว' },
    { lines: [10, 11, 12, 13], displayText: 'เลือกกองทุนรวมได้หลากหลาย และสับเปลี่ยนกองทุนได้ฟรีไม่จำกัดจำนวนครั้ง' },
    { lines: [14, 15, 16], displayText: 'เพิ่มเบี้ยส่วนเงินออมได้ ขั้นต่ำครั้งละ 1,000 บาท' },
    { lines: [17, 19, 20], displayText: 'ถอนเงินลงทุนบางส่วนได้ตามเงื่อนไข โดยอาจทำให้ผลประโยชน์และความคุ้มครองลดลง' },
    { lines: [21, 22, 23], displayText: 'แนบสัญญาเพิ่มเติมสุขภาพ โรคร้ายแรง และอุบัติเหตุได้' },
  ],
}

const verifiedNotes = {
  'flexi-protection-99-20': [
    { lines: [19], displayText: 'ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย' },
    { lines: [20, 21], displayText: 'เบี้ยประกันภัยของสัญญานี้ใช้สิทธิลดหย่อนภาษีเงินได้บุคคลธรรมดาได้ ตามหลักเกณฑ์ที่กรมสรรพากรกำหนด' },
  ],
  'muang-thai-lifetime-protection-99-20': [
    { lines: [10], displayText: 'ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มสัญญา' },
  ],
  'smart-protection-99-20': [
    { lines: [17], displayText: 'ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มสัญญา' },
  ],
  'happy-return-99-7': [
    { lines: [14], displayText: 'ผลประโยชน์และความคุ้มครองชีวิตเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย' },
    { lines: [15], displayText: '(1) เป็นไปตามหลักเกณฑ์ของกรมสรรพากร' },
    { lines: [17, 18], displayText: '(2) กรณีมีชีวิตอยู่ครบสัญญา จะได้รับผลประโยชน์เท่ากับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย หรือ 101% ของเบี้ยประกันภัยที่ชำระมาแล้วทั้งหมด แล้วแต่จำนวนใดสูงกว่า' },
  ],
  'elite-health-plus': [
    { lines: [29, 30], displayText: 'ค่าห้องเดี่ยวมาตรฐาน หมายถึง ค่าห้องพักเดี่ยวราคาเริ่มต้นของโรงพยาบาล ใช้สำหรับการเข้าพักรักษาตัวเป็นผู้ป่วยในในประเทศไทยเท่านั้น ส่วนค่าห้องในต่างประเทศ คุ้มครองตามผลประโยชน์ที่ระบุในกรมธรรม์' },
  ],
  'flexi-retire': [
    { lines: [33], displayText: '(1) ผลประโยชน์เป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มสัญญา' },
    { lines: [34], displayText: '(2) เงื่อนไขเป็นไปตามที่บริษัทฯ กำหนด' },
    { lines: [35], displayText: '(3) การลดหย่อนภาษีด้วยประกันแบบบำนาญใช้สิทธิได้สูงสุด 300,000 บาท โดยใช้สิทธิเท่าที่จ่ายเป็นเบี้ยประกันชีวิต' },
    { lines: [36], displayText: 'สำหรับเบี้ยประกันชีวิตแบบทั่วไป ใช้สิทธิได้ตามจำนวนที่จ่ายจริง แต่ไม่เกิน 100,000 บาท' },
    { lines: [37], displayText: 'สำหรับเบี้ยประกันชีวิตแบบบำนาญ ได้รับการยกเว้นภาษีเงินได้บุคคลธรรมดาสูงสุดไม่เกินอัตราร้อยละ 15 ของเงินได้พึงประเมินที่ต้องเสียภาษีแต่ละปี และไม่เกิน 200,000 บาท' },
    { lines: [38], displayText: 'ทั้งนี้ รวมกันใช้สิทธิได้ตามที่จ่ายจริง สูงสุดไม่เกิน 300,000 บาท' },
  ],
  'muangthai-smart-index-15-3-global-index-linked': [
    { lines: [18], displayText: '(1) ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย' },
    { lines: [19], displayText: '(2) การพิจารณารับประกันภัยเป็นไปตามหลักเกณฑ์ของบริษัทฯ' },
    { lines: [20], displayText: '(3) เบี้ยประกันภัยของสัญญานี้ใช้สิทธิลดหย่อนภาษีเงินได้ ตามหลักเกณฑ์ที่กรมสรรพากรกำหนด' },
  ],
  'muangthai-smart-index-15-6-global-index-linked': [
    { lines: [21], displayText: '(1) ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย' },
    { lines: [22], displayText: '(2) การพิจารณารับประกันภัยเป็นไปตามหลักเกณฑ์ของบริษัทฯ' },
    { lines: [23], displayText: '(3) เบี้ยประกันภัยของสัญญานี้ใช้สิทธิลดหย่อนภาษีเงินได้ ตามหลักเกณฑ์ที่กรมสรรพากรกำหนด' },
  ],
  'unit-linked-regular-premium': [
    { lines: [7, 8], displayText: 'mDesign เป็นชื่อทางการตลาดของแบบประกันภัย เมืองไทยยูนิตลิงค์ 1 (ชำระเบี้ยประกันภัยรายงวด), เมืองไทยยูนิตลิงค์ 99/3, เมืองไทยยูนิตลิงค์ 99/5 และเมืองไทยยูนิตลิงค์ 99/10' },
  ],
  'm-one-plus': [
    { lines: [8], displayText: 'mOnePlus เป็นชื่อทางการตลาดของแบบประกันภัย เมืองไทยยูนิตลิงค์ 2 (ชำระเบี้ยประกันภัยครั้งเดียว)' },
  ],
  mgrow615: [
    { lines: [10], displayText: 'mGrow 615 เป็นชื่อทางการตลาดของแบบประกันภัยเมืองไทยยูนิตลิงค์ 615' },
  ],
  'muangthai-ul-plus': [
    { lines: [9], displayText: 'เมืองไทยยูแอล พลัส เป็นชื่อทางการตลาดของแบบประกันภัย เมืองไทย ยูนิเวอร์แซลไลฟ์ 1' },
  ],
  'muangthaitakaful-saving5-5': [
    { lines: [24], displayText: 'ฮิบะห์หมายถึงเงินที่มอบให้สมาชิกตะกาฟุลหรือผู้รับประโยชน์' },
    { lines: [26], displayText: 'ผลประโยชน์และความคุ้มครองเป็น % ของจำนวนเงินหลักประกันตะกาฟุล ณ วันเริ่มสัญญา' },
    { lines: [28, 29], displayText: 'สมาชิกตะกาฟุลมีสิทธิได้รับเงินปันผลพิเศษ (ถ้ามี) ตามสัญญาตะกาฟุล' },
    { lines: [30], displayText: 'สัญญาตะกาฟุลไม่มีสิทธิกู้ยืมเงิน' },
  ],
  'muanthaitakaful-wholelife9520': [
    { lines: [23], displayText: 'ฮิบะห์หมายถึงเงินที่มอบให้สมาชิกตะกาฟุลหรือผู้รับประโยชน์' },
    { lines: [25], displayText: 'สมาชิกตะกาฟุลมีสิทธิได้รับเงินปันผลพิเศษ (ถ้ามี) ตามสัญญาตะกาฟุล' },
    { lines: [27], displayText: 'สัญญาตะกาฟุลไม่มีสิทธิกู้ยืมเงิน' },
  ],
}

const standardContractValidityText = 'หากผู้เอาประกันภัยรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกเบี้ยสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ. มาตรา 865 บริษัทอาจบอกล้างและไม่จ่ายเงินตามกรมธรรม์ โดยรับผิดเพียงคืนเบี้ยที่ชำระแล้วทั้งหมด'
const takafulContractValidityText = 'หากสมาชิกตะกาฟุลรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกเงินสมทบสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ. มาตรา 865 บริษัทอาจบอกล้างและไม่จ่ายเงินตามสัญญาตะกาฟุล โดยรับผิดเพียงคืนเงินสมทบที่ชำระแล้วทั้งหมด'

const verifiedContractValidity = {
  'flexi-protection-99-20': [{ lines: [13, 14, 15, 16], displayText: standardContractValidityText }],
  'muang-thai-lifetime-protection-99-20': [{ lines: [10, 11, 12, 13, 14, 15, 16], displayText: standardContractValidityText }],
  'smart-protection-99-20': [{ lines: [10, 11, 12, 13, 14, 15], displayText: standardContractValidityText }],
  'happy-return-99-7': [{ lines: [52, 53, 54, 55, 56, 57], displayText: standardContractValidityText }],
  '9901-d65': [{ lines: [37, 38, 40, 41, 42, 47], displayText: standardContractValidityText }],
  'flexi-retire': [{ lines: [18, 19, 20, 21], displayText: standardContractValidityText }],
  'muangthai-smart-linked-pro-10-1-global-index-linked': [{ lines: [5, 6, 7, 8], displayText: standardContractValidityText }],
  'muangthai-smart-index-15-6-global-index-linked': [{ lines: [12, 13, 14, 15], displayText: standardContractValidityText }],
  'muangthai-smart-index-15-3-global-index-linked': [{ lines: [12, 13, 14, 15], displayText: standardContractValidityText }],
  'unit-linked-regular-premium': [{
    lines: [25, 26, 27],
    displayText: 'หากผู้เอาประกันภัยรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกค่าการประกันภัยสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ.',
  }],
  'm-one-plus': [{
    lines: [5, 6, 7],
    displayText: 'หากผู้เอาประกันภัยรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกค่าการประกันภัยสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ. มาตรา 865 และบริษัทอาจบอกล้างสัญญา',
  }],
  mgrow615: [{
    lines: [4, 5, 6],
    displayText: 'หากผู้เอาประกันภัยรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกค่าการประกันภัยสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ. มาตรา 865 และบริษัทอาจบอกล้างสัญญา',
  }],
  'muangthai-ul-plus': [{
    lines: [36, 37, 38],
    displayText: 'หากผู้เอาประกันภัยรู้อยู่แล้วว่าแถลงข้อความเท็จ หรือปกปิดข้อเท็จจริงที่อาจทำให้บริษัทเรียกเบี้ยสูงขึ้นหรือปฏิเสธทำสัญญา สัญญาอาจตกเป็นโมฆียะตาม ป.พ.พ. มาตรา 865 บริษัทอาจบอกล้างและไม่จ่ายเงินตามกรมธรรม์',
  }],
  '21c4eb06-6789-49af-8c7d-827a35f60763': [{ lines: [11, 12, 13, 14, 15, 16], displayText: takafulContractValidityText }],
  'muangthaitakaful-saving5-5': [{ lines: [11, 12, 13, 14, 15, 16], displayText: takafulContractValidityText }],
  'muanthaitakaful-wholelife9520': [{ lines: [14, 15, 16, 17, 18, 19], displayText: takafulContractValidityText }],
}

const standardWarningText = 'ผู้ซื้อควรทำความเข้าใจรายละเอียดความคุ้มครองและเงื่อนไขก่อนตัดสินใจทำประกันภัยทุกครั้ง'
const takafulWarningText = 'ผู้ขอสมัครเป็นสมาชิกตะกาฟุลควรทำความเข้าใจรายละเอียดความคุ้มครองและเงื่อนไขก่อนตัดสินใจทำสัญญาตะกาฟุลทุกครั้ง'

const verifiedWarnings = {
  'flexi-protection-99-20': [{ lines: [40], displayText: standardWarningText }],
  'muang-thai-lifetime-protection-99-20': [{ lines: [81, 84], displayText: standardWarningText }],
  'smart-protection-99-20': [{ lines: [74], displayText: standardWarningText }],
  'maochai-extra': [{ lines: [62], displayText: standardWarningText }],
  'ci-perfect-care': [
    { lines: [115], displayText: 'โปรดศึกษารายละเอียดความคุ้มครอง เงื่อนไข และข้อยกเว้นก่อนตัดสินใจทำประกันภัย' },
    { lines: [121], displayText: standardWarningText },
  ],
  'multiple-ci': [{ lines: [120], displayText: 'โปรดศึกษารายละเอียดความคุ้มครอง เงื่อนไข และข้อยกเว้นก่อนตัดสินใจทำประกันภัย' }],
  'd-care': [{ lines: [127], displayText: standardWarningText }],
  'care-plus': [{ lines: [35], displayText: standardWarningText }],
  'smart-silver-smart-silver-plus': [{ lines: [16], displayText: standardWarningText }],
  'pure-cancer': [{ lines: [61], displayText: standardWarningText }],
  '9901-d65': [{ lines: [93], displayText: standardWarningText }],
  'flexi-retire': [{ lines: [61], displayText: 'ควรตรวจสอบข้อมูลการใช้สิทธิลดหย่อนภาษีเงินได้บุคคลธรรมดาประจำปีก่อนทำการเปลี่ยนแปลงทุกครั้ง' }],
  'muangthai-smart-linked-pro-10-1-global-index-linked': [{ lines: [13], displayText: 'ผลการดำเนินงานในอดีตไม่ได้ยืนยันถึงผลการดำเนินงานในอนาคต' }],
  'pa-pay-max': [{ lines: [73], displayText: standardWarningText }],
  'pa-easy-plan-rider': [{ lines: [128], displayText: standardWarningText }],
  'pa-return-cash': [{ lines: [90], displayText: standardWarningText }],
  'pa-broken-bone': [{ lines: [148], displayText: standardWarningText }],
  'unit-linked-regular-premium': [{ lines: [86], displayText: 'ผู้ซื้อควรทำความเข้าใจรายละเอียดความคุ้มครอง เงื่อนไข และความเสี่ยงก่อนตัดสินใจทำประกันภัยทุกครั้ง' }],
  'muangthai-ul-plus': [
    { lines: [18, 19], displayText: '1. พิจารณาความพร้อมทางการเงินในการชำระเบี้ยประกันภัยต่อเนื่องก่อนตัดสินใจ เพราะเป็นผลิตภัณฑ์ที่ผูกพันทางการเงินระยะยาว' },
    { lines: [20], displayText: '2. ทำความเข้าใจความคุ้มครองและเงื่อนไขทั้งส่วนประกันภัยและส่วนลงทุนก่อนตัดสินใจ' },
    { lines: [21, 22], displayText: '3. แม้ข้อมูลและตัวเลขในเอกสารการขายมีความซับซ้อน ผู้เอาประกันภัยต้องศึกษาทำความเข้าใจและสอบถามผู้ขายเมื่อมีข้อสงสัย' },
    { lines: [23, 24], displayText: '4. ควรกรอกใบคำขอเอาประกันภัยด้วยตนเอง ไม่ลงนามในเอกสารเปล่า และตรวจสอบรายละเอียดก่อนลงนาม' },
    { lines: [25], displayText: '5. เรียกรับหลักฐานการรับเงินจากผู้ขายทุกครั้ง และตรวจว่าเป็นหลักฐานของบริษัทฯ จริง' },
    { lines: [26], displayText: 'ให้ความสำคัญในการตอบคำถามทางโทรศัพท์จากบริษัทฯ ภายหลังการซื้อกรมธรรม์' },
    { lines: [27], displayText: '7. ติดตามและให้ความสำคัญกับเอกสารที่ได้รับจากบริษัทฯ เพื่อรักษาสิทธิประโยชน์ของตนเอง' },
  ],
  'housekeeping-insurance': [
    { lines: [51], displayText: standardWarningText },
    { lines: [58], displayText: 'โปรดศึกษารายละเอียดความคุ้มครอง เงื่อนไข และข้อยกเว้นก่อนตัดสินใจทำประกันภัย' },
  ],
  '21c4eb06-6789-49af-8c7d-827a35f60763': [{ lines: [109], displayText: takafulWarningText }],
  'muangthaitakaful-saving5-5': [{ lines: [83], displayText: takafulWarningText }],
  'muanthaitakaful-wholelife9520': [{ lines: [55], displayText: 'ผู้ซื้อควรทำความเข้าใจรายละเอียดความคุ้มครองและเงื่อนไขก่อนตัดสินใจทำสัญญาตะกาฟุลทุกครั้ง' }],
  '49b8d9b3-edbd-4f42-9d2f-88294fa763a0': [{ lines: [76, 78], displayText: takafulWarningText }],
}

const falsePositiveExclusions = new Set([
  'd-health-lite',
  'kids-health-insurance',
  'extra-care-plus',
  'muangthai-ul-plus',
])

function numericTokens(value) {
  const thaiDigits = '๐๑๒๓๔๕๖๗๘๙'
  const normalized = value.replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)))
  return (normalized.match(/\d[\d,]*(?:\.\d+)?(?:\s*%)?/g) ?? []).map((token) => token.replace(/[\s,]+/g, ''))
}

function sameNumericTokens(left, right) {
  return JSON.stringify(numericTokens(left)) === JSON.stringify(numericTokens(right))
}

function makeDisplayItems(routeId, section, ocr) {
  const recipes = section === 'exclusion'
    ? verifiedExclusions[routeId] ?? []
    : section === 'benefit'
      ? verifiedBenefits[routeId] ?? []
      : section === 'note'
        ? verifiedNotes[routeId] ?? []
        : section === 'contractValidity'
          ? verifiedContractValidity[routeId] ?? []
          : section === 'warning'
            ? verifiedWarnings[routeId] ?? []
            : []
  return recipes.map((recipe, index) => {
    const sourceText = recipe.lines.map((lineIndex) => ocr.lines[lineIndex]?.text).filter(Boolean).join('\n')
    if (sourceText.split('\n').length !== recipe.lines.length) {
      throw new Error(`${routeId}: missing OCR line for verified ${section} item ${index + 1}`)
    }
    return {
      id: `${routeId}:${section}:${index + 1}`,
      sourceLocator: `PDF page ${ocr.page} (1-based), Vision OCR lines ${recipe.lines.join(', ')}`,
      sourceText,
      displayText: recipe.displayText,
      editorial: true,
      visuallyVerified: true,
    }
  })
}

const routeRecords = new Map()
for (const dropped of input.limitations.droppedDocumentBlocks) {
  const product = productsByRoute.get(dropped.routeId)
  const source = product?.sourceRefs.find((candidate) => candidate.id === `${dropped.routeId}:document`)
  if (!product || !source?.localPath) throw new Error(`Missing document source for ${dropped.routeId}`)
  const pageKey = `${source.localPath}#page=${dropped.page}`
  const ocrPage = ocrPages.get(pageKey)
  if (!ocrPage) throw new Error(`Missing Vision OCR page ${pageKey}`)

  const sectionName = sectionNames[dropped.section]
  const record = routeRecords.get(dropped.routeId) ?? {
    routeId: dropped.routeId,
    canonicalProductId: product.canonicalProductId,
    name: product.name,
    sections: { benefits: [], notes: [], contractValidity: [], exclusions: [], warnings: [] },
  }
  const isVerified = (dropped.section === 'exclusion' && Boolean(verifiedExclusions[dropped.routeId]))
    || (dropped.section === 'benefit' && Boolean(verifiedBenefits[dropped.routeId]))
    || (dropped.section === 'note' && Boolean(verifiedNotes[dropped.routeId]))
    || (dropped.section === 'contractValidity' && Boolean(verifiedContractValidity[dropped.routeId]))
    || (dropped.section === 'warning' && Boolean(verifiedWarnings[dropped.routeId]))
  const displayItems = isVerified ? makeDisplayItems(dropped.routeId, dropped.section, ocrPage.ocr) : []
  record.sections[sectionName].push({
    id: `${dropped.routeId}:${dropped.section}:page-${dropped.page}`,
    status: isVerified ? 'verified' : 'unverified',
    verificationReason: isVerified
      ? 'Compared line-by-line with the rendered official PDF page.'
      : dropped.section === 'exclusion' && falsePositiveExclusions.has(dropped.routeId)
        ? 'The cited page is a benefit/performance page and has no standalone exclusion section suitable for display.'
        : 'Vision OCR captured the page, but this block has not passed manual line-by-line visual verification.',
    page: dropped.page,
    pageConvention: '1-based physical PDF page',
    sourceId: source.id,
    sourceUrl: source.url,
    localPath: source.localPath,
    originalDropReason: dropped.reason,
    ocrEngine: 'macOS Vision VNRecognizeTextRequest revision 3',
    ocrLanguages: ocrPage.ocr.languages,
    exactOCRText: ocrPage.ocr.text,
    ocrAverageConfidence: ocrPage.ocr.lines.reduce((sum, line) => sum + line.confidence, 0) / Math.max(ocrPage.ocr.lines.length, 1),
    displayItems,
  })
  routeRecords.set(dropped.routeId, record)
}

const products = [...routeRecords.values()].sort((left, right) => left.routeId.localeCompare(right.routeId))
const blocks = products.flatMap((product) => Object.values(product.sections).flat())
const verifiedBlocks = blocks.filter((block) => block.status === 'verified')
const verifiedRoutes = new Set(products.filter((product) => Object.values(product.sections).flat().some((block) => block.status === 'verified')).map((product) => product.routeId))
const errors = []

if (blocks.length !== 114) errors.push(`Expected 114 dropped blocks, received ${blocks.length}`)
if (blocks.filter((block) => block.id.includes(':exclusion:')).length !== 19) errors.push('Expected 19 exclusion blocks')
for (const block of blocks) {
  if (/[\uE000-\uF8FF\uFFFD]/u.test(block.exactOCRText)) errors.push(`${block.id}: unsafe glyph in exactOCRText`)
  if (block.status === 'unverified' && block.displayItems.length > 0) errors.push(`${block.id}: unverified block emitted displayItems`)
  if (!block.sourceId || !block.sourceUrl || !block.page) errors.push(`${block.id}: incomplete provenance`)
  if (!['www.muangthai.co.th', 'cdn-ols.muangthai.co.th'].includes(new URL(block.sourceUrl).hostname)) {
    errors.push(`${block.id}: non-official source host`)
  }
  for (const item of block.displayItems) {
    if (/[\uE000-\uF8FF\uFFFD]/u.test(item.displayText)) errors.push(`${item.id}: unsafe glyph in displayText`)
    if (!/[\u0E00-\u0E7F]/u.test(item.displayText)) errors.push(`${item.id}: displayText is not Thai`)
    if (!sameNumericTokens(item.sourceText, item.displayText)) errors.push(`${item.id}: numeric tokens changed`)
  }
}
if (errors.length > 0) throw new Error(`Validation failed:\n${errors.join('\n')}`)

const output = {
  schemaVersion: 1,
  snapshotDate: '2026-10-01',
  scope: 'Vision OCR evidence for all 114 document blocks dropped by the first-pass product-detail generator. Only manually image-verified blocks emit displayItems.',
  sourcePolicy: {
    authoritativeOnly: true,
    ocrIsEvidenceNotPolicyText: true,
    failClosedRule: 'status=unverified must have displayItems=[]; complex tables and unclear OCR are never summarized.',
  },
  phaseStatus: {
    exclusions: 'manual visual verification complete for the simple, separable exclusion sections; ambiguous/false-positive pages remain unverified',
    benefits: 'manual visual verification complete for the simple, separable benefit sections; complex tables/charts remain unverified',
    notes: 'manual visual verification complete for the simple, separable note sections; dense/interleaved notes remain unverified',
    contractValidity: 'manual visual verification complete for 16 separable contract-validity sections; one interleaved group page remains unverified',
    warnings: 'manual visual verification complete for all 24 warning sections',
  },
  droppedBlockCount: blocks.length,
  uniqueRouteCount: products.length,
  verifiedBlockCount: verifiedBlocks.length,
  verifiedRouteCount: verifiedRoutes.size,
  validation: {
    allDroppedBlocksRepresented: true,
    noUnsafeGlyphsOrReplacementCharacters: true,
    numericTokensPreservedInVerifiedDisplayItems: true,
    unverifiedBlocksEmitNoDisplayItems: true,
    allSourcesFirstPartyOfficialHosts: true,
    pageConventionExplicit: true,
  },
  products,
}

await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
console.log(JSON.stringify({
  output: path.relative(projectRoot, outputPath),
  droppedBlocks: output.droppedBlockCount,
  routes: output.uniqueRouteCount,
  verifiedBlocks: output.verifiedBlockCount,
  verifiedRoutes: output.verifiedRouteCount,
}, null, 2))
