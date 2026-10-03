import type { DetailedProductContent as DetailedProductContentData } from '../data/productDetails'

import { Icon } from './Icons'

export type DetailedProductSection = 'overview' | 'coverage' | 'conditions' | 'faq'

interface DetailedProductContentProps {
  content: DetailedProductContentData
  section: DetailedProductSection
}

function SourceNote({ content }: { content: DetailedProductContentData }) {
  return (
    <p className="official-source-note">
      <Icon name="shield" size={17} />
      เรียบเรียงให้อ่านง่ายจาก
      <a href={content.sourceUrl} target="_blank" rel="noreferrer">
        {content.sourceLabel}
        <Icon name="external" size={14} />
      </a>
      โดยคงตัวเลขและเงื่อนไขสำคัญจากต้นทาง
    </p>
  )
}

function BrochureCta({ content, variant }: { content: DetailedProductContentData; variant: 'overview' | 'tab' }) {
  if (!content.brochurePath) return null
  const kindLabel = content.brochureKind === 'product_info' ? 'เอกสารข้อมูลแผน' : content.brochureKind === 'local_summary' ? 'สรุปแผนประกัน' : 'โบรชัวร์'
  return (
    <div className={`brochure-cta ${variant === 'overview' ? 'brochure-cta--hero' : ''}`}>
      <div className="brochure-cta__icon"><Icon name="download" size={variant === 'overview' ? 28 : 22} /></div>
      <div className="brochure-cta__copy">
        <strong>{variant === 'overview' ? `ดาวน์โหลด${kindLabel}ฉบับเต็ม` : `อ่านรายละเอียดเพิ่มเติมใน${kindLabel}`}</strong>
        <p>{variant === 'overview'
          ? 'ดูตัวอย่างเบี้ย ตารางผลประโยชน์ เงื่อนไขครบถ้วน และข้อยกเว้นทั้งหมดในเอกสาร PDF'
          : 'เอกสารมีรายละเอียดที่ครบถ้วนกว่า รวมถึงตัวอย่างเบี้ยและตารางผลประโยชน์'}</p>
      </div>
      <a className="brochure-cta__button" href={content.brochurePath} target="_blank" rel="noreferrer">
        <Icon name="download" size={17} /> ดาวน์โหลด PDF
      </a>
    </div>
  )
}

function Overview({ content }: { content: DetailedProductContentData }) {
  return (
    <>
      <h2>จุดเด่นและข้อมูลพื้นฐาน</h2>
      <p className="detail-body-copy">{content.intro}</p>

      <div className="detail-key-info">
        <article className="detail-key-info__card detail-key-info__card--suitable">
          <div className="detail-key-info__header">
            <span><Icon name="family" size={20} /></span>
            <h3>เหมาะกับใคร</h3>
          </div>
          <p>{content.suitability}</p>
        </article>
        <article className="detail-key-info__card detail-key-info__card--caveat">
          <div className="detail-key-info__header">
            <span><Icon name="spark" size={20} /></span>
            <h3>ข้อควรรู้ก่อนสมัคร</h3>
          </div>
          <p>{content.caveat}</p>
        </article>
      </div>

      <div className="product-highlights" aria-label="จุดเด่นของแผน">
        {content.highlights.map((highlight, index) => (
          <article key={highlight.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>
          </article>
        ))}
      </div>

      <h3 className="detail-subheading">ข้อมูลแบบประกัน</h3>
      <dl className="plan-facts-list">
        {content.planFacts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value.map((value) => <span key={value}>{value}</span>)}</dd>
          </div>
        ))}
      </dl>

      <BrochureCta content={content} variant="overview" />
      <SourceNote content={content} />
    </>
  )
}

function Coverage({ content }: { content: DetailedProductContentData }) {
  return (
    <>
      <h2>{content.coverageHeading}</h2>
      <p className="detail-body-copy">{content.coverageIntro}</p>

      <div className="benefit-timeline">
        {content.benefitPeriods.map((period, periodIndex) => (
          <article key={period.period}>
            <div className="benefit-timeline__period">
              <span>{periodIndex + 1}</span>
              <h3>{period.period}</h3>
            </div>
            <div className="benefit-timeline__items">
              {period.items.map((item) => (
                <div key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <details className="detail-accordion detail-accordion--notes" open>
        <summary>
          <span><Icon name="spark" size={20} /> หมายเหตุสำคัญ</span>
          <Icon name="chevron" size={19} className="detail-accordion__chevron" />
        </summary>
        <ol>
          {content.notes.map((note) => <li key={note}>{note}</li>)}
        </ol>
      </details>

      <BrochureCta content={content} variant="tab" />
      <SourceNote content={content} />
    </>
  )
}

function Conditions({ content }: { content: DetailedProductContentData }) {
  return (
    <>
      <h2>เงื่อนไขและกรณีที่ไม่คุ้มครอง</h2>
      <p className="detail-body-copy">ส่วนนี้มีผลต่อสิทธิรับผลประโยชน์ ควรอ่านก่อนสมัครและตรวจเอกสารกรมธรรม์ฉบับจริงอีกครั้ง</p>

      <div className="condition-accordions">
        <details className="detail-accordion" open>
          <summary>
            <span><Icon name="shield" size={20} /> ความสมบูรณ์ของสัญญา</span>
            <Icon name="chevron" size={19} className="detail-accordion__chevron" />
          </summary>
          <p>{content.contractValidity ?? 'หน้านี้ยังไม่แสดงข้อความความสมบูรณ์ของสัญญาแบบเต็ม เพื่อไม่ให้ข้อกำหนดทางกฎหมายคลาดเคลื่อน โปรดตรวจกรมธรรม์ฉบับที่บริษัทออกให้จริง'}</p>
        </details>
        <details className="detail-accordion detail-accordion--danger" open>
          <summary>
            <span><Icon name="close" size={20} /> กรณีที่บริษัทจะไม่คุ้มครอง</span>
            <Icon name="chevron" size={19} className="detail-accordion__chevron" />
          </summary>
          {content.exclusions.length > 0
            ? <ol>{content.exclusions.map((exclusion) => <li key={exclusion}>{exclusion}</li>)}</ol>
            : <p>หน้านี้ยังไม่แสดงรายการข้อยกเว้นรายผลิตภัณฑ์แบบเต็ม และจะไม่นำข้อยกเว้นทั่วไปของผลิตภัณฑ์อื่นมาใส่แทน โปรดตรวจกรมธรรม์ฉบับจริงก่อนสมัคร</p>}
        </details>
        <details className="detail-accordion detail-accordion--warning" open>
          <summary>
            <span><Icon name="spark" size={20} /> คำเตือน</span>
            <Icon name="chevron" size={19} className="detail-accordion__chevron" />
          </summary>
          <p>{content.warning ?? 'ผู้ซื้อควรอ่านใบเสนอขาย ตารางผลประโยชน์ ข้อยกเว้น และกรมธรรม์ฉบับล่าสุดให้ครบถ้วนก่อนตัดสินใจ'}</p>
        </details>
      </div>

      <BrochureCta content={content} variant="tab" />
      <SourceNote content={content} />
    </>
  )
}

function Faq({ content }: { content: DetailedProductContentData }) {
  return (
    <>
      <h2>คำถามที่พบบ่อย</h2>
      <p className="detail-body-copy">คำถาม–คำตอบส่วนนี้เรียบเรียงจากข้อเท็จจริงในข้อมูลผลิตภัณฑ์ทางการ เพื่อให้อ่านง่ายขึ้น ไม่ใช่ FAQ ที่คัดจากบริษัทโดยตรง</p>

      <div className="faq-list">
        {content.faqs.map((faq, index) => (
          <details key={faq.question} className="faq-item" open={index === 0}>
            <summary>
              <span>{faq.question}</span>
              <Icon name="plus" size={20} />
            </summary>
            <div>
              {faq.answer.map((answer) => <p key={answer}>{answer}</p>)}
            </div>
          </details>
        ))}
      </div>

      <BrochureCta content={content} variant="tab" />
      <SourceNote content={content} />
    </>
  )
}

export function DetailedProductContent({ content, section }: DetailedProductContentProps) {
  if (section === 'overview') return <Overview content={content} />
  if (section === 'coverage') return <Coverage content={content} />
  if (section === 'conditions') return <Conditions content={content} />
  return <Faq content={content} />
}
