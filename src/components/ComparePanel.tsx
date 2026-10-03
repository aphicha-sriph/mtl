import { useEffect, useRef } from 'react'

import { routeUrl } from '../basePath'
import type { CatalogProduct } from '../data/catalog'
import { useDialogFocus } from '../hooks/useDialogFocus'

import { Icon } from './Icons'

interface ComparePanelProps {
  products: readonly CatalogProduct[]
  open: boolean
  notice: string
  onOpen: () => void
  onClose: () => void
  onRemove: (product: CatalogProduct) => void
  onClear: () => void
}

export function ComparePanel({
  products,
  open,
  notice,
  onOpen,
  onClose,
  onRemove,
  onClear,
}: ComparePanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLElement>(null)
  const canCompare = products.length >= 2

  useEffect(() => {
    if (open && !canCompare) onClose()
  }, [canCompare, open, onClose])

  useDialogFocus({
    active: open && canCompare,
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    onClose,
  })

  if (products.length === 0) return null

  const comparisonRows: Array<{
    label: string
    value: (product: CatalogProduct) => string
    tone?: 'caution'
  }> = [
    { label: 'หมวด', value: (product) => product.categoryLabel },
    { label: 'รูปแบบ', value: (product) => product.productKindLabel },
    { label: 'อายุรับ', value: (product) => product.entryAge },
    { label: 'ระยะจ่าย', value: (product) => product.premiumTerm ?? 'ดูตามแผนหรือสัญญาหลัก' },
    { label: 'ระยะคุ้มครอง', value: (product) => product.coverageTerm ?? 'ดูตามเงื่อนไข' },
    ...(products.some((product) => product.groupSize)
      ? [{ label: 'ขนาดกลุ่ม', value: (product: CatalogProduct) => product.groupSize ?? 'ไม่ระบุ' }]
      : []),
    { label: 'จุดเด่น', value: (product) => product.helperText },
    { label: 'เหมาะกับ', value: (product) => product.suitability },
    { label: 'ข้อควรพิจารณา', value: (product) => product.caveat, tone: 'caution' },
  ]

  return (
    <>
      <aside className="compare-dock" aria-label="รายการแผนที่เลือกเปรียบเทียบ">
        <div className="compare-dock__count">
          <Icon name="compare" size={22} />
          <strong>เปรียบเทียบแผน</strong>
          <span>{products.length}/3</span>
        </div>

        <div className="compare-dock__plans">
          {products.map((product) => (
            <div key={product.id} className="compare-chip">
              <span>{product.name}</span>
              <button
                type="button"
                aria-label={`นำ ${product.name} ออกจากรายการเปรียบเทียบ`}
                onClick={() => onRemove(product)}
              >
                <Icon name="close" size={15} />
              </button>
            </div>
          ))}
          {products.length < 3 && (
            <a className="compare-dock__empty" href={routeUrl('/plans')}>
              <Icon name="plus" size={17} />
              เพิ่มแผน
            </a>
          )}
        </div>

        <button
          type="button"
          className="button button--primary compare-dock__button"
          onClick={onOpen}
          disabled={!canCompare}
          aria-label={canCompare ? `เปรียบเทียบ ${products.length} แผนตอนนี้` : 'ยังเปรียบเทียบไม่ได้ เลือกเพิ่มอีก 1 แผน'}
        >
          {canCompare ? 'เปรียบเทียบตอนนี้' : 'เลือกอีก 1 แผน'}
          <Icon name={canCompare ? 'arrow' : 'plus'} size={19} />
        </button>
        {notice && <span className="compare-notice" role="status">{notice}</span>}
      </aside>

      {open && canCompare && (
        <div className="compare-overlay" role="presentation" onPointerDown={(event) => {
          if (event.currentTarget === event.target) onClose()
        }}>
          <section
            ref={modalRef}
            className="compare-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-title"
            tabIndex={-1}
          >
            <div className="compare-modal__header">
              <div>
                <p>{products.length} จาก 3 แผน</p>
                <h2 id="compare-title">เห็นข้อเหมือนและข้อแลกเปลี่ยนในมุมเดียว</h2>
              </div>
              <div className="compare-modal__header-actions">
                <button type="button" className="text-button" onClick={onClear}>ล้างทั้งหมด</button>
                <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="ปิดตารางเปรียบเทียบ">
                  <Icon name="close" size={23} />
                </button>
              </div>
            </div>

            <div className="compare-table-wrap">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th scope="col">หัวข้อ</th>
                    {products.map((product) => (
                      <th key={product.id} scope="col">
                        <span>{product.categoryLabel}</span>
                        <strong>{product.name}</strong>
                        <button type="button" onClick={() => onRemove(product)}>
                          นำออก
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className={row.tone === 'caution' ? 'is-caution' : ''}>
                      <th scope="row">{row.label}</th>
                      {products.map((product) => <td key={product.id}>{row.value(product)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="compare-mobile-list">
              {products.map((product) => (
                <article key={product.id}>
                  <header>
                    <div>
                      <span>{product.categoryLabel}</span>
                      <h3>{product.name}</h3>
                    </div>
                    <button type="button" onClick={() => onRemove(product)}>
                      นำออก
                    </button>
                  </header>
                  <dl>
                    {comparisonRows.map((row) => (
                      <div key={row.label} className={row.tone === 'caution' ? 'is-caution' : ''}>
                        <dt>{row.label}</dt>
                        <dd>{row.value(product)}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>

            <div className="compare-modal__footer">
              <p>
                ตารางนี้ใช้คัดกรองเบื้องต้น ไม่แทนใบเสนอขาย ตารางผลประโยชน์ หรือเงื่อนไขกรมธรรม์ฉบับล่าสุด
              </p>
              <button type="button" className="button button--secondary" onClick={onClose}>
                กลับไปเลือกแผน
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
