import { assetUrl } from '../basePath'
import type { CatalogProduct, ProductCategory } from './catalog'
import { getProductHighlight } from './productHighlights'
import { getProductTaxBenefit } from './taxBenefits'
import officialDetailContentJson from './productDetailDisplay.json'

interface SourceBackedBlock {
  displayText: string
  title?: string
  label?: string
  periodLabel?: string
  question?: string
}

interface SourceDetailRecord {
  routeId: string
  overview: SourceBackedBlock[]
  highlights: SourceBackedBlock[]
  facts: SourceBackedBlock[]
  benefitPeriods: SourceBackedBlock[]
  notes: SourceBackedBlock[]
  faqs: SourceBackedBlock[]
  contractValidity: SourceBackedBlock | null
  exclusions: SourceBackedBlock[]
  warnings: SourceBackedBlock[]
  verified: {
    benefits: VerifiedSourceBlock[]
    notes: VerifiedSourceBlock[]
    contractValidity: VerifiedSourceBlock[]
    exclusions: VerifiedSourceBlock[]
    warnings: VerifiedSourceBlock[]
  }
  verifiedBenefitSchedule: {
    page: number
    periods: Array<{ period: string; displayItems: string[] }>
    displayItems: string[]
  } | null
}

interface VerifiedSourceBlock {
  page: number
  displayItems: Array<{ displayText: string }>
}

interface SourceDetailDataset {
  products: SourceDetailRecord[]
}

const sourceDetailsByRoute = new Map(
  (officialDetailContentJson as SourceDetailDataset).products.map((record) => [record.routeId, record]),
)

function readableSourceText(block: SourceBackedBlock | null | undefined): string | null {
  const text = block?.displayText.trim()
  if (!text || !/[\u0E00-\u0E7F]/u.test(text) || /[\uE000-\uF8FF�]/u.test(text)) return null
  return text
}

function uniqueText(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function verifiedTexts(blocks: VerifiedSourceBlock[] | undefined) {
  return blocks?.flatMap((block) => block.displayItems.map((item) => item.displayText.trim())) ?? []
}

function verifiedBenefitItem(displayText: string, index: number): ProductBenefitItem {
  const separatorIndex = displayText.indexOf(' — ')
  if (separatorIndex > 0) {
    return {
      title: displayText.slice(0, separatorIndex).trim(),
      description: displayText.slice(separatorIndex + 3).trim(),
    }
  }
  const [firstLine, ...remainingLines] = displayText.split('\n').map((line) => line.trim()).filter(Boolean)
  if (remainingLines.length > 0 && firstLine.length <= 80) {
    return { title: firstLine, description: remainingLines.join('\n') }
  }
  return { title: `ผลประโยชน์สำคัญ ${index + 1}`, description: displayText }
}

export interface ProductDetailHighlight {
  title: string
  description: string
}

export interface ProductBenefitItem {
  title: string
  description: string
}

export interface ProductBenefitPeriod {
  period: string
  items: ProductBenefitItem[]
}

export interface ProductFaqItem {
  question: string
  answer: string[]
}

export interface DetailedProductContent {
  sourceUrl: string
  sourceLabel: string
  intro: string
  coverageTabLabel: string
  coverageHeading: string
  coverageIntro: string
  planFacts: Array<{ label: string; value: string[] }>
  highlights: ProductDetailHighlight[]
  benefitPeriods: ProductBenefitPeriod[]
  notes: string[]
  faqs: ProductFaqItem[]
  contractValidity: string | null
  exclusions: string[]
  warning: string | null
  suitability: string
  caveat: string
  brochurePath: string | null
  brochureKind: string | null
}

const flexiProtectionDetails: DetailedProductContent = {
  sourceUrl: 'https://www.muangthai.co.th/th/whole-life-insurance/flexi-protection-99-20',
  sourceLabel: 'เมืองไทยประกันชีวิต — เมืองไทย เฟล็กซี่ โพรเทคชั่น',
  intro:
    'ประกันชีวิตที่เปลี่ยนวงเงินคุ้มครองชีวิตคงเหลือมาใช้เป็นค่ารักษาพยาบาลทั้งผู้ป่วยในและผู้ป่วยนอกได้ตั้งแต่อายุ 65 ปี พร้อมผลประโยชน์กรณีเสียชีวิตหรืออยู่ครบสัญญาตามวงเงินที่เหลืออยู่',
  coverageTabLabel: 'ผลประโยชน์ตามปี',
  coverageHeading: 'ผลประโยชน์และความคุ้มครองตามช่วงเวลา',
  coverageIntro: 'อ่านตามอายุของผู้เอาประกันเพื่อดูว่าวงเงินเปลี่ยนบทบาทอย่างไร',
  planFacts: [
    {
      label: 'อายุรับประกัน',
      value: [
        'แผน 99/5: อายุ 30 วัน – 55 ปี',
        'แผน 99/20: อายุ 30 วัน – 45 ปี',
      ],
    },
    {
      label: 'ระยะชำระเบี้ย',
      value: ['แผน 99/5: 5 ปี', 'แผน 99/20: 20 ปี'],
    },
    { label: 'ระยะคุ้มครอง', value: ['ถึงอายุ 99 ปี'] },
    { label: 'จำนวนเงินเอาประกันภัยขั้นต่ำ', value: ['500,000 บาท'] },
    { label: 'สัญญาเพิ่มเติม', value: ['สามารถซื้อแนบท้ายได้ ตามเงื่อนไขการรับประกันของสัญญาเพิ่มเติม'] },
    { label: 'การตรวจสุขภาพ', value: ['ขึ้นอยู่กับกฎเกณฑ์การพิจารณารับประกันภัยของบริษัท'] },
  ],
  highlights: [
    {
      title: 'ชีวิตและสุขภาพในกรมธรรม์เดียว',
      description: 'ปรับวงเงินคุ้มครองชีวิตที่เหลืออยู่มาใช้เป็นค่ารักษาพยาบาลในวัยเกษียณได้',
    },
    {
      title: 'วงเงินสุขภาพพร้อมใช้ตั้งแต่อายุ 65 ปี',
      description: 'คุ้มครองค่ารักษาพยาบาลทั้งผู้ป่วยใน (IPD) และผู้ป่วยนอก (OPD) แบบเหมาจ่ายตามวงเงินคงเหลือ',
    },
    {
      title: 'จ่ายสั้น คุ้มครองยาว',
      description: 'เลือกชำระเบี้ย 5 ปี หรือ 20 ปี และคุ้มครองถึงอายุ 99 ปี',
    },
    {
      title: 'เบี้ยคงที่',
      description: 'เบี้ยประกันภัยไม่ปรับเพิ่มขึ้นตามอายุ',
    },
    {
      title: 'ใช้สิทธิลดหย่อนภาษีได้',
      description: 'ลดหย่อนภาษีได้เต็มก้อน สูงสุด 100,000 บาทต่อปี ตามหลักเกณฑ์ของกรมสรรพากร',
    },
  ],
  benefitPeriods: [
    {
      period: 'ปีกรมธรรม์ที่ 1 – อายุ 64 ปี',
      items: [
        {
          title: 'ผลประโยชน์กรณีเสียชีวิต',
          description:
            'รับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครองตามกรมธรรม์ประกันภัย หรือเงินค่าเวนคืนกรมธรรม์ประกันภัยในขณะนั้น แล้วแต่จำนวนใดจะมากกว่า',
        },
      ],
    },
    {
      period: 'อายุ 65 ปี – อายุ 98 ปี',
      items: [
        {
          title: 'ค่ารักษาพยาบาลผู้ป่วยใน (IPD) และ/หรือผู้ป่วยนอก (OPD)',
          description:
            'เมื่อบาดเจ็บหรือเจ็บป่วยและต้องรับการรักษา บริษัทจ่ายตามค่าใช้จ่ายจริง แต่รวมแล้วไม่เกิน 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายไปแล้ว (ถ้ามี)',
        },
        {
          title: 'ผลประโยชน์กรณีเสียชีวิต',
          description:
            'รับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายไปแล้ว (ถ้ามี) หรือเงินค่าเวนคืนกรมธรรม์ประกันภัยในขณะนั้น แล้วแต่จำนวนใดจะมากกว่า',
        },
      ],
    },
    {
      period: 'อายุ 99 ปี (ครบสัญญา)',
      items: [
        {
          title: 'ผลประโยชน์กรณีมีชีวิตอยู่ครบสัญญา',
          description:
            'รับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายไปแล้ว (ถ้ามี)',
        },
      ],
    },
  ],
  notes: [
    'ความคุ้มครองชีวิตเท่ากับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายไปแล้ว (ถ้ามี) หรือเงินค่าเวนคืนกรมธรรม์ประกันภัยในขณะนั้น แล้วแต่จำนวนใดจะมากกว่า',
    'กรณีมีชีวิตอยู่ครบสัญญา รับ 100% ของจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายไปแล้ว (ถ้ามี)',
    'เข้ารับการรักษาแบบผู้ป่วยนอกได้ไม่เกิน 2 ครั้งต่อวัน รวมกายภาพบำบัด กิจกรรมบำบัด ค่าวินิจฉัย การตรวจทางห้องปฏิบัติการ ค่าเอ็กซ์เรย์ ค่าอัลตราซาวด์ และค่ายาตามคำสั่งแพทย์หรือแพทย์ผ่านโทรเวชกรรม (Telemedicine) ในโรงพยาบาลหรือสถานพยาบาลที่บริษัทกำหนด โดยค่ายาครอบคลุมไม่เกิน 30 วันหลังวันที่เข้ารับการรักษาแบบผู้ป่วยนอก',
    'บริษัทจ่ายผลประโยชน์ค่ารักษาพยาบาลเมื่อผู้เอาประกันภัยมีอายุตั้งแต่ 65 ปี ณ วันครบรอบปีกรมธรรม์ และบริษัทได้รับเบี้ยประกันภัยครบตามระยะเวลาชำระเบี้ยแล้ว',
    'หากจำนวนเงินเอาประกันภัย ณ วันเริ่มมีผลคุ้มครอง หักด้วยผลประโยชน์ค่ารักษาพยาบาลที่จ่ายแล้วและหนี้สินที่ผูกพันตามกรมธรรม์ (ถ้ามี) เหลือเท่ากับหรือต่ำกว่า 0 บาท กรมธรรม์จะสิ้นผลบังคับทันที และบริษัทจะไม่จ่ายผลประโยชน์ใดอีก รวมถึงค่ารักษาที่เกิดก่อนกรมธรรม์สิ้นผลด้วยสาเหตุนี้',
    'หากมีสัญญาเพิ่มเติมสุขภาพแนบท้ายหรือมีสัญญาเพิ่มเติมสุขภาพอื่นอยู่แล้ว การเลือกใช้สิทธิค่ารักษาของแบบประกันนี้ก่อน อาจทำให้ความคุ้มครองของแบบประกันนี้สิ้นสุดก่อนวันครบกำหนดสัญญา',
  ],
  faqs: [
    {
      question: 'ใครสมัครแผนนี้ได้บ้าง?',
      answer: ['แผน 99/5 รับอายุ 30 วัน – 55 ปี', 'แผน 99/20 รับอายุ 30 วัน – 45 ปี'],
    },
    {
      question: 'จำนวนเงินเอาประกันภัยขั้นต่ำเท่าไร?',
      answer: ['500,000 บาท'],
    },
    {
      question: 'ต้องตรวจสุขภาพไหม?',
      answer: ['ขึ้นอยู่กับกฎเกณฑ์การพิจารณารับประกันภัยของบริษัท'],
    },
    {
      question: 'ซื้อสัญญาเพิ่มเติมแนบท้ายได้ไหม?',
      answer: ['ซื้อได้ โดยเป็นไปตามเงื่อนไขการพิจารณารับประกันภัยของสัญญาเพิ่มเติมนั้น'],
    },
    {
      question: 'เบี้ยปีต่อไปจะเพิ่มตามอายุไหม?',
      answer: ['ไม่เพิ่ม เบี้ยประกันภัยปีต่ออายุเท่าเดิม โดยต้องชำระก่อนหรือภายใน 31 วันนับจากวันครบกำหนดชำระเบี้ย'],
    },
    {
      question: 'ใช้ลดหย่อนภาษีได้ไหม?',
      answer: ['ใช้สิทธิลดหย่อนภาษีเงินได้บุคคลธรรมดาได้ ตามประกาศอธิบดีกรมสรรพากรเกี่ยวกับภาษีเงิน ฉบับที่ 172'],
    },
    {
      question: 'เวนคืนกรมธรรม์ได้ไหม?',
      answer: [
        'เวนคืนได้ตามจำนวนที่ระบุในตารางมูลค่ากรมธรรม์ โดยเงินค่าเวนคืนจะเปลี่ยนแปลงหากเคยรับผลประโยชน์ค่ารักษาพยาบาลแล้ว',
        'เงินค่าเวนคืนเท่ากับ (จำนวนเงินเอาประกันภัย หักผลประโยชน์ค่ารักษาพยาบาลทั้งหมดที่บริษัทจ่ายแล้ว) × เงินค่าเวนคืนตามตารางมูลค่าเวนคืน ÷ 1,000',
        'เมื่อเวนคืนและรับเงินค่าเวนคืนแล้ว บริษัทจะไม่จ่ายค่ารักษาพยาบาลที่เกิดก่อนการเวนคืน และอาจมีภาษีย้อนหลังจากกรมสรรพากร',
      ],
    },
    {
      question: 'ถ้ามีสัญญาเพิ่มเติมสุขภาพอยู่แล้ว เลือกใช้สิทธิไหนได้ไหม?',
      answer: ['เลือกได้ว่าจะใช้ความคุ้มครองของสัญญาเพิ่มเติมที่มีอยู่ หรือใช้ความคุ้มครองของโครงการเมืองไทย เฟล็กซี่ โพรเทคชั่น'],
    },
    {
      question: 'มีเงื่อนไข Copay ไหม?',
      answer: ['ไม่มี เพราะแบบประกันนี้มีเบี้ยคงที่ และใช้ผลประโยชน์ค่ารักษาพยาบาลได้หลังชำระเบี้ยครบแล้วเท่านั้น'],
    },
    {
      question: 'ค่ารักษาเป็นแบบเหมาจ่ายหรือจำกัดรายหมวด?',
      answer: ['เป็นแบบเหมาจ่าย ไม่จำกัดวงเงินรายหมวด แต่ผลประโยชน์รวมสูงสุดไม่เกินจำนวนเงินเอาประกันภัย'],
    },
  ],
  contractValidity:
    'หากผู้เอาประกันภัยรู้อยู่แล้วแต่แถลงข้อความเป็นเท็จ หรือรู้อยู่แล้วแต่ไม่เปิดเผยข้อเท็จจริงที่อาจทำให้บริษัทเรียกเบี้ยสูงขึ้นหรือปฏิเสธการรับประกัน สัญญาอาจเป็นโมฆียะตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 865 บริษัทอาจบอกล้างสัญญาและไม่จ่ายเงินตามกรมธรรม์ โดยรับผิดเพียงคืนเบี้ยประกันภัยที่ชำระแล้วทั้งหมด',
  exclusions: [
    'ผู้เอาประกันภัยฆ่าตัวตายด้วยใจสมัครภายใน 1 ปี นับจากวันเริ่มคุ้มครอง วันต่ออายุ วันกลับคืนสถานะครั้งสุดท้าย หรือวันที่บริษัทอนุมัติให้เพิ่มจำนวนเงินเอาประกันภัย โดยกรณีเพิ่มทุนจะไม่คุ้มครองเฉพาะส่วนที่เพิ่มขึ้น',
    'ผู้เอาประกันภัยถูกผู้รับประโยชน์ฆ่าตายโดยเจตนา',
    'ผู้เอาประกันภัยแถลงอายุคลาดเคลื่อน และบริษัทพิสูจน์ได้ว่าอายุจริงในวันที่ทำสัญญาอยู่นอกช่วงอัตราเบี้ยประกันภัยตามทางค้าปกติของบริษัท',
  ],
  warning: 'ผู้ซื้อควรทำความเข้าใจรายละเอียดความคุ้มครองและเงื่อนไขก่อนตัดสินใจทำประกันภัยทุกครั้ง',
  suitability: 'ผู้ที่ต้องการวางทั้งมรดกและงบค่ารักษาหลังอายุ 65 ปีไว้ในกรมธรรม์เดียว',
  caveat: 'ค่ารักษาที่จ่ายออกไปจะลดผลประโยชน์กรณีเสียชีวิตหรือครบสัญญาที่เหลืออยู่',
  brochurePath: assetUrl('/brochures/flexi-protection.pdf'),
  brochureKind: 'brochure',
}

const detailsByProductId: Record<string, DetailedProductContent> = {
  'flexi-protection-99-20': flexiProtectionDetails,
}

const categoryCoverageTitles: Record<ProductCategory, string> = {
  whole_life: 'ความคุ้มครองชีวิตและผลประโยชน์หลัก',
  health: 'วงเงินและความคุ้มครองค่ารักษา',
  critical_illness: 'ผลประโยชน์เมื่อเข้าเงื่อนไขโรค',
  retirement: 'เงินบำนาญและผลประโยชน์ตามสัญญา',
  savings_and_index_linked: 'เงินคืน ผลประโยชน์ และความคุ้มครองชีวิต',
  personal_accident: 'ผลประโยชน์จากอุบัติเหตุ',
  unit_linked: 'ความคุ้มครองและมูลค่าการลงทุน',
  universal_life: 'ความคุ้มครองและมูลค่ากรมธรรม์',
  group: 'สวัสดิการและความคุ้มครองของสมาชิกกลุ่ม',
  takaful: 'ผลประโยชน์และความคุ้มครองตามหลักตะกาฟุล',
}

function valueOrFallback(value: string | null, fallback: string) {
  return value ?? fallback
}

function buildDefaultDetails(product: CatalogProduct): DetailedProductContent {
  const sourceDetails = sourceDetailsByRoute.get(product.id)
  const highlight = getProductHighlight(product)
  const taxBenefit = getProductTaxBenefit(product)
  const highlightValue = `${highlight.options.join(' / ')}${highlight.unit ? ` ${highlight.unit}` : ''}`
  const fallbackPlanFacts: DetailedProductContent['planFacts'] = [
    { label: 'อายุรับประกัน', value: [product.entryAge] },
    { label: 'ระยะชำระเบี้ย', value: [valueOrFallback(product.premiumTerm, 'ขึ้นอยู่กับแบบและสัญญาหลัก')] },
    { label: 'ระยะคุ้มครอง', value: [valueOrFallback(product.coverageTerm, 'ขึ้นอยู่กับแบบและสัญญาหลัก')] },
    ...(product.groupSize ? [{ label: 'ขนาดกลุ่ม', value: [product.groupSize] }] : []),
    { label: 'ประเภทผลิตภัณฑ์', value: [product.productKindLabel] },
  ]
  const sourcePlanFacts = sourceDetails?.facts.flatMap((fact) => {
    const value = readableSourceText(fact)
    return value && fact.label ? [{ label: fact.label, value: [value] }] : []
  }) ?? []
  const planFacts = sourcePlanFacts.length > 0 ? sourcePlanFacts : fallbackPlanFacts

  const sourceHighlights = sourceDetails?.highlights.flatMap((item) => {
    const description = readableSourceText(item)
    return description && item.title ? [{ title: item.title, description }] : []
  }) ?? []
  const highlights: ProductDetailHighlight[] = [
    { title: highlight.label, description: highlightValue },
    { title: 'ความคุ้มครองที่ควรรู้', description: product.helperText },
    { title: 'เหมาะกับใคร', description: product.suitability },
    { title: taxBenefit.title, description: `${taxBenefit.value} — ${taxBenefit.detail}` },
    ...sourceHighlights.filter((item) => !['สาระสำคัญ', 'เหมาะกับใคร'].includes(item.title)),
  ]

  const sourceBenefitPeriods = sourceDetails?.benefitPeriods.flatMap((benefit) => {
    const description = readableSourceText(benefit)
    if (!description) return []
    return [{
      period: benefit.periodLabel ?? categoryCoverageTitles[product.category],
      items: [{ title: 'ผลประโยชน์สำคัญจากข้อมูลทางการ', description }],
    }]
  }) ?? []
  const verifiedBenefitPeriods: ProductBenefitPeriod[] = sourceDetails?.verified.benefits.map((block) => ({
    period: `ข้อมูลผลประโยชน์จากโบรชัวร์ทางการ — หน้า ${block.page}`,
    items: block.displayItems.map((item, index) => verifiedBenefitItem(item.displayText, index)),
  })) ?? []
  const verifiedBenefitSchedulePeriods: ProductBenefitPeriod[] = sourceDetails?.verifiedBenefitSchedule?.periods.map((period) => ({
    period: period.period,
    items: period.displayItems.map((displayText, index) => verifiedBenefitItem(displayText, index)),
  })) ?? []
  const fallbackBenefitPeriods: ProductBenefitPeriod[] = [
    {
      period: categoryCoverageTitles[product.category],
      items: [
        { title: highlight.label, description: highlightValue },
        { title: product.productKindLabel, description: product.helperText },
      ],
    },
    {
      period: 'ช่วงเวลาของสัญญา',
      items: [
        { title: 'ระยะชำระเบี้ย', description: valueOrFallback(product.premiumTerm, 'ตรวจสอบตามแบบและสัญญาหลัก') },
        { title: 'ระยะคุ้มครอง', description: valueOrFallback(product.coverageTerm, 'ตรวจสอบตามเงื่อนไขของสัญญาหลัก') },
      ],
    },
    {
      period: 'ก่อนใช้สิทธิ',
      items: [
        { title: 'เงื่อนไขสำคัญ', description: product.caveat },
        { title: 'ผู้ที่เหมาะกับแผน', description: product.suitability },
      ],
    },
  ]
  const allSourceBenefitPeriods = [...sourceBenefitPeriods, ...verifiedBenefitPeriods, ...verifiedBenefitSchedulePeriods]
  const benefitPeriods = allSourceBenefitPeriods.length > 0
    ? [
        ...allSourceBenefitPeriods,
        {
          period: 'ก่อนใช้สิทธิ',
          items: [
            { title: 'เงื่อนไขสำคัญ', description: product.caveat },
            { title: 'ผู้ที่เหมาะกับแผน', description: product.suitability },
          ],
        },
      ]
    : fallbackBenefitPeriods

  const notes = uniqueText([
    ...(sourceDetails?.notes.map(readableSourceText) ?? []),
    ...verifiedTexts(sourceDetails?.verified.notes),
    ...(sourceDetails?.verifiedBenefitSchedule?.displayItems ?? []),
    product.caveat,
    product.sameProductAs
      ? `หน้านี้เป็นข้อมูลเฉพาะกลุ่มของ ${product.sameProductAs} ไม่ใช่กรมธรรม์อีกฉบับหนึ่ง`
      : 'เบี้ยและผลประโยชน์จริงขึ้นอยู่กับเพศ อายุ สุขภาพ อาชีพ จำนวนเงินเอาประกันภัย และแผนที่เลือก',
  ])

  const sourceFaqs = sourceDetails?.faqs.flatMap((faq) => {
    const answer = readableSourceText(faq)
    return answer && faq.question ? [{ question: faq.question, answer: [answer] }] : []
  }) ?? []
  const fallbackFaqs: ProductFaqItem[] = [
    { question: 'รับสมัครอายุเท่าไร?', answer: [product.entryAge] },
    { question: 'ต้องชำระเบี้ยนานเท่าไร?', answer: [valueOrFallback(product.premiumTerm, 'ขึ้นอยู่กับแบบและสัญญาหลักที่เลือก')] },
    { question: 'คุ้มครองนานเท่าไร?', answer: [valueOrFallback(product.coverageTerm, 'ขึ้นอยู่กับสัญญาหลักและเงื่อนไขการต่ออายุ')] },
    { question: `จุดเด่นเรื่อง “${highlight.label}” คืออะไร?`, answer: [highlightValue, product.helperText] },
    { question: 'แผนนี้เหมาะกับใคร?', answer: [product.suitability] },
    { question: 'มีเรื่องใดต้องตรวจสอบก่อนสมัคร?', answer: [product.caveat] },
    { question: 'ใช้สิทธิลดหย่อนภาษีได้หรือไม่?', answer: [`${taxBenefit.value} — ${taxBenefit.detail}`] },
  ]
  const faqs = sourceFaqs.length > 0
    ? [
        ...sourceFaqs,
        { question: 'มีเรื่องใดต้องตรวจสอบก่อนสมัคร?', answer: [product.caveat] },
        { question: 'ใช้สิทธิลดหย่อนภาษีได้หรือไม่?', answer: [`${taxBenefit.value} — ${taxBenefit.detail}`] },
      ]
    : fallbackFaqs

  const verifiedContractValidity = verifiedTexts(sourceDetails?.verified.contractValidity)
  const contractValidityTexts = uniqueText([
    ...verifiedContractValidity,
    readableSourceText(sourceDetails?.contractValidity),
  ])
  const contractValidity = contractValidityTexts.length > 0 ? contractValidityTexts.join(' ') : null
  const exclusions = uniqueText([
    ...(sourceDetails?.exclusions.map(readableSourceText) ?? []),
    ...verifiedTexts(sourceDetails?.verified.exclusions),
  ])
  const verifiedWarnings = verifiedTexts(sourceDetails?.verified.warnings)
  const warningTexts = uniqueText([
    ...verifiedWarnings,
    ...(sourceDetails?.warnings.map(readableSourceText) ?? []),
  ])
  const warning = warningTexts.length > 0 ? warningTexts.join('\n') : null
  const sourceIntro = readableSourceText(sourceDetails?.overview[0])

  return {
    sourceUrl: product.officialUrl,
    sourceLabel: `เมืองไทยประกันชีวิต — ${product.name}`,
    intro: sourceIntro ?? product.helperText,
    coverageTabLabel: product.category === 'retirement' || product.category === 'savings_and_index_linked'
      ? 'ผลประโยชน์ตามสัญญา'
      : 'ผลประโยชน์และวงเงิน',
    coverageHeading: categoryCoverageTitles[product.category],
    coverageIntro: 'สรุปสาระสำคัญของวงเงิน ระยะเวลา และเงื่อนไขที่ต้องดูร่วมกันก่อนเลือกแผน',
    planFacts,
    highlights,
    benefitPeriods,
    notes,
    faqs,
    contractValidity,
    exclusions,
    warning,
    suitability: product.suitability,
    caveat: product.caveat,
    brochurePath: product.brochurePath,
    brochureKind: product.brochureKind ?? null,
  }
}

export function getDetailedProductContent(product: CatalogProduct): DetailedProductContent {
  return detailsByProductId[product.id] ?? buildDefaultDetails(product)
}
