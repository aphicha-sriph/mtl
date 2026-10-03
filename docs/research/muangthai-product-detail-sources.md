# แผนที่แหล่งข้อมูลรายละเอียดแบบประกันเมืองไทยประกันชีวิต

ตรวจแหล่งข้อมูลวันที่ 1 ตุลาคม 2569 โดยยึดเฉพาะเว็บไซต์ เอกสาร และไฟล์ PDF ของ บมจ. เมืองไทยประกันชีวิต

## สรุปผล

- รายการอ้างอิงมี **43 การ์ด แต่เป็น 42 ผลิตภัณฑ์/ชุดผลิตภัณฑ์จริง**: หน้า “ประกันสุขภาพเด็ก” เป็นหน้าเฉพาะกลุ่มของ D Health Lite ไม่ใช่กรมธรรม์อีกฉบับหนึ่ง ([official catalog snapshot](../../data/muangthai-official-products-2026-09-30.json#L1-L10), [หน้า All Insurance](https://www.muangthai.co.th/th/all-insurance)).
- แหล่งต้นทางประกอบด้วย **39 หน้า HTML และ 4 รายการตะกาฟุลที่ใช้ PDF เป็น canonical source** ([catalog counts](../../data/muangthai-official-products-2026-09-30.json#L5-L21)).
- มีเอกสารดาวน์โหลด 43 รายการแต่เป็น 42 ไฟล์ไม่ซ้ำ เพราะหน้าเด็กใช้โบรชัวร์ D Health Lite ร่วมกัน เอกสารแบ่งเป็นโบรชัวร์ทางการ 37 รายการ, Online MTL product-information 3 รายการ และ local summary 3 รายการซึ่ง **ไม่ใช่เอกสารทางการ** ([brochure manifest and provenance](../../data/muangthai-official-brochures-2026-09-30.json#L1-L11)).
- ไม่พบ FAQ รายผลิตภัณฑ์ในเนื้อหาหลักของหน้า/โบรชัวร์ที่ตรวจทั้ง 43 รายการ ลิงก์ “คำถามที่พบบ่อย” ที่ท้ายเว็บไซต์เป็น FAQ ส่วนกลาง ดังนั้น FAQ ในหน้ารายละเอียดควรถูกระบุว่าเป็นคำถามที่เรียบเรียงจากข้อเท็จจริง ไม่ใช่ FAQ ที่คัดมาจากบริษัท
- ข้อความ “ความสมบูรณ์ของสัญญา”, “กรณีที่ไม่คุ้มครอง/ข้อยกเว้น” และ “คำเตือน” ไม่ได้ปรากฏครบทุกหน้า แต่กระจายอยู่ในโบรชัวร์ เอกสาร product information หรือเอกสารสัญญา ห้ามเติมเนื้อหาแบบเดียวกันทั้งหมวดโดยไม่มี source ต่อผลิตภัณฑ์
- โค้ดปัจจุบันใช้ compact projection จากชุดข้อมูล source-backed ครบทั้ง 43 routes สำหรับภาพรวม ข้อมูลแบบ ผลประโยชน์ หมายเหตุ และ FAQ ที่เรียบเรียง โดย Flexi Protection มีรายละเอียด bespoke เพิ่มเติม ส่วนข้อความกฎหมายที่ OCR/ตรวจจากต้นทางไม่ได้จะไม่ถูกแทนด้วยข้อยกเว้นกลางของหมวด ([detail integration](../../src/data/productDetails.ts), [source dataset](../../data/muangthai-product-detail-content-2026-10-01.json)).

## วิธีอ่านตาราง

แหล่งข้อมูล: `P` = หน้าเว็บผลิตภัณฑ์ทางการ, `D` = โบรชัวร์/PDF ทางการ, `I` = Online MTL product-information, `LS` = local summary ซึ่งไม่ใช่ต้นทางทางการ

คอลัมน์เนื้อหา: `O/H` = ภาพรวม/จุดเด่น, `B/Y-P` = ผลประโยชน์และตารางตามปี/ช่วง/แผน, `N` = หมายเหตุหรือเงื่อนไขประกอบ, `F` = FAQ รายผลิตภัณฑ์, `C` = ความสมบูรณ์ของสัญญาหรือมาตรา 865, `E` = ข้อยกเว้นหรือรายการไม่คุ้มครอง, `W` = คำเตือน

ค่าในช่องระบุว่าเนื้อหาอยู่ในแหล่งใด เช่น `P+D`; `—` หมายถึงไม่พบในแหล่งที่ตรวจ ไม่ได้แปลว่ากรมธรรม์ฉบับเต็มไม่มีเงื่อนไขนั้น

## แผนที่แหล่งข้อมูลครบ 43 รายการ

| # | Product ID / ผลิตภัณฑ์ | รูปแบบพิเศษ | แหล่งทางการ | O/H | B/Y-P | N | F | C | E | W |
|---:|---|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | `flexi-protection-99-20` — เมืองไทย เฟล็กซี่ โพรเทคชั่น | Base policy | [P](https://www.muangthai.co.th/th/whole-life-insurance/flexi-protection-99-20) · [D](../../public/brochures/flexi-protection.pdf) | P+D | P+D | D | — | D | D | D |
| 2 | `muang-thai-lifetime-protection-99-20` — เมืองไทย ไลฟ์ไทม์ โพรเทคชั่น 99/20 | ชีวิต + CI | [P](https://www.muangthai.co.th/th/whole-life-insurance/muang-thai-lifetime-protection-99-20) · [D](../../public/brochures/lifetime-protection-99-20.pdf) | P | P+D | D | — | D | D | D |
| 3 | `senior_hbpa` — โครงการ เมืองไทย วัยเก๋า อุ่นใจหายห่วง | Bundle หลายสัญญา; ไม่มี PDF ทางการ | [P](https://www.muangthai.co.th/th/whole-life-insurance/senior_hbpa) · LS ไม่ใช่ source | P | P | P | — | — | — | — |
| 4 | `senior-waigao` — โครงการ เมืองไทยวัยเก๋า คุ้มทั่วไทย | Bundle หลายสัญญา; ไม่มี PDF ทางการ | [P](https://www.muangthai.co.th/th/whole-life-insurance/senior-waigao) · LS ไม่ใช่ source | P | P | P | — | — | — | — |
| 5 | `smart-protection-99-20` — เมืองไทย สมาร์ท โพรเทคชั่น 99/20 | Base policy | [P](https://www.muangthai.co.th/th/whole-life-insurance/smart-protection-99-20) · [D](../../public/brochures/smart-protection-99-20.pdf) | P | P+D | D | — | D | D | D |
| 6 | `happy-return-99-7` — เมืองไทย แฮปปี้ รีเทิร์น 99/7 | Base policy | [P](https://www.muangthai.co.th/th/whole-life-insurance/happy-return-99-7) · [D](../../public/brochures/happy-return-99-7.pdf) | P | P+D | D | — | D | — | D |
| 7 | `d-health-lite` — ดี เฮลท์ ไลต์ | Health rider, 11 plans | [P](https://www.muangthai.co.th/th/health-insurance/d-health-lite) · [D](../../public/brochures/d-health-lite.pdf) | P | P+D | D | — | — | D | — |
| 8 | `elite-health-plus` — อีลิท เฮลท์ พลัส | Health rider, plan comparison | [P](https://www.muangthai.co.th/th/health-insurance/elite-health-plus) · [D](../../public/brochures/elite-health-plus.pdf) | P | P+D | D | — | — | — | — |
| 9 | `maochai-extra` — ประกันสุขภาพเหมาจ่าย เอ็กซ์ตร้า | Health rider, 3 plans | [P](https://www.muangthai.co.th/th/health-insurance/maochai-extra) · [D](../../public/brochures/maochai-extra.pdf) | P | P+D | D | — | — | D | D |
| 10 | `opd` — โอพีดีต่อครั้ง และ โอพีดีเหมาจ่าย | หน้าเดียวรวม 2 riders | [P](https://www.muangthai.co.th/th/health-insurance/opd) · [D](../../public/brochures/opd.pdf) | P | P+D | D | — | — | — | — |
| 11 | `extra-care-plus` — เอ็กซ์ตร้าแคร์ พลัส | Health top-up rider | [P](https://www.muangthai.co.th/th/health-insurance/extra-care-plus) · [D](../../public/brochures/extra-care-plus.pdf) | P | P+D | D | — | — | D | — |
| 12 | `kids-health-insurance` — ประกันสุขภาพเด็ก (D Health Lite) | Segment route; same product/PDF as #7 | [P](https://www.muangthai.co.th/th/health-insurance/kids-health-insurance) · [D](../../public/brochures/d-health-lite.pdf) | P | P+D | D | — | — | D | — |
| 13 | `ci-perfect-care` — ซีไอ เพอร์เฟค แคร์ | CI rider | [P](https://www.muangthai.co.th/th/critical-illness-insurance/ci-perfect-care) · [D](../../public/brochures/ci-perfect-care.pdf) | P | P+D | D | — | — | P+D | P+D |
| 14 | `multiple-ci` — มัลติเพิล ซีไอ | CI rider, หลายกลุ่มโรค | [P](https://www.muangthai.co.th/th/critical-illness-insurance/multiple-ci) · [D](../../public/brochures/multiple-ci.pdf) | P | P+D | — | — | — | D | D |
| 15 | `d-care` — ดี แคร์ | CI rider, หลายแผน/กลุ่มโรค | [P](https://www.muangthai.co.th/th/critical-illness-insurance/d-care) · [D](../../public/brochures/d-care.pdf) | P | P+D | D | — | — | P+D | P+D |
| 16 | `care-plus` — แคร์ พลัส | ค่ารักษามะเร็ง/ไต, plan comparison | [P](https://www.muangthai.co.th/th/critical-illness-insurance/care-plus) · [D](../../public/brochures/care-plus.pdf) | P | P+D | D | — | — | — | D |
| 17 | `smart-silver-smart-silver-plus` — สมาร์ท ซิลเวอร์ และ สมาร์ท ซิลเวอร์ พลัส | หน้าเดียวรวม 2 riders | [P](https://www.muangthai.co.th/th/critical-illness-insurance/smart-silver-smart-silver-plus) · [D](../../public/brochures/smart-silver.pdf) | P | P+D | D | — | — | — | D |
| 18 | `kids-care` — คิดส์ แคร์ | CI rider สำหรับเด็ก | [P](https://www.muangthai.co.th/th/critical-illness-insurance/kids-care) · [D](../../public/brochures/kids-care.pdf) | P | P+D | D | — | — | D | — |
| 19 | `pure-cancer` — เพียว แคนเซอร์ และสัญญาเพิ่มเติมความคุ้มครองมะเร็ง | หน้าเดียวรวม 2 cancer riders | [P](https://www.muangthai.co.th/th/critical-illness-insurance/pure-cancer) · [D](../../public/brochures/pure-cancer.pdf) | P | P+D | D | — | — | P+D | P+D |
| 20 | `9901-d65` — เมืองไทย 9901 ดี65 | Annuity | [P](https://www.muangthai.co.th/th/retirement-insurance/9901-d65) · [D](../../public/brochures/9901-d65.pdf) | P | D | D | — | D | — | D |
| 21 | `flexi-retire` — เฟล็กซี่ รีไทร์ 90/5 ดี55 ดี60 ดี65 | 3 annuity variants | [P](https://www.muangthai.co.th/th/retirement-insurance/flexi-retire) · [D](../../public/brochures/flexi-retire.pdf) | P | D | D | — | D | — | D |
| 22 | `muangthai-smart-linked-pro-10-1-global-index-linked` — สมาร์ท ลิงค์ โปร 10/1 | Index-linked | [P](https://www.muangthai.co.th/th/savings-insurance/muangthai-smart-linked-pro-10-1-global-index-linked) · [D](../../public/brochures/smart-linked-pro-10-1-global.pdf) | P | D | D | — | D | D | D |
| 23 | `muangthai-smart-index-15-6-global-index-linked` — สมาร์ท อินเด็กซ์ 15/6 (Global) ซีรีส์ | Index-linked | [P](https://www.muangthai.co.th/th/savings-insurance/muangthai-smart-index-15-6-global-index-linked) · [D](../../public/brochures/smart-index-15-6-global.pdf) | P+D | P+D | D | — | D | D | — |
| 24 | `muangthai-smart-index-15-3-global-index-linked` — สมาร์ท อินเด็กซ์ 15/3 (Global) | Index-linked | [P](https://www.muangthai.co.th/th/savings-insurance/muangthai-smart-index-15-3-global-index-linked) · [D](../../public/brochures/smart-index-15-3-global.pdf) | P | P+D | D | — | D | D | — |
| 25 | `perfectsaving-11-5` — เมืองไทย เพอร์เฟค เซฟวิ่ง 11/5 | ไม่มี brochure; มี Online MTL info | [P](https://www.muangthai.co.th/th/savings-insurance/perfectsaving-11-5) · [I](https://cdn-ols.muangthai.co.th/bo/product-information/11-5_mtl_33.pdf) | P | P+I | P | — | — | — | — |
| 26 | `super-saver-25-16` — เมืองไทย ซุปเปอร์ เซฟเวอร์ 25/16 | Base policy | [P](https://www.muangthai.co.th/th/savings-insurance/super-saver-25-16) · [D](../../public/brochures/super-saver-25-16.pdf) | P | P+D | D | — | D | D | D |
| 27 | `easy-plan-11-1` — เมืองไทย อีซี่ แพลน 11/1 | ไม่มี brochure; มี Online MTL info | [P](https://www.muangthai.co.th/th/savings-insurance/easy-plan-11-1) · [I](https://cdn-ols.muangthai.co.th/bo/product-information/11-1_mtl_129.pdf) | P | P+I | P | — | — | — | — |
| 28 | `pa-pay-max` — PA Pay Max | Standalone PA, หลายแผน | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-pay-max) · [D](../../public/brochures/pa-pay-max.pdf) | P | P+D | D | — | — | — | D |
| 29 | `pa-easy-plan-rider` — PA Easy Plan Rider | PA rider, 7 plans | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-easy-plan-rider) · [D](../../public/brochures/pa-easy-plan-rider.pdf) | P | P+D | D | — | — | D | D |
| 30 | `pa-take-care` — PA Take Care | Standalone PA | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-take-care) · [D](../../public/brochures/pa-take-care.pdf) | P | P+D | D | — | — | — | P |
| 31 | `pa-return-cash` — PA Return Cash | Standalone PA | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-return-cash) · [D](../../public/brochures/pa-return-cash.pdf) | P | P+D | D | — | — | — | P+D |
| 32 | `pa-broken-bone` — PA Broken Bone | PA rider | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-broken-bone) · [D](../../public/brochures/pa-broken-bone.pdf) | P | P+D | D | — | — | P | P+D |
| 33 | `pa-go` — PA Go | Online product; product-info policy PDF | [P](https://www.muangthai.co.th/th/personal-accident-insurance/pa-go) · [I](https://cdn-ols.muangthai.co.th/bo/product-information/condition/image_18a9927fa0443b05ddaa8920c2eff13a.pdf) | P | P+I | P | — | I* | I* | — |
| 34 | `unit-linked-regular-premium` — mDesign | Unit-linked หลาย premium variants/riders | [P](https://www.muangthai.co.th/th/investment/unit-linked-regular-premium) · [D](../../public/brochures/mdesign.pdf) | P | P+D | P+D | — | D | P | P+D |
| 35 | `m-one-plus` — mOnePlus | Single-premium unit-linked | [P](https://www.muangthai.co.th/th/investment/m-one-plus) · [D](../../public/brochures/moneplus.pdf) | P | P+D | P+D | — | D | P+D | P |
| 36 | `mgrow615` — mGrow 615 | Unit-linked, 6/15 | [P](https://www.muangthai.co.th/th/investment/mGrow615) · [D](../../public/brochures/mgrow615.pdf) | P | P+D | P+D | — | D | P+D | P |
| 37 | `muangthai-ul-plus` — เมืองไทยยูแอล พลัส | Universal Life | [P](https://www.muangthai.co.th/th/universal-life/muangthai-ul-plus) · [D](../../public/brochures/muangthai-ul-plus.pdf) | P | P+D | P+D | — | D | P+D | P+D |
| 38 | `sme-20-plus` — เมืองไทย SME 20 plus | Group; ไม่มี PDF ทางการ | [P](https://www.muangthai.co.th/th/group-insurance/sme-20-plus) · LS ไม่ใช่ source | P | P | — | — | — | — | — |
| 39 | `housekeeping-insurance` — Small Group & Housekeeping Package | Group package | [P](https://www.muangthai.co.th/th/group-insurance/housekeeping-insurance) · [D](../../public/brochures/housekeeping-insurance.pdf) | P | P+D | D | — | D | P | D |
| 40 | `21c4eb06-6789-49af-8c7d-827a35f60763` — โครงการตะกาฟุล เซฟวิ่ง 10/4 | PDF-only canonical | [D](https://www.muangthai.co.th/assets/21c4eb06-6789-49af-8c7d-827a35f60763.pdf) · [local](../../public/brochures/takaful-saving-10-4.pdf) | D | D | D | — | D | D | D |
| 41 | `muangthaitakaful-saving5-5` — เมืองไทยตะกาฟุลออมทรัพย์ 5/5 | PDF-only canonical | [D](https://www.muangthai.co.th/assets/7c7ae580-8e10-4788-9b1e-9337bac0cb3b/MuangthaiTakaful-Saving5-5.pdf) · [local](../../public/brochures/takaful-saving-5-5.pdf) | D | D | D | — | D | D | D |
| 42 | `muanthaitakaful-wholelife9520` — ตะกาฟุลคุ้มครองตลอดชีพ 95/20 | PDF-only canonical | [D](https://www.muangthai.co.th/assets/0a0289f0-0823-46b6-acf7-0bc3fc07870b/MuanthaiTakaful-Wholelife9520.pdf) · [local](../../public/brochures/takaful-wholelife-95-20.pdf) | D | D | D | — | D | D | D |
| 43 | `49b8d9b3-edbd-4f42-9d2f-88294fa763a0` — PA Takaful Safety | PDF-only canonical, 4 plans | [D](https://www.muangthai.co.th/assets/49b8d9b3-edbd-4f42-9d2f-88294fa763a0.pdf) · [local](../../public/brochures/pa-takaful-safety.pdf) | D | D | D | — | — | D | D |

`I*` ของ PA Go หมายถึงเอกสารเป็นกรมธรรม์/เงื่อนไขทางการและมีหัวข้อความสมบูรณ์ของสัญญากับข้อยกเว้น แต่ฟอนต์ไทยแบบเก่าทำให้ text extraction เพี้ยน ต้องอ่านภาพหรือ OCR และตรวจด้วยคนก่อนนำข้อความเข้าสู่ระบบ

## กรณีที่ต้อง model แยกจาก “หนึ่งการ์ด = หนึ่งกรมธรรม์”

1. `kids-health-insurance` เป็น route/segment view ของ `d-health-lite`; ควรแชร์ canonical product content และเพิ่มเฉพาะคำอธิบายสำหรับเด็ก
2. `senior_hbpa` และ `senior-waigao` เป็น bundle หลายสัญญา ผลประโยชน์และวันสิ้นสุดอาจต่างกันตาม component
3. `opd`, `pure-cancer` และ `smart-silver-smart-silver-plus` รวมหลาย rider/variant ไว้ในหน้าเดียว ต้องเก็บ benefit table แยกตามสัญญา ไม่รวมตัวเลขข้ามกัน
4. Unit-linked/Universal Life มีเอกสาร rider เพิ่มเติมหลายไฟล์จากหน้าเดียว ควรเก็บเป็น related documents ไม่ควรเอาผลประโยชน์ rider มารวมเป็นผลประโยชน์หลักโดยอัตโนมัติ
5. ตะกาฟุลทั้ง 4 รายการไม่มี HTML product page ใน catalog นี้ Product ID จึงมาจากชื่อไฟล์/segment สุดท้ายของ PDF URL ตามพฤติกรรมปัจจุบันของ catalog

## โมเดลข้อมูลที่แนะนำ

ข้อเสนอด้านล่างเป็นคำแนะนำเชิงสถาปัตยกรรม ไม่ใช่ข้อเท็จจริงจากบริษัท

```ts
type SourceKind = 'official_page' | 'official_brochure' | 'official_product_info' |
  'official_policy' | 'local_summary'

interface SourceRef {
  id: string
  kind: SourceKind
  url: string
  localPath?: string
  authoritative: boolean
  capturedAt: string
  documentDate?: string
  sha256?: string
}

interface DetailBlockBase {
  id: string
  sourceIds: string[]
  sourceLocator?: string // page heading or PDF page number
  displayText: string    // Thai simplified for users
  sourceText?: string    // exact source wording when legal precision matters
  editorial: boolean    // true for paraphrase/FAQ derived from cited facts
  appliesTo?: { variantIds?: string[]; planIds?: string[]; periodIds?: string[] }
}

interface ProductDetailRecord {
  routeId: string
  canonicalProductId: string
  sourceShape: 'single' | 'segment' | 'bundle' | 'multi_contract' | 'pdf_only'
  sources: SourceRef[]
  overview: DetailBlockBase[]
  highlights: DetailBlockBase[]
  facts: DetailBlockBase[]
  benefitSchedules: Array<DetailBlockBase & { rows: BenefitRow[] }>
  notes: DetailBlockBase[]
  faqs: Array<DetailBlockBase & { question: string; answer: string[] }>
  contractValidity?: DetailBlockBase
  exclusions: DetailBlockBase[]
  warnings: DetailBlockBase[]
  relatedDocuments: SourceRef[]
}
```

### กฎนำข้อมูลเข้า

1. เก็บ `routeId` แยกจาก `canonicalProductId` เพื่อรองรับ 43 route แต่ 42 ผลิตภัณฑ์จริง
2. ทุก block ต้องมี `sourceIds` และ locator ถึงหัวข้อหน้าเว็บหรือเลขหน้า PDF; ห้ามใช้ข้อความ category-wide แล้วทำให้ดูเหมือนเป็นข้อกำหนดรายผลิตภัณฑ์
3. ตารางผลประโยชน์ต้องเก็บเป็น structured rows พร้อม `variantIds`, `planIds`, `periodIds` เพื่อไม่ทำตัวเลขข้ามแผน
4. เก็บทั้ง `sourceText` และ `displayText`: อธิบายให้ง่ายได้ แต่ตัวเลข หน่วย เปอร์เซ็นต์ อายุ ปีกรมธรรม์ และเงื่อนไขต้องตรงกับต้นทาง
5. FAQ ให้เป็น `editorial: true` และแต่ละคำตอบต้องอ้าง source เดียวกับข้อเท็จจริงที่ใช้ ห้ามแต่งคำตอบจากความรู้ทั่วไป
6. `contractValidity`, `exclusions`, `warnings` เป็น optional; ถ้าต้นทางที่ตรวจไม่มี ให้ซ่อนหัวข้อหรือแจ้งว่า “โปรดตรวจกรมธรรม์ฉบับจริง” แทนการเติม boilerplate
7. เอกสาร `local_summary` ใช้เป็น convenience download ได้ แต่ `authoritative: false` และห้ามเป็นแหล่งเดียวของตัวเลข/ข้อยกเว้น
8. เพิ่ม validation ที่เทียบ numeric tokens ระหว่าง `sourceText` กับ `displayText` เช่น จำนวนเงิน `%`, อายุ, จำนวนปี, จำนวนครั้ง, วัน และสัดส่วน copay เพื่อป้องกันการเปลี่ยนตัวเลขโดยไม่ตั้งใจ
9. เก็บวันที่เอกสาร/วันที่ตรวจและ hash ของไฟล์ เพื่อให้ audit ได้เมื่อบริษัทเปลี่ยนหน้าเว็บหรือโบรชัวร์

## ช่องว่างและข้อจำกัดที่ต้องแก้ก่อนเติม production content

- ไม่มีโบรชัวร์ทางการสำหรับ `senior_hbpa`, `senior-waigao`, `sme-20-plus`; ต้องใช้หน้า HTML ทางการเป็นหลัก และไม่ควรอ้าง local summary ว่าเป็นเอกสารบริษัท
- PDF ของ Perfect Saving 11/5 และ Easy Plan 11/1 เป็นภาพล้วนในการทดสอบ text extraction ส่วน PA Go ใช้ encoding ไทยเก่า ต้อง OCR/อ่านภาพและตรวจตัวเลขด้วยคนก่อนย้ายข้อมูล
- โบรชัวร์บางฉบับเป็นสื่อการขาย ไม่ใช่กรมธรรม์เต็ม จึงอาจมีคำเตือนแต่ไม่มีข้อยกเว้นครบถ้วน `—` ในตารางคือ “ไม่พบใน source set นี้” ไม่ใช่หลักฐานว่าไม่มีข้อยกเว้น
- หน้า All Insurance เป็น current merchandising list ไม่ใช่ทะเบียนผลิตภัณฑ์ทั้งหมด และการมี URL ไม่ยืนยันสถานะเปิดขายทุกช่องทาง ต้องตรวจระบบใบเสนอขายและเวอร์ชันเอกสารก่อนใช้งานจริง ([scope note](../../data/muangthai-official-products-2026-09-30.json#L9-L10)).

## Verification ที่ทำแล้ว

- เปิดและตรวจ rendered main content ของหน้า HTML ทางการทั้ง 39 หน้า แยก footer ออกเพื่อไม่ให้ลิงก์ FAQ ส่วนกลางถูกนับเป็น FAQ รายผลิตภัณฑ์
- ตรวจไฟล์ PDF ใน `public/brochures` ครบ 42 ไฟล์ เทียบกับ manifest แล้วไม่มีไฟล์ขาด/เกิน; ความซ้ำหนึ่งไฟล์คือ D Health Lite ที่แชร์กับหน้าเด็ก
- แปลง PDF เป็นข้อความเพื่อค้นหัวข้อผลประโยชน์ หมายเหตุ มาตรา 865 ข้อยกเว้น/ไม่คุ้มครอง และคำเตือน พร้อมตรวจตัวอย่างด้วยสายตาในเอกสารที่การ extract มีข้อจำกัด
- สำหรับ 114 blocks ที่ text layer อ่านไม่ได้หรือคอลัมน์ปะปน ได้ใช้ macOS Vision OCR ภาษาไทยกับภาพหน้า PDF และตรวจเทียบภาพทีละบรรทัดแบบ fail-closed: ยืนยันได้ 70 blocks จาก 32 routes (ความสมบูรณ์ของสัญญา 16/17, คำเตือน 24/24, หมายเหตุ 14/34, ข้อยกเว้น 9/19 และ benefit summary เดิม 7/20) ส่วนที่ไม่ชัดเจนมี `displayItems=[]` และไม่ถูกนำขึ้นหน้าเว็บ
- ตารางผลประโยชน์ที่ต้องรักษาคอลัมน์/แผนแยกกันผ่านการตรวจเพิ่มเติม 20 routes: ยืนยันและนำขึ้นระบบ 11 routes ส่วน 9 routes ที่เป็นปก โฆษณาสรุป หรือภาพที่ไม่ใช่ตารางถูกปิดการ emit; D Health Lite/หน้าเด็กแชร์ canonical product และไฟล์เดียวกันโดยไม่รวมตัวเลขข้ามแผน

## ชุดข้อมูลที่สร้างจากงานวิจัยนี้

- ชุดข้อมูลพร้อมนำไปเชื่อม production อยู่ที่ [`data/muangthai-product-detail-content-2026-10-01.json`](../../data/muangthai-product-detail-content-2026-10-01.json) และสร้างซ้ำได้ด้วย [`scripts/research/generate-muangthai-product-detail-content.mjs`](../../scripts/research/generate-muangthai-product-detail-content.mjs)
- หลักฐาน OCR และข้อความที่ตรวจด้วยภาพอยู่ที่ [`data/muangthai-verified-exclusions-2026-10-01.json`](../../data/muangthai-verified-exclusions-2026-10-01.json) และตารางผลประโยชน์แบบแยกแผนอยู่ที่ [`data/muangthai-verified-benefits-2026-10-01.json`](../../data/muangthai-verified-benefits-2026-10-01.json); production ใช้เฉพาะ record ที่ `status=verified`/`emit=true`
- ครบ 43 routes / 42 canonical products และแบ่ง source shape เป็น `single` 33, `bundle` 2, `multi_contract` 3, `segment` 1, `pdf_only` 4
- มี content blocks 446 รายการ ทุก block อ้าง authoritative first-party source, มี locator, ผ่านการเทียบ numeric tokens และ `displayText` มีภาษาไทยที่อ่านได้โดยไม่มี private-use glyph หรือ replacement character
- ระบบตัด document excerpts แบบ fail-closed 114 รายการ: `unsafe_or_unresolved_glyph` 110, `footer_or_contact_text_mixed_into_excerpt` 2 และ `table_like_or_merged_columns` 2; รายละเอียด route/section/page/reason เก็บอยู่ใน `limitations.droppedDocumentBlocks`
- มี 38 routes ที่ source excerpt อย่างน้อยหนึ่งส่วนติดข้อจำกัด OCR/text layer รวม Perfect Saving 11/5 และ Easy Plan 11/1 ที่ไม่มี text layer ใช้งานได้ และ PA Go ที่ encoding อ่านไม่ได้
- หลัง fail-closed มี legal excerpt ที่สะอาดพอให้ emit เพียง `contractValidity` 1 block และ `warnings` 2 blocks; `exclusions` เป็น `[]` ทุก route จนกว่าจะ OCR/ตรวจเอกสารด้วยคนได้ โดยไม่เติม boilerplate หรืออนุมานข้อความที่ไม่ปรากฏใน source set
