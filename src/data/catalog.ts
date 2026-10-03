import officialCatalogJson from "../../data/muangthai-official-products-2026-09-30.json";
import officialBrochuresJson from "../../data/muangthai-official-brochures-2026-09-30.json";
import { assetUrl } from "../basePath";

export type ProductCategory =
  | "whole_life"
  | "health"
  | "critical_illness"
  | "retirement"
  | "savings_and_index_linked"
  | "personal_accident"
  | "unit_linked"
  | "universal_life"
  | "group"
  | "takaful";

export type ProductKind =
  | "annual_online_pa_policy"
  | "annual_pa_policy"
  | "base_policy"
  | "base_policy_annuity"
  | "base_policy_cashback_whole_life"
  | "base_policy_endowment"
  | "base_policy_index_linked"
  | "base_policy_life_and_ci"
  | "base_policy_unit_linked_regular_premium"
  | "base_policy_unit_linked_single_premium"
  | "base_policy_universal_life"
  | "bundle_life_and_pa"
  | "bundle_life_pa_fixed_health_benefit"
  | "group_policy"
  | "rider"
  | "rider_child_ci_lump_sum"
  | "rider_lump_sum"
  | "rider_lump_sum_modular"
  | "rider_medical_reimbursement"
  | "rider_multi_claim_lump_sum"
  | "rider_senior_dependency"
  | "rider_top_up"
  | "segment_page_not_separate_policy"
  | "takaful_pa_rider"
  | "takaful_savings"
  | "takaful_whole_life"
  | "two_cancer_riders_on_one_page"
  | "two_riders_on_one_page";

export type CategoryIconKey =
  | "shield-heart"
  | "heart-pulse"
  | "activity"
  | "landmark"
  | "wallet-cards"
  | "shield-check"
  | "chart-spark"
  | "sliders-horizontal"
  | "users"
  | "moon-star";

export interface RawProductCard {
  category: ProductCategory;
  name: string;
  product_kind: ProductKind;
  entry_age: string;
  premium_term?: string;
  coverage_term?: string;
  group_size?: string;
  key_fact: string;
  same_product_as?: string;
  url: string;
}

export interface OfficialCatalogSource {
  snapshot_date: string;
  canonical_index: string;
  source_owner: string;
  displayed_card_count: number;
  distinct_product_or_bundle_count: number;
  html_product_cards: number;
  takaful_pdf_cards: number;
  scope_note: string;
  duplicate_note: string;
  categories: Record<ProductCategory, number>;
  cards: RawProductCard[];
}

export type ProductDocumentKind = "brochure" | "product_info" | "local_summary";

export interface OfficialDocumentItem {
  name: string;
  kind?: ProductDocumentKind;
  brochure_path?: string;
  source_url?: string;
  local_file: string;
}

export interface OfficialDocumentSource {
  snapshot_date: string;
  source_owner: string;
  base_url: string;
  source_note: string;
  no_official_pdf_found: string[];
  items: OfficialDocumentItem[];
}

export interface ProductEditorial {
  helperText: string;
  suitability: string;
  caveat: string;
}

export interface CatalogProduct extends ProductEditorial {
  id: string;
  name: string;
  imagePath: string;
  category: ProductCategory;
  categoryLabel: string;
  productKind: ProductKind;
  productKindLabel: string;
  entryAge: string;
  premiumTerm: string | null;
  coverageTerm: string | null;
  groupSize: string | null;
  sameProductAs: string | null;
  officialUrl: string;
  isPdf: boolean;
  brochureUrl: string | null;
  brochurePath: string | null;
  brochureFileName: string | null;
  brochureKind: ProductDocumentKind | null;
  hasPdfDownload: boolean;
  sourceKeyFact: string;
  searchText: string;
  source: RawProductCard;
}

export interface CatalogCategory {
  id: ProductCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: CategoryIconKey;
  count: number;
}

export type ProductKindGroup = "base" | "rider" | "bundle" | "annual_pa" | "group_policy" | "takaful";

export const productKindGroups: Record<ProductKindGroup, { label: string; kinds: readonly ProductKind[] }> = {
  base: {
    label: "สัญญาหลัก",
    kinds: ["base_policy", "base_policy_annuity", "base_policy_cashback_whole_life", "base_policy_endowment", "base_policy_index_linked", "base_policy_life_and_ci", "base_policy_unit_linked_regular_premium", "base_policy_unit_linked_single_premium", "base_policy_universal_life"],
  },
  rider: {
    label: "สัญญาเพิ่มเติม (ไรเดอร์)",
    kinds: ["rider", "rider_child_ci_lump_sum", "rider_lump_sum", "rider_lump_sum_modular", "rider_medical_reimbursement", "rider_multi_claim_lump_sum", "rider_senior_dependency", "rider_top_up", "segment_page_not_separate_policy", "two_cancer_riders_on_one_page", "two_riders_on_one_page"],
  },
  bundle: {
    label: "ชุดความคุ้มครอง",
    kinds: ["bundle_life_and_pa", "bundle_life_pa_fixed_health_benefit"],
  },
  annual_pa: {
    label: "อุบัติเหตุรายปี",
    kinds: ["annual_pa_policy", "annual_online_pa_policy"],
  },
  group_policy: {
    label: "ประกันกลุ่ม",
    kinds: ["group_policy"],
  },
  takaful: {
    label: "ตะกาฟุล",
    kinds: ["takaful_savings", "takaful_whole_life", "takaful_pa_rider"],
  },
};

export const productKindGroupOrder: readonly ProductKindGroup[] = ["base", "rider", "bundle", "annual_pa", "group_policy", "takaful"];

export type SortOption = "default" | "name_asc" | "name_desc" | "category";

export function sortProducts(items: CatalogProduct[], sort: SortOption): CatalogProduct[] {
  if (sort === "default") return items;
  const sorted = [...items];
  switch (sort) {
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "th"));
    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "th"));
    case "category":
      return sorted.sort((a, b) => {
        const diff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, "th");
      });
    default:
      return sorted;
  }
}

export interface ProductFilters {
  category?: ProductCategory | ProductCategory[] | "all";
  productKind?: ProductKind | ProductKind[];
  kindGroup?: ProductKindGroup | ProductKindGroup[];
  query?: string;
  includeSegmentPages?: boolean;
  hasBrochure?: boolean;
}

export const rawCatalog = officialCatalogJson as OfficialCatalogSource;
export const rawDocumentCatalog = officialBrochuresJson as OfficialDocumentSource;

const documentsByName = new Map(
  rawDocumentCatalog.items.map((document) => [document.name, document]),
);

export const categoryOrder = [
  "whole_life",
  "health",
  "critical_illness",
  "retirement",
  "savings_and_index_linked",
  "personal_accident",
  "unit_linked",
  "universal_life",
  "group",
  "takaful",
] as const satisfies readonly ProductCategory[];

const categoryMetadata: Record<
  ProductCategory,
  Omit<CatalogCategory, "id" | "count">
> = {
  whole_life: {
    label: "คุ้มครองชีวิตและตลอดชีพ",
    shortLabel: "ชีวิต",
    description: "รายได้ครอบครัว มรดก และความคุ้มครองระยะยาว",
    icon: "shield-heart",
  },
  health: {
    label: "ประกันสุขภาพ",
    shortLabel: "สุขภาพ",
    description: "ค่ารักษา IPD/OPD วงเงินเหมาจ่าย และการเติมสวัสดิการ",
    icon: "heart-pulse",
  },
  critical_illness: {
    label: "โรคร้ายแรง",
    shortLabel: "โรคร้าย",
    description: "เงินก้อนเมื่อเข้าเงื่อนไขโรค หรือค่ารักษาเฉพาะโรค",
    icon: "activity",
  },
  retirement: {
    label: "วางแผนเกษียณและบำนาญ",
    shortLabel: "บำนาญ",
    description: "กระแสเงินหลังเกษียณและสิทธิลดหย่อนตามหลักเกณฑ์",
    icon: "landmark",
  },
  savings_and_index_linked: {
    label: "สะสมทรัพย์และ Index-linked",
    shortLabel: "ออมทรัพย์",
    description: "เงินก้อนตามเวลา เงินคืน และผลตอบแทนอ้างอิงดัชนี",
    icon: "wallet-cards",
  },
  personal_accident: {
    label: "ประกันอุบัติเหตุ",
    shortLabel: "อุบัติเหตุ",
    description: "เสียชีวิตหรือทุพพลภาพ ค่ารักษา และชดเชยรายได้จากอุบัติเหตุ",
    icon: "shield-check",
  },
  unit_linked: {
    label: "Unit-linked",
    shortLabel: "Unit-linked",
    description: "ความคุ้มครองควบการลงทุนที่มูลค่าขึ้นกับกองทุนและค่าใช้จ่าย",
    icon: "chart-spark",
  },
  universal_life: {
    label: "Universal Life",
    shortLabel: "Universal Life",
    description: "ความคุ้มครองยืดหยุ่นพร้อมผลตอบแทนขั้นต่ำตามเงื่อนไข",
    icon: "sliders-horizontal",
  },
  group: {
    label: "ประกันกลุ่ม",
    shortLabel: "กลุ่ม",
    description: "สวัสดิการสำหรับพนักงาน กลุ่มขนาดเล็ก และผู้ปฏิบัติงานในบ้าน",
    icon: "users",
  },
  takaful: {
    label: "เมืองไทยตะกาฟุล",
    shortLabel: "ตะกาฟุล",
    description: "ความคุ้มครองและการออมตามหลักศาสนาอิสลาม",
    icon: "moon-star",
  },
};

export const productKindLabels: Record<ProductKind, string> = {
  annual_online_pa_policy: "ประกันอุบัติเหตุออนไลน์รายปี",
  annual_pa_policy: "ประกันอุบัติเหตุรายปี",
  base_policy: "สัญญาหลัก",
  base_policy_annuity: "สัญญาหลักแบบบำนาญ",
  base_policy_cashback_whole_life: "สัญญาหลักตลอดชีพแบบมีเงินคืน",
  base_policy_endowment: "สัญญาหลักแบบสะสมทรัพย์",
  base_policy_index_linked: "สัญญาหลักแบบ Index-linked",
  base_policy_life_and_ci: "สัญญาหลักชีวิตควบโรคร้ายแรง",
  base_policy_unit_linked_regular_premium: "Unit-linked แบบชำระเบี้ยเป็นงวด",
  base_policy_unit_linked_single_premium: "Unit-linked แบบชำระครั้งเดียว",
  base_policy_universal_life: "สัญญาหลักแบบ Universal Life",
  bundle_life_and_pa: "ชุดความคุ้มครองชีวิตและอุบัติเหตุ",
  bundle_life_pa_fixed_health_benefit:
    "ชุดความคุ้มครองชีวิต อุบัติเหตุ และชดเชยสุขภาพ",
  group_policy: "ประกันกลุ่ม",
  rider: "สัญญาเพิ่มเติม",
  rider_child_ci_lump_sum: "สัญญาเพิ่มเติมโรคร้ายแรงสำหรับเด็ก",
  rider_lump_sum: "สัญญาเพิ่มเติมโรคร้ายแรงแบบเงินก้อน",
  rider_lump_sum_modular: "สัญญาเพิ่มเติมโรคร้ายแรงแบบเลือกแผน",
  rider_medical_reimbursement: "สัญญาเพิ่มเติมค่ารักษาตามจริง",
  rider_multi_claim_lump_sum: "สัญญาเพิ่มเติมโรคร้ายแรงแบบรับได้หลายครั้ง",
  rider_senior_dependency: "สัญญาเพิ่มเติมความเสี่ยงวัยสูงอายุ",
  rider_top_up: "สัญญาเพิ่มเติมสุขภาพแบบ Top-up",
  segment_page_not_separate_policy: "หน้าข้อมูลเฉพาะกลุ่มของผลิตภัณฑ์เดิม",
  takaful_pa_rider: "สัญญาเพิ่มเติมอุบัติเหตุตะกาฟุล",
  takaful_savings: "ตะกาฟุลแบบออมทรัพย์",
  takaful_whole_life: "ตะกาฟุลคุ้มครองตลอดชีพ",
  two_cancer_riders_on_one_page: "สัญญาเพิ่มเติมมะเร็ง 2 แบบ",
  two_riders_on_one_page: "สัญญาเพิ่มเติม 2 แบบ",
};

const thaiTermLabels: Record<string, string> = {
  "1 month-65 years": "1 เดือน–65 ปี",
  "1-65 years": "1–65 ปี",
  "1-70 years": "1–70 ปี",
  "11-90 years": "11–90 ปี",
  "15-65 years": "15–65 ปี",
  "16-69 years": "16–69 ปี",
  "18-60 years": "18–60 ปี",
  "20-65 years": "20–65 ปี",
  "20-75 years": "20–75 ปี",
  "30 days-15 years": "30 วัน–15 ปี",
  "30 days-60 years": "30 วัน–60 ปี",
  "30 days-65 years": "30 วัน–65 ปี",
  "30 days-70 years": "30 วัน–70 ปี",
  "30 days-75 years": "30 วัน–75 ปี",
  "30 days-75 years depending on plan": "30 วัน–75 ปี ขึ้นอยู่กับแผน",
  "30 days-75 years for 3/5/10-year premium options":
    "30 วัน–75 ปี สำหรับแบบชำระเบี้ย 3, 5 หรือ 10 ปี",
  "30 days-80 years": "30 วัน–80 ปี",
  "30 days-80 years on main product page": "30 วัน–80 ปี ตามหน้าผลิตภัณฑ์หลัก",
  "30 days-85 years": "30 วัน–85 ปี",
  "30 days-90 years": "30 วัน–90 ปี",
  "30 days-90 years; child restrictions apply":
    "30 วัน–90 ปี โดยมีข้อกำหนดเฉพาะสำหรับเด็ก",
  "40-80 years": "40–80 ปี",
  "50-75 years": "50–75 ปี",
  "6-63 years": "6–63 ปี",
  "7-65 years": "7–65 ปี",
  "99/5: 30 days-55 years; 99/20: 30 days-45 years":
    "99/5: 30 วัน–55 ปี; 99/20: 30 วัน–45 ปี",
  "D55: 20-50 years; D60/D65: 20-55 years":
    "D55: 20–50 ปี; D60/D65: 20–55 ปี",
  "per-time: 6-80 years; annual aggregate: 6-90 years":
    "แบบต่อครั้ง: 6–80 ปี; แบบเหมาจ่ายรายปี: 6–90 ปี",
  "16 years": "16 ปี",
  "20 years": "20 ปี",
  "3 years": "3 ปี",
  "3, 5, 10 years or to age 99": "3, 5, 10 ปี หรือถึงอายุ 99 ปี",
  "4 years": "4 ปี",
  "5 or 20 years": "5 หรือ 20 ปี",
  "5 years": "5 ปี",
  "6 years": "6 ปี",
  "7 years": "7 ปี",
  "flexible, up to age 99": "ยืดหยุ่น สูงสุดถึงอายุ 99 ปี",
  renewable: "ต่ออายุได้ตามเงื่อนไข",
  "single premium": "ชำระครั้งเดียว",
  "varies by component": "แตกต่างตามองค์ประกอบความคุ้มครอง",
  "10 years": "10 ปี",
  "11 years": "11 ปี",
  "15 years": "15 ปี",
  "15 years, extendable to age 99 under conditions":
    "15 ปี และขยายถึงอายุ 99 ปีได้ตามเงื่อนไข",
  "25 years": "25 ปี",
  "annuity age 65-99": "รับบำนาญอายุ 65–99 ปี",
  "life to age 90; PA to age 76": "ชีวิตถึงอายุ 90 ปี; อุบัติเหตุถึงอายุ 76 ปี",
  "life/fixed health to age 90; PA to age 76":
    "ชีวิตและชดเชยสุขภาพถึงอายุ 90 ปี; อุบัติเหตุถึงอายุ 76 ปี",
  "one year": "1 ปี",
  "one year, renewable": "1 ปี ต่ออายุได้ตามเงื่อนไข",
  "renewable to age 99": "ต่ออายุได้ถึงอายุ 99 ปี",
  "subject to base policy and renewal": "ตามสัญญาหลักและเงื่อนไขการต่ออายุ",
  "to age 21": "ถึงอายุ 21 ปี",
  "to age 70": "ถึงอายุ 70 ปี",
  "to age 71": "ถึงอายุ 71 ปี",
  "to age 80": "ถึงอายุ 80 ปี",
  "to age 81": "ถึงอายุ 81 ปี",
  "to age 85": "ถึงอายุ 85 ปี",
  "to age 90": "ถึงอายุ 90 ปี",
  "to age 95": "ถึงอายุ 95 ปี",
  "to age 99": "ถึงอายุ 99 ปี",
  "up to age 99 under product page": "ตามหน้าผลิตภัณฑ์ คุ้มครองได้ถึงอายุ 99 ปี",
  "20-100 employees": "พนักงาน 20–100 คน",
  "from 2 people under the official page": "เริ่มตั้งแต่ 2 คนตามหน้าทางการ",
};

export const productImagePathsByName: Record<string, string> = {
  "เมืองไทย เฟล็กซี่ โพรเทคชั่น": "/images/plans/01-flexi-protection.webp",
  "เมืองไทย ไลฟ์ไทม์ โพรเทคชั่น 99/20": "/images/plans/02-lifetime-protection.webp",
  "โครงการ เมืองไทย วัยเก๋า อุ่นใจหายห่วง (เพื่อผู้สูงอายุ)": "/images/plans/03-wai-kao-oonjai.webp",
  "โครงการ เมืองไทยวัยเก๋า คุ้มทั่วไทย (เพื่อผู้สูงอายุ)": "/images/plans/04-wai-kao-thailand.webp",
  "เมืองไทย สมาร์ท โพรเทคชั่น 99/20": "/images/plans/05-smart-protection.webp",
  "เมืองไทย แฮปปี้ รีเทิร์น 99/7": "/images/plans/06-happy-return.webp",
  "ดี เฮลท์ ไลต์": "/images/plans/07-d-health-lite.webp",
  "อีลิท เฮลท์ พลัส": "/images/plans/08-elite-health-plus.webp",
  "ประกันสุขภาพเหมาจ่าย เอ็กซ์ตร้า": "/images/plans/09-health-extra.webp",
  "โอพีดีต่อครั้ง และ โอพีดีเหมาจ่าย": "/images/plans/10-opd.webp",
  "เอ็กซ์ตร้าแคร์ พลัส": "/images/plans/11-extra-care-plus.webp",
  "ประกันสุขภาพเด็ก (D Health Lite)": "/images/plans/12-child-health.webp",
  "ซีไอ เพอร์เฟค แคร์": "/images/plans/13-ci-perfect-care.webp",
  "มัลติเพิล ซีไอ": "/images/plans/14-multiple-ci.webp",
  "ดี แคร์": "/images/plans/15-d-care.webp",
  "แคร์ พลัส": "/images/plans/16-care-plus.webp",
  "สมาร์ท ซิลเวอร์ และ สมาร์ท ซิลเวอร์ พลัส": "/images/plans/17-smart-silver.webp",
  "คิดส์ แคร์": "/images/plans/18-kids-care.webp",
  "เพียว แคนเซอร์ และ สัญญาเพิ่มเติมความคุ้มครองมะเร็ง": "/images/plans/19-cancer-care.webp",
  "เมืองไทย 9901 ดี65": "/images/plans/20-annuity-9901-d65.webp",
  "เฟล็กซี่ รีไทร์ 90/5 ดี55 ดี60 ดี65": "/images/plans/21-flexi-retire.webp",
  "เมืองไทย สมาร์ท ลิงค์ โปร 10/1 (Global) Index-Linked": "/images/plans/22-smart-link-pro.webp",
  "เมืองไทย สมาร์ท อินเด็กซ์ 15/6 (Global) ซีรีส์": "/images/plans/23-smart-index-15-6.webp",
  "เมืองไทย สมาร์ท อินเด็กซ์ 15/3 (Global)": "/images/plans/24-smart-index-15-3.webp",
  "เมืองไทย เพอร์เฟค เซฟวิ่ง 11/5": "/images/plans/25-perfect-saving.webp",
  "เมืองไทย ซุปเปอร์ เซฟเวอร์ 25/16": "/images/plans/26-super-saver.webp",
  "เมืองไทย อีซี่ แพลน 11/1": "/images/plans/27-easy-plan.webp",
  "PA Pay Max": "/images/plans/28-pa-pay-max.webp",
  "PA Easy Plan Rider": "/images/plans/29-pa-easy-rider.webp",
  "PA Take Care": "/images/plans/30-pa-take-care.webp",
  "PA Return Cash": "/images/plans/31-pa-return-cash.webp",
  "PA Broken Bone": "/images/plans/32-pa-broken-bone.webp",
  "PA Go": "/images/plans/33-pa-go.webp",
  mDesign: "/images/plans/34-mdesign.webp",
  mOnePlus: "/images/plans/35-moneplus.webp",
  "mGrow 615": "/images/plans/36-mgrow-615.webp",
  "เมืองไทยยูแอล พลัส": "/images/plans/37-ul-plus.webp",
  "เมืองไทย SME 20 plus": "/images/plans/38-sme-20-plus.webp",
  "Small Group & Housekeeping Package": "/images/plans/39-small-group-housekeeping.webp",
  "โครงการตะกาฟุล เซฟวิ่ง 10/4": "/images/plans/40-takaful-saving-10-4.webp",
  "เมืองไทยตะกาฟุลออมทรัพย์ 5/5": "/images/plans/41-takaful-saving-5-5.webp",
  "ตะกาฟุลคุ้มครองตลอดชีพ 95/20": "/images/plans/42-takaful-whole-life.webp",
  "PA Takaful Safety": "/images/plans/43-pa-takaful-safety.webp",
};

const editorialByName: Record<string, ProductEditorial> = {
  "เมืองไทย เฟล็กซี่ โพรเทคชั่น": {
    helperText:
      "ทุนประกันขั้นต่ำ 500,000 บาท และตั้งแต่อายุ 65 ปีสามารถใช้ทุนชีวิตคงเหลือเป็นค่ารักษา IPD/OPD ได้ตามเงื่อนไข",
    suitability: "ผู้ที่ต้องการวางทั้งมรดกและงบค่ารักษาหลังอายุ 65 ปีไว้ในกรมธรรม์เดียว",
    caveat: "ค่ารักษาที่จ่ายออกไปจะลดผลประโยชน์กรณีเสียชีวิตหรือครบสัญญาที่เหลืออยู่",
  },
  "เมืองไทย ไลฟ์ไทม์ โพรเทคชั่น 99/20": {
    helperText:
      "รวมความคุ้มครองชีวิตและผลประโยชน์โรคร้ายแรงตามกลุ่มและระยะ โดยมีทุนประกันขั้นต่ำ 150,000 บาท",
    suitability: "ผู้ที่ต้องการชำระเบี้ย 20 ปีและมีทั้งชีวิตกับเงินก้อนโรคร้ายแรงในโครงสร้างเดียว",
    caveat: "จำนวนและจังหวะการจ่ายผลประโยชน์โรคร้ายแรงเป็นไปตามกลุ่มโรค ระยะ และเงื่อนไขกรมธรรม์",
  },
  "โครงการ เมืองไทย วัยเก๋า อุ่นใจหายห่วง (เพื่อผู้สูงอายุ)": {
    helperText:
      "หน้าเว็บทางการระบุว่าไม่ตรวจและไม่ตอบคำถามสุขภาพ รวมชีวิต อุบัติเหตุ และผลประโยชน์สุขภาพแบบวงเงินแน่นอน",
    suitability: "ผู้สูงวัยที่ต้องการขั้นตอนสมัครง่ายและรวมความคุ้มครองหลักหลายด้าน",
    caveat: "ผลประโยชน์สุขภาพเป็นเงินชดเชยตามวงเงิน ไม่ใช่การเหมาจ่ายค่ารักษาทั้งบิล",
  },
  "โครงการ เมืองไทยวัยเก๋า คุ้มทั่วไทย (เพื่อผู้สูงอายุ)": {
    helperText:
      "ชุดชีวิตและอุบัติเหตุ มีค่ารักษาอุบัติเหตุสูงสุด 25,000 บาทและชดเชยรายวันตามแผน",
    suitability: "ผู้สูงวัยที่เน้นหลักประกันชีวิตและภาระค่าใช้จ่ายจากอุบัติเหตุ",
    caveat: "ควรตรวจตารางผลประโยชน์กรณีเจ็บป่วยใน 2 ปีแรกและอายุสิ้นสุดของความคุ้มครองแต่ละส่วน",
  },
  "เมืองไทย สมาร์ท โพรเทคชั่น 99/20": {
    helperText: "ความคุ้มครองชีวิตระยะยาว ชำระเบี้ย 20 ปี และเบี้ยไม่เพิ่มตามอายุหลังออกกรมธรรม์",
    suitability: "เสาหลักครอบครัวที่ต้องการทุนชีวิตยาวและภาระเบี้ยที่คาดการณ์ได้",
    caveat: "สัญญาเพิ่มเติมที่แนบได้และเงื่อนไขรับประกันขึ้นอยู่กับหลักเกณฑ์ของบริษัท",
  },
  "เมืองไทย แฮปปี้ รีเทิร์น 99/7": {
    helperText: "มีเงินคืนทุกปี พร้อมผลประโยชน์ชีวิตและเงินครบกำหนดตามตารางกรมธรรม์",
    suitability: "ผู้ที่ต้องการกระแสเงินคืนระยะยาวและสามารถรับภาระเบี้ยช่วงสั้น 7 ปีได้",
    caveat: "จำนวนเงินคืนและผลประโยชน์ต้องอ่านจากตารางกรมธรรม์ ไม่ควรตีความเป็นอัตราผลตอบแทนต่อเบี้ย",
  },
  "ดี เฮลท์ ไลต์": {
    helperText:
      "สุขภาพเหมาจ่าย IPD วงเงิน 1 หรือ 5 ล้านบาทต่อการรักษาครั้งหนึ่ง พร้อมตัวเลือก deductible หรือ copay",
    suitability: "คนรุ่นใหม่ ครอบครัว เด็ก และผู้สูงวัยที่ผ่านการพิจารณาสุขภาพและต้องการปรับวงเงินกับค่าเบี้ย",
    caveat:
      "มีระยะรอคอยและการพิจารณาสุขภาพ; เด็กอายุ 30 วัน–10 ปีเลือกได้เฉพาะแผนที่มี deductible หรือ copay ตามหน้าทางการ",
  },
  "อีลิท เฮลท์ พลัส": {
    helperText:
      "วงเงินต่อปี 20, 40, 75 หรือ 100 ล้านบาท พร้อมทางเลือกพื้นที่รักษาและเทคโนโลยีการรักษาตามแผน",
    suitability: "ผู้ใช้โรงพยาบาลระดับสูง ผู้เดินทาง หรือผู้ที่กังวลค่ารักษากรณีใหญ่",
    caveat: "พื้นที่คุ้มครอง วงเงิน และรายการรักษาขึ้นอยู่กับแผน รวมถึงการพิจารณารับประกันของบริษัท",
  },
  "ประกันสุขภาพเหมาจ่าย เอ็กซ์ตร้า": {
    helperText:
      "สุขภาพผู้ป่วยในแบบเหมาจ่ายระดับเริ่มต้น สูงสุด 500,000 บาทต่อการรักษาผู้ป่วยในครั้งหนึ่งตามแผน",
    suitability: "ผู้เริ่มทำงานหรือผู้ไม่มีสวัสดิการที่ต้องการวางความคุ้มครอง IPD ก่อน",
    caveat: "วงเงิน ค่าห้อง และรายการที่จ่ายจริงแตกต่างกันตามแผนและเงื่อนไขสัญญาเพิ่มเติม",
  },
  "โอพีดีต่อครั้ง และ โอพีดีเหมาจ่าย": {
    helperText:
      "มี 2 สัญญาเพิ่มเติม: แบบ 500–3,000 บาทต่อครั้ง สูงสุด 30 ครั้งต่อปี หรือแบบเหมาจ่าย 15,000–100,000 บาทต่อปี",
    suitability: "ผู้ที่ใช้บริการผู้ป่วยนอกบ่อยและต้องการเลือกรูปแบบวงเงินให้ตรงพฤติกรรม",
    caveat: "ควรเทียบเบี้ยกับค่าใช้จริง จำนวนครั้ง และข้อกำหนดของสัญญาหลักก่อนเลือก",
  },
  "เอ็กซ์ตร้าแคร์ พลัส": {
    helperText:
      "สุขภาพแบบ Top-up หลังสวัสดิการหรือประกันเดิม โดยมีความรับผิดส่วนแรกและวงเงินสูงสุด 500,000 บาทตามแผน",
    suitability: "พนักงานที่มีสวัสดิการอยู่แล้วแต่ต้องการเติมช่องว่างเมื่อค่ารักษาสูงกว่าวงเงินเดิม",
    caveat: "ผู้เอาประกันต้องรับผิดชอบค่าใช้จ่ายส่วนแรกตามแผนก่อนเริ่มใช้วงเงิน Top-up",
  },
  "ประกันสุขภาพเด็ก (D Health Lite)": {
    helperText: "หน้าสำหรับครอบครัวที่อธิบายการใช้ D Health Lite กับเด็ก วงเงิน 1 หรือ 5 ล้านบาทต่อครั้งตามแผน",
    suitability: "ผู้ปกครองที่ต้องการวางความคุ้มครองค่ารักษาเหมาจ่ายให้บุตร",
    caveat: "ไม่ใช่แบบประกันแยกจาก D Health Lite และเด็กอายุ 30 วัน–10 ปีมีข้อกำหนด deductible หรือ copay",
  },
  "ซีไอ เพอร์เฟค แคร์": {
    helperText: "เงินก้อนสำหรับ 36 โรคร้ายแรง ครอบคลุมหลายระยะและภาวะแทรกซ้อนที่ระบุตามเงื่อนไข",
    suitability: "ผู้ที่ต้องการเงินก้อนรองรับผลกระทบตั้งแต่ระยะเริ่มต้นจนถึงระยะรุนแรง",
    caveat: "การจ่ายขึ้นกับนิยามโรค ระยะ และเงื่อนไขของสัญญาเพิ่มเติม ไม่ใช่การเบิกค่ารักษาตามจริง",
  },
  "มัลติเพิล ซีไอ": {
    helperText: "คุ้มครอง 35 โรคใน 4 กลุ่ม ผลประโยชน์รวมสูงสุด 400% และคุ้มครองกลุ่มที่เหลือต่อตามเงื่อนไข",
    suitability: "ผู้ที่กังวลการเกิดโรคร้ายแรงมากกว่าหนึ่งกลุ่มหรือมากกว่าหนึ่งครั้ง",
    caveat: "การรับหลายครั้งมีเงื่อนไขเรื่องกลุ่มโรค ระยะเวลา และผลประโยชน์ที่เคยจ่ายแล้ว",
  },
  "ดี แคร์": {
    helperText: "เลือกกลุ่มโรคและระยะความรุนแรงได้จาก 6 รูปแบบแผนตามหน้าทางการ",
    suitability: "ผู้ที่ต้องการจัดลำดับความเสี่ยงโรคร้ายแรงให้เหมาะกับงบประมาณ",
    caveat: "แต่ละแผนครอบคลุมกลุ่มโรคและระยะต่างกัน จึงต้องตรวจนิยามและจำนวนเงินจ่ายก่อนเลือก",
  },
  "แคร์ พลัส": {
    helperText: "ค่ารักษา IPD/OPD สำหรับมะเร็งและ/หรือไตวายเรื้อรัง วงเงิน 1 หรือ 5 ล้านบาทต่อโรคต่อปีตามแผน",
    suitability: "ผู้ที่ต้องการวงเงินค่ารักษาเฉพาะโรคมากกว่าเงินก้อนชดเชยรายได้",
    caveat: "เป็นการจ่ายค่ารักษาตามเงื่อนไขและวงเงินจริง ไม่ใช่เงินก้อนที่นำไปใช้ได้อิสระ",
  },
  "สมาร์ท ซิลเวอร์ และ สมาร์ท ซิลเวอร์ พลัส": {
    helperText: "มีทางเลือกเงินก้อนหรือรายเดือนสำหรับอัลไซเมอร์ หลอดเลือดสมอง และทุพพลภาพตามแผน",
    suitability: "วัยก่อนเกษียณและผู้สูงวัยที่กังวลภาวะพึ่งพิงจากโรคสำคัญ",
    caveat: "ผลประโยชน์แตกต่างตามแบบและสิ้นสุดที่อายุ 81 ปี ไม่ใช่ความคุ้มครองตลอดชีวิต",
  },
  "คิดส์ แคร์": {
    helperText: "เงินก้อนสำหรับ 15 โรคร้ายแรงที่พบบ่อยในเด็ก คุ้มครองถึงอายุ 21 ปีตามเงื่อนไข",
    suitability: "ครอบครัวที่ต้องการเงินสำรองสำหรับการหยุดงานหรือค่าใช้จ่ายเมื่อบุตรเจ็บป่วยรุนแรง",
    caveat: "เป็นผลประโยชน์เงินก้อนเมื่อเข้าเงื่อนไขโรค ไม่ทดแทนประกันสุขภาพเหมาจ่าย",
  },
  "เพียว แคนเซอร์ และ สัญญาเพิ่มเติมความคุ้มครองมะเร็ง": {
    helperText: "หน้าเดียวรวม Pure Cancer แบบเงินก้อน และ Cancer Rider ที่เพิ่มผลประโยชน์เกี่ยวกับการนอนโรงพยาบาล",
    suitability: "ผู้ที่ต้องการเน้นความเสี่ยงมะเร็งโดยเฉพาะและยอมรับขอบเขตที่แคบกว่า CI หลายโรค",
    caveat: "เป็น 2 สัญญาเพิ่มเติมที่มีรูปแบบผลประโยชน์ต่างกัน ต้องตรวจว่าเลือกแบบใดและนิยามมะเร็งที่ใช้",
  },
  "เมืองไทย 9901 ดี65": {
    helperText: "ชำระครั้งเดียวและรับบำนาญอายุ 65–99 ปี ปีละ 12% ของทุนประกันตามตาราง",
    suitability: "ผู้มีเงินก้อนที่ต้องการปิดภาระเบี้ยและสร้างกระแสเงินยาวหลังอายุ 65 ปี",
    caveat: "สิทธิภาษีและจำนวนบำนาญต้องยืนยันจากใบเสนอขายและหลักเกณฑ์ที่ใช้ในปีภาษีนั้น",
  },
  "เฟล็กซี่ รีไทร์ 90/5 ดี55 ดี60 ดี65": {
    helperText: "ชำระ 5 ปี เลือกเริ่มรับบำนาญที่อายุ 55, 60 หรือ 65 ปี เลือกรับรายปีหรือรายเดือน และบำนาญเพิ่มเป็นขั้นได้สูงสุด 24% ต่อปีตามเงื่อนไข",
    suitability: "วัยทำงานที่ต้องการแบ่งชำระช่วงสั้นและกำหนดจังหวะเริ่มรายได้หลังเกษียณ",
    caveat: "การเปลี่ยนอายุเริ่มรับและอัตราบำนาญเป็นไปตามแบบและเงื่อนไข ควรดูตารางกระแสเงินก่อนตัดสินใจ",
  },
  "เมืองไทย สมาร์ท ลิงค์ โปร 10/1 (Global) Index-Linked": {
    helperText: "ชำระครั้งเดียว 10 ปี มีผลประโยชน์ตามตารางและโอกาสจาก Citi Global Multi Asset USD VT 5 Series 3 Index",
    suitability: "ผู้มีเงินก้อนระยะ 10 ปีที่ต้องการส่วนผลประโยชน์ตามสัญญาควบกับโอกาสจากดัชนี",
    caveat: "ส่วนที่อ้างอิงดัชนีไม่ใช่ผลตอบแทนคงที่และไม่ควรสื่อว่าได้รับผลตอบแทนตามตัวอย่างแน่นอน",
  },
  "เมืองไทย สมาร์ท อินเด็กซ์ 15/6 (Global) ซีรีส์": {
    helperText: "ชำระ 6 ปี คุ้มครอง 15 ปี มีผลประโยชน์ตามตารางและโอกาสจาก S&P Multi-Asset Global Macro ESG Index",
    suitability: "ผู้ที่ต้องการแบ่งชำระและรับโอกาสจากดัชนีสากลโดยไม่ได้ถือหน่วยลงทุนเอง",
    caveat: "ผลตอบแทนส่วนดัชนีไม่การันตี ต้องแยกจากผลประโยชน์ที่กำหนดไว้ในสัญญาให้ชัดเจน",
  },
  "เมืองไทย สมาร์ท อินเด็กซ์ 15/3 (Global)": {
    helperText: "ชำระ 3 ปี คุ้มครอง 15 ปี มีเงินคืน 3% ทุก 2 ปีตามเงื่อนไขและส่วนผลตอบแทนอ้างอิงดัชนี",
    suitability: "ผู้ที่ต้องการระยะชำระสั้นกว่าแบบ 15/6 และรับเงินคืนเป็นช่วง",
    caveat: "ตัวอย่างผลตอบแทนจากดัชนีไม่ใช่การรับรองผล และช่องทางออนไลน์อาจมีช่วงอายุรับต่างจากหน้าหลัก",
  },
  "เมืองไทย เพอร์เฟค เซฟวิ่ง 11/5": {
    helperText: "ชำระ 5 ปี คุ้มครอง 11 ปี มีเงินคืนทุก 2 ปีและผลประโยชน์ครบสัญญาตามตาราง",
    suitability: "ผู้ที่วางเป้าหมายเงินก้อนใน 11 ปีและต้องการแบ่งออมช่วง 5 ปี",
    caveat: "เปอร์เซ็นต์ผลประโยชน์ในหน้าเว็บคิดจากทุนประกัน ไม่ใช่อัตราผลตอบแทนต่อเบี้ยหรือ IRR",
  },
  "เมืองไทย ซุปเปอร์ เซฟเวอร์ 25/16": {
    helperText: "ชำระ 16 ปี คุ้มครอง 25 ปี มีเงินคืนทุกปีและความคุ้มครองชีวิตสูงสุด 150% ตามตาราง",
    suitability: "ผู้ที่ต้องการวินัยออมระยะยาวและมีกระแสเงินคืนระหว่างสัญญา",
    caveat: "เป็นภาระระยะยาวและมีสภาพคล่องต่ำกว่าการออมทั่วไป ควรประเมินความสามารถชำระต่อเนื่อง",
  },
  "เมืองไทย อีซี่ แพลน 11/1": {
    helperText: "ชำระครั้งเดียว คุ้มครอง 11 ปี และมีผลประโยชน์รวมตัวอย่างสูงสุด 112% ของทุนตามเงื่อนไข",
    suitability: "ผู้มีเงินก้อนที่ต้องการกำหนดเวลาเงินครบสัญญาชัดเจนและรับความเสี่ยงต่ำ",
    caveat: "112% เป็นสัดส่วนของทุนประกันตามตัวอย่าง ไม่ใช่ผลตอบแทน 112% จากเงินเบี้ย",
  },
  "PA Pay Max": {
    helperText: "สัญญาปีต่อปี รวมชีวิตหรือทุพพลภาพจากอุบัติเหตุ ค่ารักษา และชดเชยรายได้ตามแผน",
    suitability: "ผู้ที่ต้องการแพ็กเกจอุบัติเหตุหลายผลประโยชน์และช่วงอายุรับกว้าง",
    caveat: "วงเงินสูงสุด เช่น กรณีเสียชีวิตจากอุบัติเหตุ 10 ล้านบาท ขึ้นอยู่กับแผนและเงื่อนไข",
  },
  "PA Easy Plan Rider": {
    helperText: "สัญญาเพิ่มเติมอุบัติเหตุ 7 แผน คุ้มครองทั่วโลก 24 ชั่วโมง พร้อมค่ารักษาตามแผน",
    suitability: "ผู้มีกรมธรรม์หลักและต้องการเติมความคุ้มครองอุบัติเหตุ",
    caveat: "ต้องแนบกับสัญญาหลักและระยะคุ้มครองขึ้นอยู่กับกรมธรรม์หลักรวมถึงเงื่อนไขต่ออายุ",
  },
  "PA Take Care": {
    helperText: "เน้นชดเชยรายได้เมื่อนอนโรงพยาบาลจากอุบัติเหตุ โดยผลประโยชน์ ICU เพิ่มเป็น 2 เท่าตามเงื่อนไข",
    suitability: "ผู้ที่หยุดงานแล้วรายได้ลดลงเมื่อเกิดอุบัติเหตุ",
    caveat: "เป็นสัญญาปีต่อปี และจำนวนชดเชยหรือทุนเสียชีวิตแตกต่างตามแผน",
  },
  "PA Return Cash": {
    helperText: "ค่ารักษาอุบัติเหตุสูงสุด 100,000 บาทต่อครั้ง พร้อมชดเชยรายได้และเงื่อนไขคืนบางส่วนเมื่อไม่มีเคลม",
    suitability: "ผู้ที่ต้องการค่ารักษาอุบัติเหตุและให้ความสำคัญกับสิทธิคืนเมื่อไม่มีเคลมต่อเนื่อง",
    caveat: "การคืนเกิดเมื่อเข้าเงื่อนไขไม่มีเคลมต่อเนื่อง 3 ปี และเป็นเพียงบางส่วนตามข้อกำหนด",
  },
  "PA Broken Bone": {
    helperText: "ผลประโยชน์กระดูกหัก แผลไหม้ และอวัยวะภายในบาดเจ็บสูงสุด 200,000 บาท พร้อมค่ารักษาอุบัติเหตุสูงสุด 100,000 บาทตามแผน",
    suitability: "เด็ก ผู้สูงวัย หรือผู้ที่มีกิจกรรมเสี่ยงต่อการหกล้มและกระดูกหัก",
    caveat: "วงเงินสูงสุดและประเภทการบาดเจ็บที่จ่ายขึ้นอยู่กับแผนและตารางผลประโยชน์",
  },
  "PA Go": {
    helperText: "ประกันอุบัติเหตุออนไลน์แบบพื้นฐาน มีทุนเสียชีวิตสูงสุด 500,000 บาทและค่ารักษาสูงสุด 50,000 บาทตามแผน",
    suitability: "ผู้ที่ต้องการซื้อออนไลน์และต้องการวงเงินอุบัติเหตุระดับพื้นฐาน",
    caveat: "เป็นสัญญาปีต่อปี วงเงินและผลประโยชน์จริงขึ้นอยู่กับแผนที่เลือก",
  },
  mDesign: {
    helperText: "Unit-linked ที่ปรับทุนประกันและเลือกกองทุนได้ พร้อมตัวเลือกชำระ 3, 5, 10 ปีหรือถึงอายุ 99 ปี",
    suitability: "ผู้ที่เข้าใจการลงทุนและต้องการปรับทั้งความคุ้มครองกับพอร์ตตามเป้าหมาย",
    caveat: "มูลค่ากรมธรรม์ผันผวนและต้องเพียงพอสำหรับหักค่าการประกันและค่าของสัญญาเพิ่มเติม",
  },
  mOnePlus: {
    helperText: "Unit-linked แบบชำระครั้งเดียว รวมความคุ้มครองชีวิตกับการลงทุนในกองทุนที่เลือก",
    suitability: "ผู้มีเงินก้อนที่รับความผันผวนได้และต้องการทั้งความคุ้มครองกับการลงทุน",
    caveat: "การถอนเงินหรือภาวะตลาดขาลงอาจลดทุนและมูลค่ากรมธรรม์จนไม่พอหักค่าใช้จ่าย",
  },
  "mGrow 615": {
    helperText: "ชำระ 6 ปี คุ้มครอง 15 ปี เลือกกองทุนได้ และมีโบนัส 2% ต้นปีกรมธรรม์ที่ 7 ตามเงื่อนไข",
    suitability: "ผู้ที่ต้องการชำระช่วงสั้นและลงทุนระยะกลางโดยรับความผันผวนของกองทุนได้",
    caveat: "โบนัสไม่ขจัดความเสี่ยงจากกองทุน และต้องพิจารณาค่าธรรมเนียมกับมูลค่าคงเหลือด้วย",
  },
  "เมืองไทยยูแอล พลัส": {
    helperText: "ปรับทุน เบี้ย หรือพักชำระได้ตามเงื่อนไข พร้อมอัตราผลตอบแทนขั้นต่ำของมูลค่าการลงทุน",
    suitability: "ผู้ที่ต้องการความคุ้มครองระยะยาวและความยืดหยุ่นในการบริหารเบี้ยกับทุนประกัน",
    caveat: "ไม่ใช่เงินฝาก; การพักเบี้ยหรือถอนเงินลดมูลค่าและผลประโยชน์ และต้องมีมูลค่าพอหักค่าใช้จ่าย",
  },
  "เมืองไทย SME 20 plus": {
    helperText: "ประกันกลุ่มสำหรับพนักงาน 20–100 คน โดยทุกคนต้องอยู่ในประกันสังคมและสมัครทั้งกลุ่มตามหน้าทางการ",
    suitability: "SME ที่ต้องการจัดสวัสดิการชีวิต สุขภาพ และความคุ้มครองเสริมให้พนักงาน",
    caveat: "คุณสมบัติสมาชิกและการเข้าร่วมทั้งกลุ่มต้องเป็นไปตามหลักเกณฑ์ของผลิตภัณฑ์",
  },
  "Small Group & Housekeeping Package": {
    helperText: "แพ็กเกจกลุ่มเริ่มตั้งแต่ 2 คน สำหรับกลุ่มขนาดเล็กหรือผู้ปฏิบัติงานในบ้าน พร้อมทางเลือก IPD/OPD",
    suitability: "นายจ้างหรือครัวเรือนที่ต้องการจัดสวัสดิการให้สมาชิกกลุ่มขนาดเล็ก",
    caveat: "วงเงิน IPD/OPD และคุณสมบัติสมาชิกขึ้นอยู่กับตารางกลุ่มและเงื่อนไขของบริษัท",
  },
  "โครงการตะกาฟุล เซฟวิ่ง 10/4": {
    helperText: "ชำระ 4 ปี คุ้มครอง 10 ปี พร้อมฮิบะห์และผลประโยชน์ชีวิตตามตารางในเอกสารทางการ",
    suitability: "ผู้ที่ต้องการการออมและความคุ้มครองตามหลักศาสนาอิสลาม",
    caveat: "ต้องอ่านข้อกำหนดกองทุนตะกาฟุล การแบ่งส่วนเกิน และตารางผลประโยชน์ใน PDF ทางการ",
  },
  "เมืองไทยตะกาฟุลออมทรัพย์ 5/5": {
    helperText: "ชำระ 5 ปี คุ้มครอง 5 ปี มีผลประโยชน์ชีวิตและครบสัญญา รวมถึงปันผลพิเศษหากมี",
    suitability: "ผู้ที่ต้องการแผนออมระยะ 5 ปีตามหลักศาสนาอิสลาม",
    caveat: "ปันผลพิเศษไม่ใช่ผลประโยชน์ที่รับรอง ต้องดูรายละเอียดกองทุนและเอกสารทางการ",
  },
  "ตะกาฟุลคุ้มครองตลอดชีพ 95/20": {
    helperText: "ชำระ 20 ปี คุ้มครองชีวิตถึงอายุ 95 ปี และอาจมีปันผลพิเศษตามเอกสารทางการ",
    suitability: "ผู้ที่ต้องการหลักประกันชีวิตระยะยาวตามหลักศาสนาอิสลาม",
    caveat: "ปันผลพิเศษขึ้นอยู่กับเงื่อนไขและไม่ควรนำเสนอเป็นผลประโยชน์ที่การันตี",
  },
  "PA Takaful Safety": {
    helperText: "ความคุ้มครองอุบัติเหตุทั่วโลก 24 ชั่วโมง พร้อมค่ารักษาสูงสุด 100,000 บาทต่อครั้งตามแผน",
    suitability: "ผู้ที่ต้องการความคุ้มครองอุบัติเหตุตามหลักศาสนาอิสลาม",
    caveat: "เป็นความคุ้มครอง 1 ปี และอายุรับ วงเงิน รวมถึงผลประโยชน์แตกต่างตามแผนใน PDF ทางการ",
  },
};

function localizeTerm(value?: string): string | null {
  if (!value) return null;
  return thaiTermLabels[value] ?? value;
}

function productIdFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? pathname;
  return decodeURIComponent(lastSegment)
    .replace(/\.pdf$/i, "")
    .trim()
    .toLocaleLowerCase("en-US");
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("th-TH")
    .replace(/[()/,._–—-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function editorialFor(card: RawProductCard): ProductEditorial {
  const editorial = editorialByName[card.name];
  if (!editorial) {
    throw new Error(`Missing Thai catalog editorial for: ${card.name}`);
  }
  return editorial;
}

function normalizeProduct(card: RawProductCard): CatalogProduct {
  const editorial = editorialFor(card);
  const imagePath = productImagePathsByName[card.name];
  if (!imagePath) {
    throw new Error(`Missing product image for: ${card.name}`);
  }
  const category = categoryMetadata[card.category];
  const entryAge = localizeTerm(card.entry_age) ?? card.entry_age;
  const premiumTerm = localizeTerm(card.premium_term);
  const coverageTerm = localizeTerm(card.coverage_term);
  const groupSize = localizeTerm(card.group_size);
  const productKindLabel = productKindLabels[card.product_kind];
  const document = documentsByName.get(card.name);
  const brochureUrl = document
    ? document.source_url ?? new URL(document.brochure_path as string, rawDocumentCatalog.base_url).href
    : null;
  const brochurePath = document ? assetUrl(`/brochures/${document.local_file}`) : null;
  const searchText = normalizeSearchText(
    [
      card.name,
      category.label,
      category.shortLabel,
      productKindLabel,
      entryAge,
      premiumTerm,
      coverageTerm,
      groupSize,
      card.same_product_as,
      editorial.helperText,
      editorial.suitability,
      editorial.caveat,
    ]
      .filter(Boolean)
      .join(" "),
  );

  return {
    id: productIdFromUrl(card.url),
    name: card.name,
    imagePath: assetUrl(imagePath),
    category: card.category,
    categoryLabel: category.label,
    productKind: card.product_kind,
    productKindLabel,
    entryAge,
    premiumTerm,
    coverageTerm,
    groupSize,
    sameProductAs: card.same_product_as ?? null,
    officialUrl: card.url,
    isPdf: /\.pdf(?:$|\?)/i.test(card.url),
    brochureUrl,
    brochurePath,
    brochureFileName: document?.local_file ?? null,
    brochureKind: document?.kind ?? (document ? "brochure" : null),
    hasPdfDownload: Boolean(document),
    sourceKeyFact: card.key_fact,
    searchText,
    source: card,
    ...editorial,
  };
}

export const products: readonly CatalogProduct[] = Object.freeze(
  rawCatalog.cards.map(normalizeProduct),
);

export const categories: readonly CatalogCategory[] = Object.freeze(
  categoryOrder.map((id) => ({
    id,
    ...categoryMetadata[id],
    count: products.filter((product) => product.category === id).length,
  })),
);

export const SNAPSHOT_DATE = rawCatalog.snapshot_date;
export const OFFICIAL_CATALOG_URL = rawCatalog.canonical_index;
export const SOURCE_OWNER = rawCatalog.source_owner;
export const DISPLAYED_CARD_COUNT = rawCatalog.displayed_card_count;
export const DISTINCT_PRODUCT_COUNT = rawCatalog.distinct_product_or_bundle_count;
export const HTML_PRODUCT_CARD_COUNT = rawCatalog.html_product_cards;
export const TAKAFUL_PDF_CARD_COUNT = rawCatalog.takaful_pdf_cards;
export const PDF_DOWNLOAD_CARD_COUNT = rawDocumentCatalog.items.length;
export const BROCHURE_CARD_COUNT = rawDocumentCatalog.items.filter(
  (document) => (document.kind ?? "brochure") === "brochure",
).length;
export const OFFICIAL_PDF_DOWNLOAD_CARD_COUNT = rawDocumentCatalog.items.filter(
  (document) => document.kind !== "local_summary",
).length;
export const LOCAL_SUMMARY_CARD_COUNT = rawDocumentCatalog.items.filter(
  (document) => document.kind === "local_summary",
).length;
export const NO_OFFICIAL_PDF_NAMES = Object.freeze(rawDocumentCatalog.no_official_pdf_found);
export const PRODUCT_COUNT = products.length;
export const CATEGORY_COUNT = categories.length;
export const CATALOG_SCOPE_NOTE = rawCatalog.scope_note;
export const CATALOG_DUPLICATE_NOTE = rawCatalog.duplicate_note;

const productsById = new Map(products.map((product) => [product.id, product]));
const productsByUrl = new Map(products.map((product) => [product.officialUrl, product]));
const productsByName = new Map(products.map((product) => [product.name, product]));

export function isProductCategory(value: string): value is ProductCategory {
  return categoryOrder.includes(value as ProductCategory);
}

export function getCategory(category: ProductCategory): CatalogCategory {
  return categories.find((item) => item.id === category) as CatalogCategory;
}

export function getProductById(id: string): CatalogProduct | undefined {
  return productsById.get(id.toLocaleLowerCase("en-US"));
}

export function getProductByUrl(url: string): CatalogProduct | undefined {
  return productsByUrl.get(url);
}

export function getProductByName(name: string): CatalogProduct | undefined {
  return productsByName.get(name);
}

export function getProductsByCategory(
  category: ProductCategory,
  source: readonly CatalogProduct[] = products,
): CatalogProduct[] {
  return source.filter((product) => product.category === category);
}

export function searchProducts(
  query: string,
  source: readonly CatalogProduct[] = products,
): CatalogProduct[] {
  const terms = normalizeSearchText(query).split(" ").filter(Boolean);
  if (terms.length === 0) return [...source];
  return source.filter((product) => terms.every((term) => product.searchText.includes(term)));
}

export function filterProducts(
  filters: ProductFilters = {},
  source: readonly CatalogProduct[] = products,
): CatalogProduct[] {
  const categorySet = !filters.category || filters.category === "all"
    ? null
    : Array.isArray(filters.category)
      ? new Set(filters.category as ProductCategory[])
      : new Set([filters.category as ProductCategory]);

  const kindGroupKinds = filters.kindGroup
    ? (Array.isArray(filters.kindGroup) ? filters.kindGroup : [filters.kindGroup])
        .flatMap((g) => [...productKindGroups[g].kinds])
    : null;
  const kindGroupSet = kindGroupKinds ? new Set(kindGroupKinds) : null;

  const kinds = !filters.productKind
    ? null
    : Array.isArray(filters.productKind)
      ? filters.productKind
      : [filters.productKind];

  let result = source.filter((product) => {
    if (categorySet && !categorySet.has(product.category)) return false;
    if (kinds && !kinds.includes(product.productKind)) return false;
    if (kindGroupSet && !kindGroupSet.has(product.productKind)) return false;
    if (filters.hasBrochure && !product.hasPdfDownload) return false;
    if (
      filters.includeSegmentPages === false &&
      product.productKind === "segment_page_not_separate_policy"
    ) {
      return false;
    }
    return true;
  });

  if (filters.query) result = searchProducts(filters.query, result);
  return result;
}

export function getCanonicalProduct(product: CatalogProduct): CatalogProduct {
  if (!product.sameProductAs) return product;
  return getProductByName(product.sameProductAs) ?? product;
}

export function getRelatedProducts(
  productOrId: CatalogProduct | string,
  limit = 3,
): CatalogProduct[] {
  const product =
    typeof productOrId === "string" ? getProductById(productOrId) : productOrId;
  if (!product || limit <= 0) return [];
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.category === product.category &&
        candidate.productKind !== "segment_page_not_separate_policy",
    )
    .slice(0, limit);
}

export function groupProductsByCategory(
  source: readonly CatalogProduct[] = products,
): ReadonlyMap<ProductCategory, readonly CatalogProduct[]> {
  return new Map(
    categoryOrder.map((category) => [category, getProductsByCategory(category, source)]),
  );
}
