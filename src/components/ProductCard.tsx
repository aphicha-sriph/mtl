import { useState } from 'react'

import type { CatalogProduct } from '../data/catalog'
import { getProductHighlight } from '../data/productHighlights'
import { getProductTaxBenefit } from '../data/taxBenefits'

import { Icon } from './Icons'
import { OptimizedImage } from './OptimizedImage'

interface ProductCardProps {
  product: CatalogProduct
  selected: boolean
  onOpen: (product: CatalogProduct) => void
  onCompare: (product: CatalogProduct) => void
}

export function ProductCard({ product, selected, onOpen, onCompare }: ProductCardProps) {
  const highlight = getProductHighlight(product)
  const taxBenefit = getProductTaxBenefit(product)
  const [selectedOption, setSelectedOption] = useState(
    highlight.options[highlight.options.length - 1],
  )
  const facts = [
    { label: 'อายุรับ', value: product.entryAge },
    {
      label: product.groupSize ? 'ขนาดกลุ่ม' : 'คุ้มครองถึง',
      value: product.groupSize ?? product.coverageTerm ?? 'ดูตามสัญญาหลัก',
    },
  ]

  return (
    <article className={`product-card ${selected ? 'is-selected' : ''}`}>
      <div className="product-card__media" onClick={() => onOpen(product)} style={{ cursor: 'pointer' }}>
        <OptimizedImage src={product.imagePath} alt={product.name} sizes="(max-width: 760px) 100vw, 30vw" />
        {product.brochurePath && (
          <a
            className="product-card__document"
            href={product.brochurePath}
            target="_blank"
            rel="noreferrer"
            aria-label={`เปิดเอกสาร PDF ${product.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="download" size={17} />
            {product.brochureKind === 'local_summary' ? 'สรุป PDF' : 'โบรชัวร์ PDF'}
          </a>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__kind">{product.productKindLabel}</p>
        <h3 onClick={() => onOpen(product)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        <p className="product-card__summary">{product.helperText}</p>

        <div className={`product-card__tax product-card__tax--${taxBenefit.status}`}>
          <span className="product-card__tax-icon"><Icon name="savings" size={18} /></span>
          <span>
            <small>{taxBenefit.title}</small>
            <strong>{taxBenefit.value}</strong>
          </span>
        </div>

        <div className="product-card__highlight">
          <span className="product-card__highlight-label">{highlight.label}</span>
          <div
            className={`plan-selector ${highlight.options.length === 1 ? 'plan-selector--single' : ''}`}
            role={highlight.options.length > 1 ? 'group' : undefined}
            aria-label={highlight.options.length > 1 ? `${highlight.label} ${product.name}` : undefined}
          >
            <div className="plan-selector__options">
              {highlight.options.map((option) =>
                highlight.options.length > 1 ? (
                  <button
                    key={option}
                    type="button"
                    className={`${selectedOption === option ? 'is-active' : ''} ${option.length > 7 ? 'is-long' : ''}`.trim()}
                    onClick={() => setSelectedOption(option)}
                    aria-pressed={selectedOption === option}
                  >
                    {option}
                  </button>
                ) : (
                  <strong key={option}>{option}</strong>
                ),
              )}
            </div>
            {highlight.unit && <span className="plan-selector__unit">{highlight.unit}</span>}
          </div>
        </div>

        <dl className="product-card__facts">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="product-card__actions">
          <button type="button" className="button button--secondary" onClick={() => onOpen(product)}>
            ดูรายละเอียด
            <Icon name="arrow" size={18} />
          </button>
          <button
            type="button"
            className={`button button--compare ${selected ? 'is-selected' : ''}`}
            onClick={() => onCompare(product)}
            aria-pressed={selected}
            aria-label={`${selected ? 'นำออกจาก' : 'เพิ่มเข้า'}รายการเปรียบเทียบ ${product.name}`}
          >
            <span className="compare-box" aria-hidden="true">
              {selected && <Icon name="check" size={15} />}
            </span>
            {selected ? 'เลือกแล้ว' : 'เปรียบเทียบ'}
          </button>
        </div>
      </div>
    </article>
  )
}
