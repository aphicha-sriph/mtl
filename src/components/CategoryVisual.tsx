import type { ProductCategory } from '../data/catalog'
import { assetUrl } from '../basePath'
import { OptimizedImage } from './OptimizedImage'

const categoryImages: Record<ProductCategory, string> = {
  whole_life: '/images/hero-family.webp',
  health: '/images/health-doctor.webp',
  critical_illness: '/images/critical-illness-consultation.webp',
  retirement: '/images/retirement-couple.webp',
  savings_and_index_linked: '/images/advisor-planning.webp',
  personal_accident: '/images/accident-traveler.webp',
  unit_linked: '/images/advisor-planning.webp',
  universal_life: '/images/advisor-planning.webp',
  group: '/images/advisor-planning.webp',
  takaful: '/images/takaful-family.webp',
}

const categoryImagePositions: Record<ProductCategory, string> = {
  whole_life: '58% 48%',
  health: '46% 32%',
  critical_illness: '42% 36%',
  retirement: '64% 40%',
  savings_and_index_linked: '35% 44%',
  personal_accident: '35% 46%',
  unit_linked: '29% 44%',
  universal_life: '42% 44%',
  group: '27% 44%',
  takaful: '54% 45%',
}

interface CategoryVisualProps {
  category: ProductCategory
  label: string
  image?: string
  imageAlt?: string
  index?: number
  priority?: boolean
  className?: string
  descriptive?: boolean
}

export function CategoryVisual({
  category,
  label,
  image,
  imageAlt,
  index,
  priority = false,
  className = '',
  descriptive = false,
}: CategoryVisualProps) {
  return (
    <div className={`category-visual category-visual--${category} ${className}`.trim()}>
      <OptimizedImage
        src={image ?? assetUrl(categoryImages[category])}
        alt={descriptive ? `ภาพประกอบ${imageAlt ?? label}` : ''}
        priority={priority}
        sizes="(max-width: 760px) 100vw, 50vw"
        style={{ objectPosition: image ? '50% 50%' : categoryImagePositions[category] }}
      />
      <span className="category-visual__wash" aria-hidden="true" />
      <span className="category-visual__arc" aria-hidden="true" />
      {typeof index === 'number' && (
        <span className="category-visual__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <span className="category-visual__label">{label}</span>
    </div>
  )
}
