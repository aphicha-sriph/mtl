import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'

import type L from 'leaflet'
import { Header } from './components/Header'
import { ArticleDetailPage, ArticlesPage } from './components/Articles'
import { DetailedProductContent, type DetailedProductSection } from './components/DetailedProductContent'
import { Icon, type IconName } from './components/Icons'
import { OptimizedImage } from './components/OptimizedImage'
import { ProductCard } from './components/ProductCard'
import {
  categories,
  DISPLAYED_CARD_COUNT,
  filterProducts,
  getCategory,
  getProductById,
  getRelatedProducts,
  isProductCategory,
  productKindGroupOrder,
  productKindGroups,
  products,
  sortProducts,
  type CatalogProduct,
  type ProductCategory,
  type ProductKindGroup,
  type SortOption,
} from './data/catalog'
import {
  filterHospitals,
  getProvinces,
  networkLabels,
  networkStats,
  regions,
  serviceLabels,
  type Hospital,
} from './data/hospitals'
import { getProductHighlight } from './data/productHighlights'
import { getDetailedProductContent } from './data/productDetails'
import { getProductTaxBenefit } from './data/taxBenefits'
import { getArticleBySlug } from './data/articles'
import { productFromSlug, productPath } from './routes'
import { applySeoData, getSeoData } from './seo'
import { assetUrl, routeUrl, stripBase } from './basePath'

type Navigate = (to: string) => void
type DetailTab = DetailedProductSection | 'documents'

const ComparePanel = lazy(() => import('./components/ComparePanel').then((module) => ({ default: module.ComparePanel })))

const ageRangeOptions = [
  { value: '0-10', label: 'แรกเกิด–10 ปี' },
  { value: '11-17', label: '11–17 ปี' },
  { value: '18-30', label: '18–30 ปี' },
  { value: '31-40', label: '31–40 ปี' },
  { value: '41-50', label: '41–50 ปี' },
  { value: '51-60', label: '51–60 ปี' },
  { value: '61-70', label: '61–70 ปี' },
  { value: '71+', label: '71 ปีขึ้นไป' },
]

const needOptions = [
  { value: 'health', label: 'สุขภาพ', category: 'health' as ProductCategory, icon: 'health' as IconName, image: assetUrl('/images/health-doctor.webp') },
  { value: 'life', label: 'ประกันชีวิต', category: 'whole_life' as ProductCategory, icon: 'shield' as IconName, image: assetUrl('/images/takaful-family.webp') },
  { value: 'child', label: 'วางแผนให้บุตร', category: 'health' as ProductCategory, icon: 'family' as IconName, image: assetUrl('/images/plans/18-kids-care.webp') },
  { value: 'parent', label: 'ดูแลพ่อแม่', category: 'whole_life' as ProductCategory, icon: 'group' as IconName, image: assetUrl('/images/retirement-couple.webp') },
  { value: 'savings', label: 'ออมทรัพย์', category: 'savings_and_index_linked' as ProductCategory, icon: 'savings' as IconName, image: assetUrl('/images/advisor-planning.webp') },
  { value: 'retirement', label: 'เกษียณ', category: 'retirement' as ProductCategory, icon: 'retirement' as IconName, image: assetUrl('/images/plans/20-annuity-9901-d65.webp') },
]

const categoryIconMap: Record<string, IconName> = {
  'shield-heart': 'shield',
  'heart-pulse': 'health',
  'activity': 'heart',
  'landmark': 'retirement',
  'wallet-cards': 'savings',
  'shield-check': 'shield',
  'chart-spark': 'trend',
  'sliders-horizontal': 'spark',
  'users': 'group',
  'moon-star': 'moon',
}

const kindGroupCounts = Object.fromEntries(
  productKindGroupOrder.map((key) => {
    const group = productKindGroups[key]
    return [key, products.filter((p) => (group.kinds as readonly string[]).includes(p.productKind)).length]
  }),
) as Record<ProductKindGroup, number>

const featuredPlans = [
  { id: 'senior_hbpa', title: 'วัยเก๋า', copy: 'ดูแลสุขภาพและค่ารักษา เพื่อชีวิตที่ยังไปต่อได้สบาย' },
  { id: 'd-health-lite', title: 'D Health', copy: 'สำรวจแผนสุขภาพสำหรับค่ารักษาผู้ป่วยในและผู้ป่วยนอก' },
  { id: '9901-d65', title: 'ออมและบำนาญ', copy: 'วางแผนรายได้ระยะยาว เพื่ออนาคตที่มั่นคงขึ้น' },
]

const thaiProvinces = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา',
  'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม',
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์',
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
  'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย',
  'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
  'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
] as const

type ContactMethod = 'phone' | 'line' | 'email'

function EntryAgeValue({ value, explain = false }: { value: string; explain?: boolean }) {
  const planOptions = value.split(';').map((option) => option.trim())
  const parsedOptions = planOptions.map((option) => {
    const match = option.match(/^(\d+)\/(\d+):\s*(.+)$/)
    if (!match) return null

    return {
      plan: `${match[1]}/${match[2]}`,
      premiumYears: match[2],
      ageRange: match[3],
    }
  })

  if (parsedOptions.length < 2 || parsedOptions.some((option) => option === null)) {
    return <>{value}</>
  }

  return (
    <span className="entry-age-value">
      {explain && <small>ช่วงอายุแตกต่างตามระยะชำระเบี้ยที่เลือก</small>}
      {parsedOptions.map((option) => option && (
        <span className="entry-age-option" key={option.plan}>
          <strong>แผน {option.plan} (ชำระเบี้ย {option.premiumYears} ปี):</strong>
          <span>อายุรับ {option.ageRange}</span>
        </span>
      ))}
    </span>
  )
}

function useLocation(initialLocation = '/') {
  const read = () => typeof window === 'undefined'
    ? initialLocation
    : `${stripBase(window.location.pathname)}${window.location.search}`
  const [location, setLocation] = useState(read)

  useEffect(() => {
    const onPopState = () => setLocation(read())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(routeUrl(to), window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setLocation(`${stripBase(url.pathname)}${url.search}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { location, navigate }
}

function Link({ to, navigate, className, children, ariaLabel }: {
  to: string
  navigate: Navigate
  className?: string
  children: ReactNode
  ariaLabel?: string
}) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigate(to)
  }
  return <a href={routeUrl(to)} className={className} onClick={follow} aria-label={ariaLabel}>{children}</a>
}

function ContactChannels() {
  return (
    <div className="contact-channels">
      <a className="contact-channel contact-channel--line contact-channel--recommended" href="https://lin.ee/8jnXKNX" target="_blank" rel="noreferrer">
        <span className="line-mark">LINE</span>
        <span><strong>LINE Official Account</strong><small>@mtlp52 · แนะนำ · ตอบไวที่สุด</small></span>
        <span className="badge-recommended">แนะนำ</span>
        <Icon name="chevron" size={18} />
      </a>
      <a className="contact-channel contact-channel--messenger" href="https://m.me/61588900627833" target="_blank" rel="noreferrer">
        <span className="contact-channel__icon"><Icon name="health" size={23} /></span>
        <span><strong>Messenger</strong><small>ทักแชทสอบถามข้อมูล</small></span>
        <Icon name="chevron" size={18} />
      </a>
      <a className="contact-channel" href="tel:0819742424">
        <span className="contact-channel__icon"><Icon name="health" size={23} /></span>
        <span><strong>081-974-2424</strong></span>
        <Icon name="chevron" size={18} />
      </a>
      <a className="contact-channel" href="tel:0627899969">
        <span className="contact-channel__icon"><Icon name="health" size={23} /></span>
        <span><strong>062-789-9969</strong></span>
        <Icon name="chevron" size={18} />
      </a>
    </div>
  )
}

function ContactForm({ compact = false, planName }: { compact?: boolean; planName?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone')
  const provinceListId = compact ? 'province-list-compact' : 'province-list-full'
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const provinceInput = event.currentTarget.elements.namedItem('province') as HTMLInputElement | null

    if (provinceInput && !thaiProvinces.includes(provinceInput.value.trim() as typeof thaiProvinces[number])) {
      provinceInput.setCustomValidity('กรุณาเลือกจังหวัดจากรายการ')
      provinceInput.reportValidity()
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="contact-success" role="status">
        <span><Icon name="check" size={28} /></span>
        <h3>รับข้อมูลเรียบร้อยแล้ว</h3>
        <p>นี่คือแบบจำลองระบบติดต่อ ที่ปรึกษาจะติดต่อกลับผ่านช่องทางและช่วงเวลาที่เลือก</p>
        <button type="button" className="button button--secondary" onClick={() => setSubmitted(false)}>กรอกข้อมูลใหม่</button>
      </div>
    )
  }

  return (
    <form className={`contact-form ${compact ? 'contact-form--compact' : ''}`} onSubmit={submit}>
      <div className="contact-form__heading">
        <h2>ให้ที่ปรึกษาติดต่อกลับ</h2>
        <p>{planName ? `สอบถามรายละเอียด ${planName}` : 'บอกความต้องการคร่าว ๆ เพื่อให้คุยกันได้ตรงประเด็น'}</p>
      </div>
      <label className="field field--wide">
        <span>ชื่อ–นามสกุล *</span>
        <input name="name" autoComplete="name" required placeholder="เช่น สมชาย ใจดี" />
      </label>
      <label className="field">
        <span>เบอร์โทรศัพท์ *</span>
        <input name="tel" type="tel" autoComplete="tel" required placeholder="เช่น 081-234-5678" />
      </label>
      <label className="field">
        <span>LINE ID {contactMethod === 'line' ? '*' : '(ถ้ามี)'}</span>
        <input name="line" required={contactMethod === 'line'} placeholder="เช่น somchai.mtl" />
      </label>
      <label className="field">
        <span>จังหวัด *</span>
        <input
          name="province"
          list={provinceListId}
          autoComplete="address-level1"
          required
          placeholder="พิมพ์หรือเลือกจังหวัด"
          onInput={(event) => event.currentTarget.setCustomValidity('')}
        />
        <datalist id={provinceListId}>
          {thaiProvinces.map((province) => <option key={province} value={province} />)}
        </datalist>
      </label>
      <label className="field">
        <span>ช่วงเวลาที่สะดวกให้ติดต่อ *</span>
        <select name="contactTime" required defaultValue="">
          <option value="" disabled>เลือกช่วงเวลา</option>
          <option value="morning">ช่วงเช้า 08:30–12:00 น.</option>
          <option value="afternoon">ช่วงบ่าย 12:00–15:00 น.</option>
          <option value="late-afternoon">ช่วงเย็น 15:00–17:30 น.</option>
          <option value="anytime">สะดวกทุกช่วงเวลา</option>
        </select>
      </label>
      {!compact && (
        <>
          <label className="field">
            <span>เรื่องที่อยากปรึกษา</span>
            <select name="topic" defaultValue="health">
              <option value="health">วางแผนสุขภาพ</option>
              <option value="life">ประกันชีวิต</option>
              <option value="child">วางแผนให้บุตร</option>
              <option value="parent">ดูแลพ่อแม่</option>
              <option value="savings">ออมทรัพย์</option>
              <option value="retirement">เกษียณและบำนาญ</option>
            </select>
          </label>
          <label className="field">
            <span>ช่วงอายุผู้เอาประกัน (ถ้าทราบ)</span>
            <select name="ageRange" defaultValue="">
              <option value="">ยังไม่ระบุ</option>
              <option value="under-18">ต่ำกว่า 18 ปี</option>
              <option value="18-30">18–30 ปี</option>
              <option value="31-40">31–40 ปี</option>
              <option value="41-50">41–50 ปี</option>
              <option value="51-60">51–60 ปี</option>
              <option value="over-60">มากกว่า 60 ปี</option>
            </select>
          </label>
        </>
      )}
      <fieldset className="contact-method field--wide">
        <legend>ช่องทางที่ต้องการให้ติดต่อ *</legend>
        <label><input type="radio" name="method" value="phone" checked={contactMethod === 'phone'} onChange={() => setContactMethod('phone')} /> โทรศัพท์</label>
        <label><input type="radio" name="method" value="line" checked={contactMethod === 'line'} onChange={() => setContactMethod('line')} /> LINE</label>
        <label><input type="radio" name="method" value="email" checked={contactMethod === 'email'} onChange={() => setContactMethod('email')} /> อีเมล</label>
      </fieldset>
      {contactMethod === 'email' && (
        <label className="field field--wide">
          <span>อีเมล *</span>
          <input name="email" type="email" autoComplete="email" required placeholder="เช่น somchai@example.com" />
        </label>
      )}
      {!compact && (
        <label className="field field--wide">
          <span>รายละเอียดเพิ่มเติม (ถ้ามี)</span>
          <textarea name="details" rows={3} placeholder="เช่น งบประมาณ ความคุ้มครองที่สนใจ หรือคำถามที่อยากปรึกษา" />
        </label>
      )}
      <label className="consent field--wide">
        <input type="checkbox" required />
        <span>ยินยอมให้ติดต่อกลับเพื่อให้ข้อมูลและคำแนะนำเบื้องต้น <a href="#privacy">ตามนโยบายความเป็นส่วนตัว</a></span>
      </label>
      <button className="button button--primary field--wide" type="submit">
        ส่งข้อมูลให้ที่ปรึกษา
        <Icon name="arrow" size={19} />
      </button>
    </form>
  )
}

function HomePage({ navigate }: { navigate: Navigate }) {
  const [age, setAge] = useState('31-40')
  const [occupation, setOccupation] = useState('employee')
  const [need, setNeed] = useState('health')
  const featured = featuredPlans
    .map((item) => ({ ...item, product: getProductById(item.id) }))
    .filter((item): item is typeof item & { product: CatalogProduct } => Boolean(item.product))

  const submitFinder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selected = needOptions.find((item) => item.value === need) ?? needOptions[0]
    navigate(`/plans?category=${selected.category}&age=${age}&occupation=${occupation}&need=${need}`)
  }

  return (
    <main>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <h1 id="home-title">เลือกแผนที่เหมาะกับ<br /><span>ชีวิตคุณ</span></h1>
          <p>ตอบคำถามสั้น ๆ ไม่กี่ข้อ เพื่อดูแผนประกันที่ใกล้เคียงกับอายุ อาชีพ และสิ่งที่คุณอยากวางแผน</p>
          <div className="home-hero__actions">
            <a href="#finder" className="button button--primary button--large">เริ่มค้นหาแผน <Icon name="arrow" size={20} /></a>
            <Link to="/plans" navigate={navigate} className="button button--secondary button--large">ดูแผนทั้งหมด <Icon name="chevron" size={19} /></Link>
          </div>
        </div>
        <div className="home-hero__media">
          <OptimizedImage src={assetUrl('/images/hero-family.webp')} alt="ครอบครัวไทยหลายวัยใช้เวลาร่วมกันในบ้าน" width={1586} height={992} priority sizes="(max-width: 760px) 100vw, 52vw" />
        </div>
      </section>

      <section id="finder" className="home-finder section-rail" aria-labelledby="finder-title">
        <div className="home-finder__intro">
          <h2 id="finder-title">เริ่มจากคุณ ไม่ใช่ชื่อแผน</h2>
          <p>เลือกข้อมูลสั้น ๆ เพื่อดูแผนที่น่าสนใจ</p>
        </div>
        <form onSubmit={submitFinder}>
          <label><span>ช่วงอายุ</span><select value={age} onChange={(event) => setAge(event.target.value)}>{ageRangeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label><span>อาชีพ</span><select value={occupation} onChange={(event) => setOccupation(event.target.value)}><option value="employee">พนักงานบริษัท</option><option value="business">เจ้าของกิจการ</option><option value="freelance">อาชีพอิสระ</option><option value="government">ข้าราชการ</option><option value="retired">เกษียณแล้ว</option></select></label>
          <label><span>ต้องการวางแผนเรื่องไหน</span><select value={need} onChange={(event) => setNeed(event.target.value)}>{needOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <button className="button button--primary" type="submit">ดูแผนที่เหมาะกับฉัน <Icon name="arrow" size={19} /></button>
        </form>
      </section>

      <section className="featured section-rail" aria-labelledby="featured-title">
        <div className="section-heading section-heading--inline">
          <h2 id="featured-title">แผนเด่นที่คนมองหา</h2>
          <Link to="/plans" navigate={navigate}>ดูแผนทั้งหมด <Icon name="arrow" size={17} /></Link>
        </div>
        <div className="featured__list">
          {featured.map(({ product, title, copy }) => {
            const taxBenefit = getProductTaxBenefit(product)
            return (
              <Link key={product.id} to={productPath(product)} navigate={navigate} className="featured-plan">
                <OptimizedImage src={product.imagePath} alt={product.name} sizes="(max-width: 760px) 45vw, 16vw" />
                <span><strong>{title}</strong><small>{copy}</small><small className={`featured-plan__tax featured-plan__tax--${taxBenefit.status}`}><Icon name="savings" size={15} />{taxBenefit.value}</small><em>ดูรายละเอียด <Icon name="arrow" size={16} /></em></span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="needs section-rail" aria-labelledby="needs-title">
        <div className="needs__heading">
          <h2 id="needs-title">เลือกตามความต้องการ</h2>
          <p>เริ่มจากสิ่งที่สำคัญกับคุณในวันนี้</p>
        </div>
        <div className="needs__viewport">
          <div className="needs__list">
            {needOptions.map((item) => (
              <Link key={item.value} to={`/plans?category=${item.category}&need=${item.value}`} navigate={navigate}>
                <OptimizedImage src={item.image} alt={item.label} sizes="(max-width: 760px) 44vw, 15vw" />
                <span className="needs__shade" aria-hidden="true" />
                <span className="needs__label"><Icon name={item.icon} size={20} />{item.label}</span>
                <span className="needs__arrow"><Icon name="arrow" size={17} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hospital-network section-rail" aria-labelledby="hospital-network-title">
        <div className="hospital-network__copy">
          <p className="hospital-network__label">เครือข่ายโรงพยาบาล</p>
          <h2 id="hospital-network-title">โรงพยาบาลคู่สัญญา<br /><span>ครอบคลุมทั่วประเทศ</span></h2>
          <p className="hospital-network__lead">ผู้เอาประกันสามารถเข้ารับบริการในโรงพยาบาลคู่สัญญาของเมืองไทยประกันชีวิตได้ทั่วประเทศ รวมถึงเครือข่าย MTL Smile Hospital Network ที่ให้บริการพิเศษเฉพาะลูกค้า</p>
          <div className="hospital-network__stats">
            <article><strong>{networkStats.totalHospitals}+</strong><span>โรงพยาบาลคู่สัญญา</span></article>
            <article><strong>{networkStats.smileHospitals}</strong><span>MTL Smile Hospital</span></article>
            <article><strong>{networkStats.provinces}+</strong><span>จังหวัดทั่วประเทศ</span></article>
            <article><strong>{networkStats.regions}</strong><span>ภูมิภาค</span></article>
          </div>
          <div className="hospital-network__features">
            <div><span><Icon name="hospital" size={22} /></span><p><strong>Fax Claim</strong><small>เคลมผ่านโรงพยาบาลได้เลย ไม่ต้องสำรองจ่าย (ตามเงื่อนไข)</small></p></div>
            <div><span><Icon name="health" size={22} /></span><p><strong>ครอบคลุมหลากหลาย</strong><small>ผู้ป่วยใน ผู้ป่วยนอก ทันตกรรม ผ่าตัดแบบไม่นอน รพ.</small></p></div>
            <div><span><Icon name="location" size={22} /></span><p><strong>ทุกภูมิภาค</strong><small>กรุงเทพฯ ภาคเหนือ ภาคใต้ ภาคอีสาน ภาคกลาง</small></p></div>
          </div>
          <div className="hospital-network__actions">
            <Link to="/hospitals" navigate={navigate} className="button button--primary">ค้นหาโรงพยาบาล <Icon name="arrow" size={19} /></Link>
            <a href="https://www.muangthai.co.th/th/hospital-list" target="_blank" rel="noreferrer">ดูข้อมูลจากเว็บทางการ <Icon name="external" size={16} /></a>
          </div>
        </div>
        <div className="hospital-network__media">
          <img src={assetUrl('/images/hospital-network.svg')} alt="แผนที่เครือข่ายโรงพยาบาลคู่สัญญาเมืองไทยประกันชีวิตทั่วประเทศไทย" width={1200} height={800} loading="lazy" />
        </div>
      </section>

      <section className="digital-purchase section-rail" aria-labelledby="digital-purchase-title">
        <OptimizedImage
          className="digital-purchase__image"
          src={assetUrl('/images/digital-face-to-face.webp')}
          alt="ลูกค้าโทรและแชตกับที่ปรึกษา พร้อมยืนยันตัวตนผ่านระบบดิจิทัล"
          width={1536}
          height={1024}
          sizes="(max-width: 900px) 100vw, 1360px"
        />
        <div className="digital-purchase__copy">
          <h2 id="digital-purchase-title">เริ่มซื้อประกันออนไลน์<br /><span>โทรหรือ LINE ก็สะดวก</span></h2>
          <p>เริ่มจากโทรหรือ LINE คุยกับที่ปรึกษาและส่งข้อมูลเบื้องต้น จากนั้นยืนยันตัวตนและชำระเบี้ยออนไลน์ผ่านช่องทางที่บริษัทกำหนด โดยกระบวนการเสนอขายทางอิเล็กทรอนิกส์อยู่ภายใต้หลักเกณฑ์ของ คปภ.</p>
          <div className="digital-purchase__actions">
            <Link to="/contact" navigate={navigate} className="button button--primary">โทรหรือแชตกับเรา <Icon name="arrow" size={19} /></Link>
            <a href="https://oiceservice.oic.or.th/document/File/Law/359/b18b47bd-6638-4005-8e69-be148f768468.pdf" target="_blank" rel="noreferrer">อ่านหลักเกณฑ์จาก คปภ. <Icon name="external" size={16} /></a>
          </div>
        </div>
        <ol className="digital-purchase__steps" aria-label="ขั้นตอนเริ่มซื้อประกันออนไลน์">
          <li><span><Icon name="chat" size={22} /></span><div><strong>โทรหรือคุยผ่าน LINE</strong><small>สอบถามและส่งข้อมูลเบื้องต้นกับที่ปรึกษา</small></div></li>
          <li><span><Icon name="shield" size={22} /></span><div><strong>ยืนยันตัวตนผ่านระบบ</strong><small>ดำเนินการผ่านช่องทางดิจิทัลที่กำหนด</small></div></li>
          <li><span><Icon name="savings" size={22} /></span><div><strong>ชำระออนไลน์เข้าบริษัท</strong><small>ไม่โอนเข้าบัญชีส่วนตัวของตัวแทน</small></div></li>
        </ol>
      </section>

      <section className="insight section-rail" aria-labelledby="insight-title">
        <div className="insight__media">
          <OptimizedImage src={assetUrl('/images/tax-planning-family.webp')} alt="ครอบครัวไทยร่วมกันวางแผนประกันและสิทธิลดหย่อนภาษี" sizes="(max-width: 760px) 100vw, 48vw" />
        </div>
        <div className="insight__copy">
          <p className="insight__label">วางแผนภาษีผ่านความคุ้มครอง</p>
          <h2 id="insight-title">วางแผนประกัน<br />พร้อมใช้สิทธิลดหย่อนภาษี</h2>
          <p className="insight__lead">เลือกกรมธรรม์ให้ตรงกับคนที่คุณดูแล พร้อมเข้าใจวงเงินที่อาจใช้สิทธิได้ก่อนตัดสินใจ</p>
          <div className="tax-benefit-grid" aria-label="ภาพรวมสิทธิลดหย่อนภาษีจากประกัน">
            <article><span><Icon name="shield" size={22} /></span><h3>ประกันชีวิตของตัวเอง</h3><p>สูงสุด <strong>100,000</strong> บาท</p></article>
            <article><span><Icon name="health" size={22} /></span><h3>สุขภาพตัวเองและพ่อแม่</h3><p>ตัวเอง <strong>25,000</strong> · พ่อแม่ <strong>15,000</strong> บาท</p></article>
            <article><span><Icon name="retirement" size={22} /></span><h3>ประกันชีวิตแบบบำนาญ</h3><p>เพิ่มได้สูงสุด <strong>200,000</strong> บาท</p></article>
          </div>
          <p className="insight__note"><Icon name="shield" size={17} />เบี้ยสุขภาพตนเองเมื่อรวมกับเบี้ยประกันชีวิตต้องไม่เกิน 100,000 บาท ส่วนบิดามารดาต้องมีเงินได้ไม่เกิน 30,000 บาทต่อคนต่อปี ทั้งนี้สิทธิจริงขึ้นกับเงื่อนไขและหนังสือรับรองเบี้ยฯ</p>
          <div className="insight__actions">
            <Link to="/plans" navigate={navigate} className="button button--primary">ดูแผนและสิทธิภาษี <Icon name="arrow" size={19} /></Link>
            <a href="https://www.rd.go.th/60058.html" target="_blank" rel="noreferrer">ตรวจเกณฑ์กรมสรรพากร <Icon name="external" size={17} /></a>
          </div>
        </div>
      </section>

      <section className="advisor-team section-rail" aria-labelledby="advisor-team-title">
        <OptimizedImage
          className="advisor-team__image"
          src={assetUrl('/images/advisor-team-placeholder.webp')}
          alt="คุณอภิชาและคุณไชยศักดิ์ ที่ปรึกษาประกันชีวิตในชุดสูทยืนยิ้มพร้อมให้คำปรึกษา"
          width={1536}
          height={1024}
          sizes="(max-width: 760px) 100vw, 48vw"
        />
        <div className="advisor-team__copy">
          <h2 id="advisor-team-title">พร้อมดูแลคุณ<br /><span>ในทุกเรื่องที่สำคัญ</span></h2>
          <p>เริ่มต้นด้วยการรับฟัง เพื่อช่วยคุณมองหาแผนที่เหมาะกับชีวิต งบประมาณ และคนที่คุณอยากดูแล</p>
          <div className="advisor-team__people" aria-label="รายชื่อที่ปรึกษา">
            <article>
              <strong>คุณไชยศักดิ์ พรก่ำศุภะไพศาล</strong>
              <span>เลขที่ตัวแทน 971905</span>
            </article>
            <article>
              <strong>คุณอภิชา ศรีภัทรจินดา</strong>
              <span>เลขที่ตัวแทน 167332</span>
            </article>
          </div>
          <div className="advisor-team__actions">
            <Link to="/contact" navigate={navigate} className="button button--primary">พูดคุยกับทีมเรา <Icon name="arrow" size={19} /></Link>
          </div>
        </div>
      </section>

      <section className="contact-strip section-rail" aria-labelledby="contact-strip-title">
        <div><h2 id="contact-strip-title">อยากให้ช่วยเลือก?</h2><p>ปรึกษาที่ปรึกษา MTL ได้ฟรี ไม่มีค่าใช้จ่าย</p></div>
        <ContactChannels />
      </section>
    </main>
  )
}

function FinderPage({ navigate, selectedIds, onCompare, search }: {
  navigate: Navigate
  selectedIds: string[]
  onCompare: (product: CatalogProduct) => void
  search: string
}) {
  const params = useMemo(() => new URLSearchParams(search), [search])
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(() => {
    const cat = params.get('category')
    return cat && isProductCategory(cat) ? [cat] : []
  })
  const [query, setQuery] = useState('')
  const [selectedKindGroups, setSelectedKindGroups] = useState<ProductKindGroup[]>([])
  const [onlyWithPdf, setOnlyWithPdf] = useState(false)
  const [sort, setSort] = useState<SortOption>('default')
  const [visibleCount, setVisibleCount] = useState(6)
  const [kindDropdownOpen, setKindDropdownOpen] = useState(false)
  const kindDropdownRef = useRef<HTMLDivElement>(null)

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat])
    setVisibleCount(6)
  }

  const toggleKindGroup = (kg: ProductKindGroup) => {
    setSelectedKindGroups((prev) => prev.includes(kg) ? prev.filter((k) => k !== kg) : [...prev, kg])
    setVisibleCount(6)
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedKindGroups.length > 0 || onlyWithPdf || query !== ''

  const clearAll = () => {
    setSelectedCategories([])
    setSelectedKindGroups([])
    setOnlyWithPdf(false)
    setQuery('')
    setSort('default')
    setVisibleCount(6)
  }

  const visibleProducts = useMemo(() => {
    const filtered = filterProducts({
      category: selectedCategories.length > 0 ? selectedCategories : 'all',
      kindGroup: selectedKindGroups.length > 0 ? selectedKindGroups : undefined,
      query: query || undefined,
      hasBrochure: onlyWithPdf || undefined,
    })
    return sortProducts(filtered, sort)
  }, [selectedCategories, selectedKindGroups, query, onlyWithPdf, sort])

  useEffect(() => {
    if (!kindDropdownOpen) return
    const handler = (event: globalThis.MouseEvent) => {
      if (kindDropdownRef.current && !kindDropdownRef.current.contains(event.target as Node)) setKindDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [kindDropdownOpen])

  return (
    <main className="finder-page section-rail">
      <header className="page-heading">
        <h1>ค้นหาแผนที่เหมาะกับคุณ</h1>
        <p>เลือกดูตามหมวดหมู่ ประเภทสัญญา หรือค้นหาจากชื่อแผน</p>
      </header>

      {params.get('compare') === '1' && selectedIds.length < 2 && (
        <div className="compare-guide"><Icon name="compare" size={22} /><span><strong>เริ่มเปรียบเทียบ</strong> เลือก 2–3 แผน แล้วกด "เปรียบเทียบตอนนี้" ที่แถบด้านล่าง</span></div>
      )}

      <div className="tax-card-guide">
        <Icon name="savings" size={21} />
        <p><strong>ดูสิทธิลดหย่อนบนทุกการ์ด</strong><span>วงเงินจริงขึ้นกับผู้เอาประกัน ประเภทกรมธรรม์ และหนังสือรับรองเบี้ยฯ</span></p>
        <a href="https://www.rd.go.th/60058.html" target="_blank" rel="noreferrer">เกณฑ์กรมสรรพากร <Icon name="external" size={16} /></a>
      </div>

      <div className="finder-search"><Icon name="search" size={23} /><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(6) }} placeholder="ค้นหาชื่อแผน เช่น ดี เฮลท์, 9901, เกษียณ, สัญญาเพิ่มเติม" aria-label="ค้นหาชื่อแผน" />{query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><Icon name="close" size={18} /></button>}</div>

      <div className="category-filters" aria-label="เลือกหมวดแผน">
        <button type="button" className={selectedCategories.length === 0 ? 'is-active' : ''} onClick={() => { setSelectedCategories([]); setVisibleCount(6) }}>ทั้งหมด <span className="filter-count">{products.length}</span></button>
        {categories.map((cat) => (
          <button key={cat.id} type="button" className={selectedCategories.includes(cat.id) ? 'is-active' : ''} onClick={() => toggleCategory(cat.id)}>
            <Icon name={categoryIconMap[cat.icon] ?? 'shield'} size={18} />
            {cat.shortLabel}
            <span className="filter-count">{cat.count}</span>
          </button>
        ))}
      </div>

      <div className="filter-toolbar">
        <div className="filter-dropdown" ref={kindDropdownRef}>
          <button type="button" className={`filter-toolbar__btn${selectedKindGroups.length > 0 ? ' is-active' : ''}`} onClick={() => setKindDropdownOpen(!kindDropdownOpen)}>
            <Icon name="filter" size={17} />
            ประเภทสัญญา
            {selectedKindGroups.length > 0 && <span className="filter-badge">{selectedKindGroups.length}</span>}
            <Icon name="chevron" size={14} className={kindDropdownOpen ? 'rotate-180' : ''} />
          </button>
          {kindDropdownOpen && (
            <div className="filter-dropdown__panel">
              {productKindGroupOrder.map((key) => (
                <label key={key} className={selectedKindGroups.includes(key) ? 'is-checked' : ''}>
                  <input type="checkbox" checked={selectedKindGroups.includes(key)} onChange={() => toggleKindGroup(key)} />
                  <span>{productKindGroups[key].label}</span>
                  <span className="filter-count">{kindGroupCounts[key]}</span>
                </label>
              ))}
              {selectedKindGroups.length > 0 && <button type="button" className="filter-dropdown__clear" onClick={() => { setSelectedKindGroups([]); setVisibleCount(6) }}>ล้างทั้งหมด</button>}
            </div>
          )}
        </div>

        <button type="button" className={`filter-toolbar__btn${onlyWithPdf ? ' is-active' : ''}`} onClick={() => { setOnlyWithPdf(!onlyWithPdf); setVisibleCount(6) }}>
          <Icon name="download" size={17} />
          มีเอกสาร PDF
        </button>

        <div className="filter-sort">
          <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="เรียงลำดับ">
            <option value="default">เรียง: ค่าเริ่มต้น</option>
            <option value="name_asc">เรียง: ชื่อ ก–ฮ</option>
            <option value="name_desc">เรียง: ชื่อ ฮ–ก</option>
            <option value="category">เรียง: ตามหมวดหมู่</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          {query && <span className="filter-chip"><span>"{query}"</span><button type="button" onClick={() => setQuery('')} aria-label="ลบคำค้น"><Icon name="close" size={13} /></button></span>}
          {selectedCategories.map((cat) => <span key={cat} className="filter-chip"><span>{getCategory(cat).shortLabel}</span><button type="button" onClick={() => toggleCategory(cat)} aria-label={`ลบ ${getCategory(cat).shortLabel}`}><Icon name="close" size={13} /></button></span>)}
          {selectedKindGroups.map((kg) => <span key={kg} className="filter-chip"><span>{productKindGroups[kg].label}</span><button type="button" onClick={() => toggleKindGroup(kg)} aria-label={`ลบ ${productKindGroups[kg].label}`}><Icon name="close" size={13} /></button></span>)}
          {onlyWithPdf && <span className="filter-chip"><span>มีเอกสาร PDF</span><button type="button" onClick={() => setOnlyWithPdf(false)} aria-label="ลบตัวกรอง PDF"><Icon name="close" size={13} /></button></span>}
          <button type="button" className="filter-clear" onClick={clearAll}>ล้างตัวกรองทั้งหมด</button>
        </div>
      )}

      <div className="result-heading">
        <div><h2 id="result-title">แผนประกันทั้งหมด</h2><p>เลือกอ่านรายละเอียดเฉพาะแผนที่สนใจ</p></div>
        <span>พบ {visibleProducts.length} แผน</span>
      </div>

      {visibleProducts.length ? (
        <>
          <div className="result-list">
            {visibleProducts.slice(0, visibleCount).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={selectedIds.includes(product.id)}
                onOpen={(item) => navigate(productPath(item))}
                onCompare={onCompare}
              />
            ))}
          </div>
          {visibleCount < visibleProducts.length && <button type="button" className="load-more" onClick={() => setVisibleCount((count) => count + 6)}>ดูเพิ่มอีก {Math.min(6, visibleProducts.length - visibleCount)} แผน <Icon name="chevron" size={17} /></button>}
        </>
      ) : (
        <div className="empty-state"><Icon name="search" size={30} /><h3>ยังไม่พบแผนที่ตรงกับตัวกรอง</h3><p>ลองปรับตัวกรอง หรือกลับไปดูทุกหมวด</p><button type="button" className="button button--secondary" onClick={clearAll}>ล้างตัวกรอง</button></div>
      )}
    </main>
  )
}

function ProductPage({ product, navigate, selected, onCompare }: {
  product: CatalogProduct
  navigate: Navigate
  selected: boolean
  onCompare: (product: CatalogProduct) => void
}) {
  const [tab, setTab] = useState<DetailTab>('overview')
  const highlight = getProductHighlight(product)
  const taxBenefit = getProductTaxBenefit(product)
  const detailedContent = getDetailedProductContent(product)
  const related = getRelatedProducts(product, 3)
  const tabs: Array<{ id: DetailTab; label: string }> = [
    { id: 'overview', label: 'ภาพรวม' },
    { id: 'coverage', label: detailedContent.coverageTabLabel },
    { id: 'conditions', label: 'เงื่อนไขและข้อยกเว้น' },
    { id: 'faq', label: 'คำถามที่พบบ่อย' },
    { id: 'documents', label: 'เอกสาร' },
  ]

  return (
    <main className="detail-page section-rail">
      <nav className="breadcrumbs" aria-label="เส้นทางหน้า">
        <Link to="/plans" navigate={navigate}>แผนประกัน</Link><span>/</span><Link to={`/plans?category=${product.category}`} navigate={navigate}>{product.categoryLabel}</Link><span>/</span><strong>{product.name}</strong>
      </nav>

      <section className="detail-hero">
        <div className="detail-hero__media"><OptimizedImage src={product.imagePath} alt={`ภาพประกอบแผน ${product.name}`} priority sizes="(max-width: 760px) 100vw, 48vw" /></div>
        <div className="detail-hero__copy">
          <p className="detail-category">{product.categoryLabel}</p>
          <h1>{product.name}</h1>
          <div className="detail-online-status" role="note">
            <span><Icon name="chat" size={22} /></span>
            <p>
              <strong>รองรับการเริ่มสมัครออนไลน์</strong>
              <small>โทรหรือ LINE · ยืนยันตัวตนผ่านระบบ · ชำระเบี้ยเข้าบริษัท</small>
              <a className="detail-online-source" href="https://oiceservice.oic.or.th/document/File/Law/359/b18b47bd-6638-4005-8e69-be148f768468.pdf" target="_blank" rel="noreferrer">ดูแนวทางจาก คปภ. <Icon name="external" size={12} /></a>
            </p>
          </div>
          <div className="detail-highlight">
            <span>{highlight.label}</span>
            <p>
              <strong>{highlight.options.join(' / ')}</strong>
              {highlight.unit && <em>{highlight.unit}</em>}
            </p>
          </div>
          <p className="detail-lead">{product.helperText}</p>
          <div className={`detail-tax detail-tax--${taxBenefit.status}`}>
            <span><Icon name="savings" size={20} /></span>
            <p><small>{taxBenefit.title}</small><strong>{taxBenefit.value}</strong><em>{taxBenefit.detail}</em></p>
          </div>
          <dl className="detail-facts"><div><dt>อายุรับ</dt><dd><EntryAgeValue value={product.entryAge} /></dd></div><div><dt>ระยะจ่ายเบี้ย</dt><dd>{product.premiumTerm ?? 'ดูตามแผน'}</dd></div><div><dt>{product.groupSize ? 'ขนาดกลุ่ม' : 'ระยะคุ้มครอง'}</dt><dd>{product.groupSize ?? product.coverageTerm ?? 'ดูตามเงื่อนไข'}</dd></div></dl>
          <div className="detail-actions">
            <a className="button button--primary" href="#contact-form">ขอใบเสนอราคา <Icon name="arrow" size={19} /></a>
            <button type="button" className={`button button--secondary ${selected ? 'is-selected' : ''}`} onClick={() => onCompare(product)} aria-label={selected ? 'นำแผนนี้ออกจากรายการเปรียบเทียบ' : 'เพิ่มแผนนี้เพื่อเปรียบเทียบ'}><span className={`compare-check ${selected ? 'is-selected' : ''}`}>{selected && <Icon name="check" size={14} />}</span>{selected ? 'เลือกแล้ว' : 'เปรียบเทียบ'}</button>
            {product.brochurePath && <a className="document-link" href={product.brochurePath} target="_blank" rel="noreferrer"><Icon name="download" size={18} /> {product.brochureKind === 'product_info' ? 'ดาวน์โหลดเอกสารแผน' : product.brochureKind === 'local_summary' ? 'ดาวน์โหลดสรุปแผน' : 'ดาวน์โหลดโบรชัวร์'}</a>}
          </div>
          <p className="detail-online-note">* ช่องทางและขั้นตอนอาจแตกต่างตามแบบประกัน การยืนยันตัวตน และการพิจารณารับประกันของบริษัท</p>
        </div>
      </section>

      <div className="detail-content-layout">
        <section className="detail-information">
          <div className="detail-tabs" role="tablist" aria-label="หัวข้อรายละเอียด">
            {tabs.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'is-active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}
          </div>
          <div className="detail-tab-panel" role="tabpanel">
            {detailedContent && tab !== 'documents'
              ? <DetailedProductContent content={detailedContent} section={tab} />
              : <>
                  {tab === 'overview' && <><h2>ภาพรวมแผนประกัน</h2><p className="detail-body-copy">{product.helperText}</p><div className="benefit-list"><div><span><Icon name="heart" size={25} /></span><p><strong>จุดเด่นของแผนนี้</strong>{product.helperText}</p></div><div><span><Icon name="family" size={25} /></span><p><strong>เหมาะกับใคร</strong>{product.suitability}</p></div><div><span><Icon name="shield" size={25} /></span><p><strong>ก่อนตัดสินใจ</strong>{product.caveat}</p></div></div></>}
                  {tab === 'coverage' && <><h2>ข้อมูลความคุ้มครองเบื้องต้น</h2><p className="detail-body-copy">{product.helperText}</p><dl className="coverage-table"><div><dt>ประเภทผลิตภัณฑ์</dt><dd>{product.productKindLabel}</dd></div><div><dt>อายุรับ</dt><dd><EntryAgeValue value={product.entryAge} explain /></dd></div><div><dt>ระยะชำระเบี้ย</dt><dd>{product.premiumTerm ?? 'ตรวจสอบตามแผน'}</dd></div><div><dt>ระยะคุ้มครอง</dt><dd>{product.coverageTerm ?? 'ตรวจสอบตามเงื่อนไข'}</dd></div></dl></>}
                  {tab === 'conditions' && <><h2>เงื่อนไขสำคัญที่ควรตรวจสอบ</h2><p className="detail-body-copy">{product.caveat}</p><div className="disclosure"><Icon name="shield" size={21} /><p>เบี้ย ความคุ้มครอง ระยะรอคอย ข้อยกเว้น และการรับประกันขึ้นอยู่กับอายุ สุขภาพ อาชีพ และแผนที่เลือก โปรดตรวจเอกสารฉบับล่าสุดก่อนตัดสินใจ</p></div></>}
                </>}
            {tab === 'documents' && <>
              <h2>เอกสารและแหล่งข้อมูล</h2>
              <p className="detail-body-copy">ดาวน์โหลดเอกสารเพื่ออ่านตัวอย่างเบี้ย ตารางผลประโยชน์ เงื่อนไข และข้อยกเว้นฉบับเต็ม</p>
              {product.brochurePath && <div className="brochure-cta brochure-cta--hero" style={{ marginTop: 18 }}>
                <div className="brochure-cta__icon"><Icon name="download" size={28} /></div>
                <div className="brochure-cta__copy">
                  <strong>{product.brochureKind === 'product_info' ? 'เอกสารข้อมูลแผน' : product.brochureKind === 'local_summary' ? 'สรุปแผนประกัน' : 'โบรชัวร์แผนประกัน'}</strong>
                  <p>{product.brochureKind === 'local_summary' ? 'สรุปที่จัดทำภายในเว็บไซต์ ไม่ใช่โบรชัวร์ทางการ' : 'เอกสาร PDF ฉบับเต็มจากเมืองไทยประกันชีวิต พร้อมตัวอย่างเบี้ยและตารางผลประโยชน์'}</p>
                </div>
                <a className="brochure-cta__button" href={product.brochurePath} target="_blank" rel="noreferrer"><Icon name="download" size={17} /> ดาวน์โหลด PDF</a>
              </div>}
              <div className="document-list">
                <a href={product.officialUrl} target="_blank" rel="noreferrer"><Icon name="external" size={22} /><span><strong>ข้อมูลจากเว็บไซต์ทางการ</strong><small>ตรวจสอบข้อมูลฉบับล่าสุดจากแหล่งต้นทาง</small></span><Icon name="chevron" size={17} /></a>
              </div>
            </>}
          </div>
          <div className="detail-disclaimer"><Icon name="shield" size={19} /><p>ข้อมูลเพื่อการสำรวจเบื้องต้น โปรดตรวจใบเสนอขาย ตารางผลประโยชน์ และเงื่อนไขกรมธรรม์ฉบับล่าสุดก่อนตัดสินใจ</p></div>
        </section>

        <aside id="contact-form" className="detail-contact"><ContactForm compact planName={product.name} /><div className="contact-divider"><span>หรือติดต่อเราโดยตรง</span></div><ContactChannels /></aside>
      </div>

      {related.length > 0 && <section className="related-plans"><div className="section-heading section-heading--inline"><h2>แผนที่อาจเหมาะกับคุณ</h2><Link to={`/plans?category=${product.category}`} navigate={navigate}>ดูทั้งหมด <Icon name="arrow" size={17} /></Link></div><div className="related-plans__list">{related.map((item) => <Link key={item.id} to={productPath(item)} navigate={navigate}><OptimizedImage src={item.imagePath} alt={item.name} sizes="(max-width: 760px) 92px, 110px" /><span><strong>{item.name}</strong><small>{item.categoryLabel}</small></span><Icon name="chevron" size={18} /></Link>)}</div></section>}
    </main>
  )
}

const networkColors: Record<Hospital['network'], string> = {
  smile: '#e0006d',
  other: '#6b7280',
  clinic: '#0066cc',
  telemedicine: '#007a35',
}

function HospitalMap({ hospitals, visible }: { hospitals: Hospital[]; visible: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const leafletRef = useRef<typeof import('leaflet') | null>(null)

  useEffect(() => {
    if (visible && mapInstance.current) {
      setTimeout(() => mapInstance.current?.invalidateSize(), 100)
    }
  }, [visible])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return
      leafletRef.current = L

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)

      const map = L.map(mapRef.current, {
        center: [13.0, 101.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 18,
        scrollWheelZoom: true,
        zoomControl: false,
      })

      L.control.zoom({ position: 'topright' }).addTo(map)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      markersRef.current = L.layerGroup().addTo(map)
      mapInstance.current = map
      setMapReady(true)

      setTimeout(() => map.invalidateSize(), 200)
    })

    return () => {
      cancelled = true
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        markersRef.current = null
        setMapReady(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !markersRef.current || !leafletRef.current) return
    const L = leafletRef.current
    markersRef.current.clearLayers()

    for (const h of hospitals) {
      const color = networkColors[h.network]
      const marker = L.circleMarker([h.lat, h.lng], {
        radius: h.network === 'smile' ? 9 : 7,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`
      const badge = h.network === 'smile'
        ? '<span style="background:#fce4ef;color:#e0006d;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700">MTL Smile</span>'
        : h.isGovernment
          ? '<span style="background:#fef7e0;color:#8b6914;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700">รัฐบาล</span>'
          : ''

      marker.bindPopup(`
        <div style="min-width:220px;font-family:inherit">
          <div style="margin-bottom:6px">${badge}</div>
          <strong style="font-size:16px;line-height:1.3;display:block;margin-bottom:4px">รพ.${h.name}</strong>
          <div style="color:#6b7280;font-size:12px;margin-bottom:4px">${h.province} · ${h.region}</div>
          <div style="color:#374151;font-size:13px;line-height:1.4;margin-bottom:10px">${h.address}</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <a href="tel:${h.phone}" style="display:inline-flex;align-items:center;gap:6px;color:#e0006d;font-weight:700;font-size:15px;text-decoration:none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              ${h.phone}
            </a>
            <a href="${googleMapsUrl}" target="_blank" rel="noreferrer" style="display:inline-flex;align-items:center;gap:6px;color:#2563eb;font-weight:600;font-size:13px;text-decoration:none">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              เปิดใน Google Maps
            </a>
          </div>
        </div>
      `, { maxWidth: 300 })

      marker.addTo(markersRef.current!)
    }

    if (hospitals.length > 0 && mapInstance.current) {
      const bounds = L.latLngBounds(hospitals.map(h => [h.lat, h.lng] as [number, number]))
      mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
    }
  }, [hospitals, mapReady])

  return <div ref={mapRef} className="hospital-map__canvas" style={visible ? undefined : { display: 'none' }} />
}

function HospitalsPage() {
  const [query, setQuery] = useState('')
  const [network, setNetwork] = useState<Hospital['network'] | 'all'>('all')
  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [visibleCount, setVisibleCount] = useState(12)
  const [showMap, setShowMap] = useState(true)

  const filtered = useMemo(
    () => filterHospitals({ query, network, region, province }),
    [query, network, region, province],
  )

  const provinceList = useMemo(() => getProvinces(), [])

  const reset = () => {
    setQuery('')
    setNetwork('all')
    setRegion('')
    setProvince('')
    setVisibleCount(12)
  }

  return (
    <main className="hospitals-page section-rail">
      <header className="page-heading">
        <h1>ค้นหาโรงพยาบาลคู่สัญญา</h1>
        <p>ค้นหาโรงพยาบาลในเครือข่ายเมืองไทยประกันชีวิต ครอบคลุมทั่วประเทศ</p>
      </header>

      <div className="hospital-stats-bar">
        <article><Icon name="hospital" size={22} /><span><strong>{networkStats.totalHospitals}+</strong> โรงพยาบาล</span></article>
        <article><Icon name="heart" size={22} /><span><strong>{networkStats.smileHospitals}</strong> MTL Smile</span></article>
        <article><Icon name="location" size={22} /><span><strong>{networkStats.provinces}+</strong> จังหวัด</span></article>
        <article><Icon name="shield" size={22} /><span><strong>Fax Claim</strong> ไม่สำรองจ่าย</span></article>
      </div>

      <section className="hospital-map-section">
        <div className="hospital-map__header">
          <div>
            <h2><Icon name="location" size={22} /> แผนที่โรงพยาบาลทั่วประเทศ</h2>
            <p>คลิกที่หมุดเพื่อดูรายละเอียด เบอร์โทร และลิงก์ Google Maps</p>
          </div>
          <button type="button" className="hospital-map__toggle" onClick={() => setShowMap(v => !v)}>
            <Icon name={showMap ? 'chevron' : 'chevron'} size={16} />
            {showMap ? 'ซ่อนแผนที่' : 'แสดงแผนที่'}
          </button>
        </div>
        {showMap && (
          <div className="hospital-map__legend">
            <span><span className="hospital-map__dot hospital-map__dot--smile" /> MTL Smile</span>
            <span><span className="hospital-map__dot hospital-map__dot--other" /> โรงพยาบาลอื่น ๆ</span>
            <span><span className="hospital-map__dot hospital-map__dot--clinic" /> คลินิก</span>
            <span><span className="hospital-map__dot hospital-map__dot--telemedicine" /> แพทย์ทางไกล</span>
            <span className="hospital-map__count"><Icon name="hospital" size={15} /> แสดง {filtered.length} แห่ง</span>
          </div>
        )}
        <HospitalMap hospitals={filtered} visible={showMap} />
      </section>

      <div className="hospitals-layout">
        <aside className="hospitals-sidebar">
          <div><h2>กรองโรงพยาบาล</h2><p>ค้นหาจากชื่อ ภาค หรือจังหวัด</p></div>
          <div className="hospitals-search"><Icon name="search" size={20} /><input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setVisibleCount(12) }} placeholder="ค้นหาชื่อโรงพยาบาล" aria-label="ค้นหาชื่อโรงพยาบาล" />{query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><Icon name="close" size={16} /></button>}</div>
          <label><span>ประเภทสถานพยาบาล</span><select value={network} onChange={(e) => { setNetwork(e.target.value as Hospital['network'] | 'all'); setVisibleCount(12) }}><option value="all">ทั้งหมด</option><option value="smile">MTL Smile Hospital Network</option><option value="other">โรงพยาบาลอื่น ๆ</option><option value="clinic">คลินิก</option><option value="telemedicine">บริการแพทย์ทางไกล</option></select></label>
          <label><span>ภาค</span><select value={region} onChange={(e) => { setRegion(e.target.value); setProvince(''); setVisibleCount(12) }}><option value="">ทุกภาค</option>{regions.map((r) => <option key={r} value={r}>{r}</option>)}</select></label>
          <label><span>จังหวัด</span><select value={province} onChange={(e) => { setProvince(e.target.value); setVisibleCount(12) }}><option value="">ทุกจังหวัด</option>{provinceList.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
          <button className="text-button" type="button" onClick={reset}>ล้างตัวกรอง</button>
        </aside>

        <section className="hospitals-results" aria-labelledby="hospitals-result-title">
          <div className="result-heading">
            <div><h2 id="hospitals-result-title">โรงพยาบาลคู่สัญญา</h2><p>แสดงผลจากรายการตัวอย่างในระบบ</p></div>
            <span>พบ {filtered.length} แห่ง</span>
          </div>

          {filtered.length > 0 ? (
            <>
              <div className="hospital-list">
                {filtered.slice(0, visibleCount).map((hospital) => (
                  <article key={hospital.name} className={`hospital-card hospital-card--${hospital.network}`}>
                    <div className="hospital-card__header">
                      <span className={`hospital-badge hospital-badge--${hospital.network}`}>{networkLabels[hospital.network]}</span>
                      {hospital.isGovernment && <span className="hospital-badge hospital-badge--gov">รัฐบาล</span>}
                    </div>
                    <h3>{hospital.name}</h3>
                    <p className="hospital-card__province"><Icon name="location" size={16} />{hospital.province} · {hospital.region}</p>
                    <p className="hospital-card__address">{hospital.address}</p>
                    <div className="hospital-card__services">
                      {hospital.services.map((s) => <span key={s}>{serviceLabels[s] ?? s}</span>)}
                    </div>
                    <div className="hospital-card__actions">
                      {hospital.phone && <a href={`tel:${hospital.phone}`} className="hospital-card__phone"><Icon name="phone" size={16} />{hospital.phone}</a>}
                    </div>
                  </article>
                ))}
              </div>
              {visibleCount < filtered.length && <button type="button" className="load-more" onClick={() => setVisibleCount((c) => c + 12)}>ดูเพิ่มอีก {Math.min(12, filtered.length - visibleCount)} แห่ง <Icon name="chevron" size={17} /></button>}
            </>
          ) : (
            <div className="empty-state"><Icon name="search" size={30} /><h3>ไม่พบโรงพยาบาลที่ตรงกับคำค้น</h3><p>ลองเปลี่ยนตัวกรอง หรือล้างคำค้นหา</p><button type="button" className="button button--secondary" onClick={reset}>ล้างตัวกรอง</button></div>
          )}

          <div className="hospital-source-note">
            <Icon name="shield" size={19} />
            <p>ข้อมูลโรงพยาบาลเป็นรายการตัวอย่างที่อ้างอิงจาก <a href="https://www.muangthai.co.th/th/hospital-list" target="_blank" rel="noreferrer">เว็บไซต์ทางการเมืองไทยประกันชีวิต <Icon name="external" size={14} /></a> กรุณาตรวจสอบข้อมูลล่าสุดจากแหล่งต้นทาง</p>
          </div>
        </section>
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="contact-page section-rail">
      <header className="contact-page__intro"><h1>คุยกับที่ปรึกษาได้ง่ายขึ้น</h1><p>ส่งข้อมูลให้เราติดต่อกลับ หรือเลือกคุยผ่าน LINE Official Account และโทรศัพท์ได้โดยตรง</p><div className="mock-data-note"><Icon name="shield" size={20} />ช่องทางติดต่อในเว็บไซต์ต้นแบบนี้เป็นข้อมูลจำลอง</div></header>
      <div className="contact-page__layout"><section><ContactForm /></section><aside><h2>ติดต่อโดยตรง</h2><p>เหมาะกับคำถามสั้น ๆ หรืออยากเริ่มคุยกับที่ปรึกษาทันที</p><ContactChannels /><div className="contact-hours"><strong>เวลาทำการ</strong><div className="contact-hours__row"><Icon name="chat" size={16} /><span>ทุกวัน — ทักแชทผ่าน Line OA ได้ตลอด 24 ชม.</span></div><div className="contact-hours__row"><Icon name="check" size={16} /><span>ทีมงานจะติดต่อกลับภายใน 24 ชม.</span></div></div></aside></div>
    </main>
  )
}

const aboutMilestones = [
  {
    number: '01',
    title: 'เริ่มจากการรับฟัง',
    copy: 'เราเริ่มต้นจากความตั้งใจเล็ก ๆ ที่อยากทำให้เรื่องประกันเข้าใจง่าย และตรงกับชีวิตจริงของแต่ละคน',
  },
  {
    number: '02',
    title: 'เติบโตเป็นทีม',
    copy: 'เมื่องานดูแลต้องละเอียดขึ้น เราจึงรวมคนที่ถนัดต่างกัน มาช่วยคิด ช่วยตรวจ และช่วยกันหาคำตอบที่รอบด้าน',
  },
  {
    number: '03',
    title: 'ดูแลอย่างต่อเนื่อง',
    copy: 'หน้าที่ของเราไม่จบเมื่อเลือกแผน แต่คือการอยู่ข้างคุณเมื่อมีคำถาม การเปลี่ยนแปลง หรือวันที่ต้องใช้ความคุ้มครอง',
  },
]

const teamMembers = [
  { id: '01', name: 'ไชยศักดิ์ พรก่ำศุภะไพศาล', role: 'ตัวแทนประกันชีวิต · เลขที่ 971905', image: assetUrl('/images/about/member-01.webp') },
  { id: '02', name: 'อภิชา ศรีภัทรจินดา', role: 'ตัวแทนประกันชีวิต · เลขที่ 167332', image: assetUrl('/images/about/member-02.webp') },
]

const awards = [
  { title: 'MDRT 2026', copy: 'Million Dollar Round Table สมาชิกลำดับที่ 43 ประชุม ณ Anaheim, California', image: assetUrl('/images/about/award-mdrt-2026.webp') },
  { title: 'MTL Life Member', copy: 'รางวัล Life Member จากเมืองไทยประกันชีวิต', image: assetUrl('/images/about/award-mtl-life-member.webp') },
  { title: 'NAA 2026', copy: 'ตัวแทนยอดเยี่ยมแห่งชาติ ครั้งที่ 26 ประจำปี 2569 จาก THAIFA', image: assetUrl('/images/about/award-naa-2026.webp') },
  { title: 'Master Trainer', copy: 'Certificate of Appreciation ในฐานะ Master Trainer', image: assetUrl('/images/about/award-master-trainer.webp') },
  { title: 'The Pride of Master Trainer', copy: 'รางวัลความภาคภูมิใจในฐานะ Master Trainer & The Coaches', image: assetUrl('/images/about/award-team-pride.webp') },
]

function AboutPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="about-page">
      <section className="about-hero section-rail" aria-labelledby="about-title">
        <div className="about-hero__copy">
          <h1 id="about-title">เพราะการดูแลที่ดี เริ่มจากทีมที่<span>เข้าใจคุณ</span></h1>
          <p>เราเชื่อว่าเรื่องประกันไม่ควรเป็นเรื่องยาก ทีมของเราจึงทำงานร่วมกันเพื่อฟังให้ลึก อธิบายให้ชัด และช่วยคุณวางแผนได้อย่างสบายใจ</p>
          <Link to="/contact" navigate={navigate} className="button button--primary button--large">พูดคุยกับทีมเรา <Icon name="arrow" size={20} /></Link>
        </div>
        <figure className="about-hero__media">
          <OptimizedImage src={assetUrl('/images/about/team-portrait.webp')} alt="ผลงานและกิจกรรมของทีมที่ปรึกษา รางวัล ความสำเร็จ และการทำงานร่วมกัน" width={1536} height={1024} priority sizes="(max-width: 760px) 100vw, 52vw" />
        </figure>
      </section>

      <section className="about-story" aria-labelledby="story-title">
        <div className="about-story__inner section-rail">
          <header>
            <h2 id="story-title">จากวันแรก<br />ถึงวันนี้</h2>
            <p>เรื่องราวของเราเกิดจากความตั้งใจที่จะทำให้ทุกการตัดสินใจเรื่องความคุ้มครองมีข้อมูลและคนคอยดูแลอยู่ข้าง ๆ</p>
          </header>
          <ol>
            {aboutMilestones.map((item) => (
              <li key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-collaboration section-rail" aria-labelledby="collaboration-title">
        <div className="about-collaboration__intro">
          <h2 id="collaboration-title">เราไม่ได้ทำงาน<br />คนเดียว</h2>
          <p>เบื้องหลังคำแนะนำทุกครั้ง คือทีมที่ช่วยกันมองรายละเอียดจากหลายมุม เพื่อให้สิ่งที่ส่งถึงคุณชัดเจนและเหมาะกับชีวิตจริงมากที่สุด</p>
          <div className="about-principles">
            <article><span>01</span><div><h3>ฟังอย่างเข้าใจ</h3><p>เริ่มจากชีวิตและสิ่งที่คุณกังวลจริง ๆ</p></div></article>
            <article><span>02</span><div><h3>คิดอย่างรอบด้าน</h3><p>ช่วยกันตรวจรายละเอียดก่อนนำเสนอทุกครั้ง</p></div></article>
            <article><span>03</span><div><h3>ดูแลต่อเนื่อง</h3><p>พร้อมตอบคำถามทั้งก่อนและหลังตัดสินใจ</p></div></article>
          </div>
        </div>
        <figure className="about-collaboration__media">
          <OptimizedImage src={assetUrl('/images/about/team-working.webp')} alt="บรรยากาศการทำงานของทีม รางวัลความสำเร็จ และพลังของการดูแลร่วมกัน" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 50vw" />
        </figure>
      </section>

      <section className="about-team section-rail" aria-labelledby="team-title">
        <div className="about-section-heading">
          <div><h2 id="team-title">ทีมของเรา</h2><p>คนที่พร้อมช่วยดูแลและทำเรื่องซับซ้อนให้เข้าใจง่ายขึ้น</p></div>
        </div>
        <div className="about-team__list">
          {teamMembers.map((member) => (
            <article key={member.id}>
              <div className="about-team__portrait"><OptimizedImage src={member.image} alt={`ภาพคุณ${member.name}`} width={1122} height={1402} sizes="(max-width: 760px) 45vw, 22vw" /><span>{member.id}</span></div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-recognition" aria-labelledby="recognition-title">
        <div className="about-recognition__inner section-rail">
          <header>
            <div><h2 id="recognition-title">รางวัลและ<br />ความภาคภูมิใจ</h2><p>รวบรวมรางวัล เกียรติบัตร และความสำเร็จของทีม ที่สะท้อนความมุ่งมั่นในการพัฒนาวิชาชีพอย่างต่อเนื่อง</p></div>
          </header>
          <div className="about-recognition__feature">
            <figure><img src={assetUrl('/images/about/award-mdrt-2026.webp')} alt="รางวัล MDRT 2026 คุณไชยศักดิ์ พรก่ำศุภะไพศาล MTLP 52 สมาชิกลำดับที่ 43" width={1134} height={1134} loading="lazy" decoding="async" /></figure>
            <div className="about-recognition__copy"><span>ความน่าเชื่อถือที่มองเห็นได้</span><h3>ทุกความสำเร็จ<br />มีความไว้วางใจอยู่เบื้องหลัง</h3><p>รางวัลและเกียรติบัตรเหล่านี้สะท้อนถึงความตั้งใจในการพัฒนาความรู้ มาตรฐานการทำงาน และการดูแลลูกค้าอย่างสม่ำเสมอ</p></div>
          </div>
          <div className="award-gallery">
            {awards.map((award) => (
              <article key={award.title}>
                <div className="award-gallery__image"><img src={award.image} alt={award.title} width={1477} height={1108} loading="lazy" decoding="async" /></div>
                <h3>{award.title}</h3>
                <p>{award.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact section-rail" aria-labelledby="about-contact-title">
        <div><h2 id="about-contact-title">ให้เราดูแลเรื่องประกัน<br />เพื่อให้คุณได้ใช้ชีวิตในแบบที่ตั้งใจ</h2><p>เริ่มจากคำถามสั้น ๆ แล้วค่อยวางแผนไปด้วยกัน</p></div>
        <Link to="/contact" navigate={navigate} className="button button--primary button--large">พูดคุยกับทีมเรา <Icon name="arrow" size={20} /></Link>
      </section>
    </main>
  )
}

function NotFound({ navigate }: { navigate: Navigate }) {
  return <main className="not-found section-rail"><span>404</span><h1>ไม่พบหน้าที่คุณกำลังมองหา</h1><p>ลิงก์นี้อาจถูกย้าย หรือชื่อแผนไม่ถูกต้อง</p><Link to="/plans" navigate={navigate} className="button button--primary">กลับไปดูแผนทั้งหมด <Icon name="arrow" size={19} /></Link></main>
}

function Footer({ navigate }: { navigate: Navigate }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner section-rail">
        <div className="footer-brand"><img className="footer-brand__logo" src={assetUrl('/images/logo-planner52.webp')} alt="MTL Planner 52" width="1254" height="1254" /><p>ชีวิตที่ออกแบบได้<br /><small>ตัวแทนประกันชีวิต บมจ.เมืองไทยประกันชีวิต</small></p></div>
        <nav aria-label="ลิงก์ท้ายหน้า"><Link to="/" navigate={navigate}>หน้าแรก</Link><Link to="/plans" navigate={navigate}>แผนประกัน</Link><Link to="/hospitals" navigate={navigate}>โรงพยาบาล</Link><Link to="/articles" navigate={navigate}>บทความ</Link><Link to="/about" navigate={navigate}>เกี่ยวกับเรา</Link><Link to="/contact" navigate={navigate}>ติดต่อเรา</Link><a href="https://www.muangthai.co.th/" target="_blank" rel="noreferrer">เว็บไซต์ทางการ</a></nav>
      </div>
      <div className="site-footer__legal section-rail"><p>ดำเนินงานโดยตัวแทนประกันชีวิต บมจ.เมืองไทยประกันชีวิต ข้อมูลและโบรชัวร์อ้างอิงจากบริษัทโดยตรง ผลประโยชน์และความคุ้มครองเป็นไปตามเงื่อนไขกรมธรรม์</p><span>รวมแผนประกัน {DISPLAYED_CARD_COUNT} แบบ</span></div>
    </footer>
  )
}

function App({ initialLocation = '/' }: { initialLocation?: string }) {
  const { location, navigate } = useLocation(initialLocation)
  const url = new URL(location, 'https://local.invalid')
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const currentArticle = path.startsWith('/articles/') ? getArticleBySlug(decodeURIComponent(path.slice('/articles/'.length))) : undefined
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareNotice, setCompareNotice] = useState('')

  const selectedProducts = useMemo(() => selectedIds.map((id) => getProductById(id)).filter((product): product is CatalogProduct => Boolean(product)), [selectedIds])

  const toggleCompare = useCallback((product: CatalogProduct) => {
    setSelectedIds((current) => {
      if (current.includes(product.id)) return current.filter((id) => id !== product.id)
      if (current.length >= 3) {
        setCompareNotice('เลือกเปรียบเทียบได้สูงสุด 3 แผน')
        window.setTimeout(() => setCompareNotice(''), 2600)
        return current
      }
      return [...current, product.id]
    })
  }, [])

  useEffect(() => {
    applySeoData(getSeoData(location, window.location.origin))
  }, [location])

  let page: ReactNode
  if (path === '/') page = <HomePage navigate={navigate} />
  else if (path === '/plans') page = <FinderPage key={location} navigate={navigate} selectedIds={selectedIds} onCompare={toggleCompare} search={url.search} />
  else if (path === '/articles') page = <ArticlesPage navigate={navigate} />
  else if (path.startsWith('/articles/')) page = currentArticle ? <ArticleDetailPage key={currentArticle.slug} article={currentArticle} navigate={navigate} /> : <NotFound navigate={navigate} />
  else if (path === '/hospitals') page = <HospitalsPage />
  else if (path === '/about') page = <AboutPage navigate={navigate} />
  else if (path === '/contact') page = <ContactPage />
  else if (path.startsWith('/plans/')) {
    const product = productFromSlug(decodeURIComponent(path.slice('/plans/'.length)))
    page = product ? <ProductPage key={product.id} product={product} navigate={navigate} selected={selectedIds.includes(product.id)} onCompare={toggleCompare} /> : <NotFound navigate={navigate} />
  } else page = <NotFound navigate={navigate} />

  return (
    <div className={selectedProducts.length ? 'has-compare-dock' : ''}>
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <Header path={path} onNavigate={navigate} />
      <div id="main-content">{page}</div>
      <Footer navigate={navigate} />
      {selectedProducts.length > 0 && (
        <Suspense fallback={null}>
          <ComparePanel products={selectedProducts} open={compareOpen} notice={compareNotice} onOpen={() => setCompareOpen(true)} onClose={() => setCompareOpen(false)} onRemove={toggleCompare} onClear={() => { setSelectedIds([]); setCompareOpen(false) }} />
        </Suspense>
      )}
    </div>
  )
}

export default App
