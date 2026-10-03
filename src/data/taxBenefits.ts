import type { CatalogProduct } from './catalog'

export type TaxBenefitStatus = 'eligible' | 'conditional' | 'not_applicable'

export interface TaxBenefit {
  status: TaxBenefitStatus
  title: string
  value: string
  detail: string
}

const lifeBenefit: TaxBenefit = {
  status: 'eligible',
  title: 'ลดหย่อนประกันชีวิต',
  value: 'สูงสุด 100,000 บาท* (ของตนเอง)',
  detail: 'เมื่อผู้เสียภาษีเป็นผู้เอาประกันและกรมธรรม์มีอายุสัญญาตั้งแต่ 10 ปีขึ้นไปตามเกณฑ์',
}

const healthBenefit: TaxBenefit = {
  status: 'eligible',
  title: 'ลดหย่อนประกันสุขภาพ',
  value: 'ตนเอง 25,000 · พ่อแม่ 15,000 บาท*',
  detail: 'กรณีบิดามารดาต้องเข้าเงื่อนไขเงินได้ และต้องมีหนังสือรับรองเบี้ยประกันภัย',
}

const pensionBenefit: TaxBenefit = {
  status: 'eligible',
  title: 'ลดหย่อนประกันบำนาญ',
  value: 'เพิ่มได้สูงสุด 200,000 บาท*',
  detail: 'ไม่เกิน 15% ของเงินได้ และรวมกลุ่มเงินออมเพื่อเกษียณไม่เกิน 500,000 บาท',
}

const certificateCheck: TaxBenefit = {
  status: 'conditional',
  title: 'อาจใช้สิทธิลดหย่อนได้',
  value: 'ตรวจหนังสือรับรองเบี้ยฯ',
  detail: 'เฉพาะเบี้ยส่วนที่บริษัทรับรองว่าเข้าเกณฑ์ของกรมสรรพากร',
}

const noIndividualBenefit: TaxBenefit = {
  status: 'not_applicable',
  title: 'สิทธิภาษีขึ้นกับผู้ชำระเบี้ย',
  value: 'ตรวจเงื่อนไขก่อนใช้สิทธิ',
  detail: 'ผลิตภัณฑ์กลุ่มหรือสวัสดิการอาจไม่ได้เป็นเบี้ยที่บุคคลนำไปใช้สิทธิได้โดยตรง',
}

export function getProductTaxBenefit(product: CatalogProduct): TaxBenefit {
  if (product.productKind === 'base_policy_annuity') return pensionBenefit

  if (product.category === 'health') {
    if (product.productKind === 'segment_page_not_separate_policy') return certificateCheck
    return healthBenefit
  }

  if (product.category === 'whole_life' || product.category === 'savings_and_index_linked') {
    return lifeBenefit
  }

  if (product.category === 'group') return noIndividualBenefit

  if (product.category === 'takaful') {
    if (product.productKind === 'takaful_whole_life' || product.name.includes('10/4')) return lifeBenefit
    return certificateCheck
  }

  return certificateCheck
}
