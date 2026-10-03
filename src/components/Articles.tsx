import { useMemo, useState, type MouseEvent } from 'react'

import { assetUrl, routeUrl } from '../basePath'
import { articleCategories, articles, type Article, type ArticleCategory } from '../data/articles'
import { productImagePathsByName } from '../data/catalog'
import { Icon } from './Icons'
import { OptimizedImage } from './OptimizedImage'

type Navigate = (to: string) => void
type ArticleFilter = ArticleCategory | 'all'

function ArticleLink({ article, navigate, className, children }: {
  article: Article
  navigate: Navigate
  className?: string
  children: React.ReactNode
}) {
  const href = `/articles/${article.slug}`
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigate(href)
  }

  return <a href={routeUrl(href)} className={className} onClick={follow}>{children}</a>
}

function ArticleMeta({ article, showCategory = true }: { article: Article; showCategory?: boolean }) {
  return (
    <div className="article-meta">
      {showCategory && <span className="article-meta__cat">{article.categoryLabel}</span>}
      <time dateTime={article.publishedAt}>{article.displayDate}</time>
      <span>{article.readingTime}</span>
    </div>
  )
}

function ArticleCard({ article, navigate }: { article: Article; navigate: Navigate }) {
  return (
    <article className="article-card">
      <ArticleLink article={article} navigate={navigate} className="article-card__media">
        <OptimizedImage src={article.image} alt={article.imageAlt} width={1536} height={1024} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <span className="article-card__chip">{article.categoryLabel}</span>
      </ArticleLink>
      <div className="article-card__body">
        <ArticleMeta article={article} showCategory={false} />
        <h3><ArticleLink article={article} navigate={navigate}>{article.title}</ArticleLink></h3>
        <p>{article.description}</p>
        <ArticleLink article={article} navigate={navigate} className="article-read-link">อ่านบทความ <Icon name="arrow" size={16} /></ArticleLink>
      </div>
    </article>
  )
}

export function ArticlesPage({ navigate }: { navigate: Navigate }) {
  const [category, setCategory] = useState<ArticleFilter>('all')
  const [query, setQuery] = useState('')
  const featured = articles[0]

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('th')
    const isBrowsingAll = category === 'all' && !normalizedQuery
    return articles.filter((article) => {
      if (isBrowsingAll && article.slug === featured.slug) return false
      const matchesCategory = category === 'all' || article.category === category
      const haystack = [article.title, article.description, article.categoryLabel, ...article.keywords].join(' ').toLocaleLowerCase('th')
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
    })
  }, [category, query, featured.slug])

  return (
    <main className="articles-page">
      <section className="articles-hero section-rail" aria-labelledby="articles-title">
        <div className="articles-hero__copy">
          <span className="articles-hero__eyebrow">คลังความรู้ MTL</span>
          <h1 id="articles-title">วางแผนวันนี้ เพื่อทุกวัน<em>ข้างหน้า</em></h1>
          <p>เรื่องการเงิน สุขภาพ ครอบครัว และเกษียณที่อธิบายให้เข้าใจง่าย เพื่อให้ทุกการตัดสินใจเริ่มจากข้อมูลที่ชัดเจน</p>
        </div>
      </section>

      <section className="articles-featured section-rail" aria-labelledby="featured-article-title">
        <ArticleLink article={featured} navigate={navigate} className="articles-featured__card">
          <div className="articles-featured__media">
            <OptimizedImage src={featured.image} alt={featured.imageAlt} width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 55vw" />
            <span className="articles-featured__badge">บทความแนะนำ</span>
          </div>
          <div className="articles-featured__body">
            <ArticleMeta article={featured} />
            <h2 id="featured-article-title">{featured.title}</h2>
            <p>{featured.lead}</p>
            <span className="article-read-link article-read-link--large">อ่านบทความ <Icon name="arrow" size={20} /></span>
          </div>
        </ArticleLink>
      </section>

      <section id="latest" className="articles-archive section-rail" aria-labelledby="latest-title">
        <header className="articles-archive__heading">
          <div className="articles-archive__title">
            <h2 id="latest-title">บทความทั้งหมด</h2>
            <p>เลือกเรื่องที่ตรงกับช่วงชีวิตของคุณ แล้วค่อยวางแผนทีละเรื่อง</p>
          </div>
          <label className="article-search">
            <Icon name="search" size={18} />
            <span className="visually-hidden">ค้นหาบทความ</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาบทความที่คุณสนใจ" />
          </label>
        </header>

        <div className="article-toolbar">
          <div className="article-filters" aria-label="กรองบทความตามหมวดหมู่" role="group">
            {articleCategories.map((item) => (
              <button
                key={item.value}
                type="button"
                className={category === item.value ? 'is-active' : ''}
                aria-pressed={category === item.value}
                onClick={() => setCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="article-results__count" aria-live="polite">พบ {filteredArticles.length} บทความ</div>
        </div>

        <div className="article-results">
          {filteredArticles.length > 0 ? (
            <div className="article-grid">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="articles-empty">
              <Icon name="search" size={28} />
              <h3>ยังไม่พบบทความที่ตรงกัน</h3>
              <p>ลองเปลี่ยนคำค้นหรือเลือกดูทุกหมวดหมู่</p>
              <button type="button" className="button button--secondary" onClick={() => { setCategory('all'); setQuery('') }}>ล้างตัวกรอง</button>
            </div>
          )}
        </div>
      </section>

      <section className="articles-closing section-rail">
        <div>
          <h2>อ่านแล้ว อยากวางแผนให้เข้ากับชีวิตจริงของคุณ?</h2>
          <p>เริ่มจากข้อมูลสั้น ๆ แล้วคุยกับที่ปรึกษาเพื่อเห็นทางเลือก ข้อดี และสิ่งที่ต้องตรวจสอบก่อนตัดสินใจ</p>
        </div>
        <a href={routeUrl('/contact')} className="button button--primary button--large" onClick={(event) => { event.preventDefault(); navigate('/contact') }}>คุยกับที่ปรึกษา <Icon name="arrow" size={20} /></a>
      </section>
    </main>
  )
}

export function ArticleDetailPage({ article, navigate }: { article: Article; navigate: Navigate }) {
  const [copied, setCopied] = useState(false)
  const related = articles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3)

  const share = async () => {
    const shareData = { title: article.title, text: article.description, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2200)
      }
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="article-detail">
      <div className="article-detail__top">
        <nav className="article-breadcrumbs" aria-label="เส้นทางนำทาง">
          <a href={routeUrl('/articles')} onClick={(event) => { event.preventDefault(); navigate('/articles') }}>บทความ</a>
          <Icon name="chevron" size={15} />
          <span>{article.categoryLabel}</span>
        </nav>

        <header className="article-detail__header">
          <ArticleMeta article={article} />
          <h1>{article.title}</h1>
          <p>{article.lead}</p>
          <button type="button" className="article-share" onClick={share}>
            <Icon name={copied ? 'check' : 'external'} size={18} />
            {copied ? 'คัดลอกลิงก์แล้ว' : 'แชร์บทความ'}
          </button>
        </header>

        <figure className="article-detail__hero">
          <OptimizedImage src={article.image} alt={article.imageAlt} width={1536} height={1024} priority sizes="(max-width: 760px) 100vw, 1120px" />
        </figure>
      </div>

      <article className="article-body">
        <section className="article-takeaways" aria-labelledby="takeaway-title">
          <h2 id="takeaway-title">สรุปให้ก่อนอ่าน</h2>
          <ul>{article.takeaways.map((item) => <li key={item}><Icon name="check" size={18} />{item}</li>)}</ul>
        </section>

        <nav className="article-toc" aria-label="สารบัญ">
          <strong>ในบทความนี้</strong>
          <ol>
            {article.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}
          </ol>
        </nav>

        {article.sections.map((section, index) => (
          <section id={`section-${index + 1}`} key={section.heading} className="article-section">
            <div className="article-section__number">{String(index + 1).padStart(2, '0')}</div>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}

        <section className="article-comparison" aria-labelledby="article-comparison-title">
          <div className="article-comparison__header">
            <span>เทียบให้เห็นภาพ</span>
            <h2 id="article-comparison-title">{article.comparison.title}</h2>
          </div>
          <div className="article-comparison__scroll">
            <table>
              <thead>
                <tr>{article.comparison.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
              </thead>
              <tbody>
                {article.comparison.rows.map((row) => (
                  <tr key={row.join('|')}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="article-products" aria-labelledby="article-products-title">
          <div className="article-products__header">
            <span>แบบประกันที่เชื่อมโยง</span>
            <h2 id="article-products-title">ดูแบบประกันที่เกี่ยวข้องกับโจทย์นี้</h2>
            <p>รายการต่อไปนี้มีหน้าที่บางส่วนที่เกี่ยวข้อง ไม่ใช่คำแนะนำให้ซื้อทุกแบบ กรุณาอ่านรายละเอียดและเอกสารทางการก่อนตัดสินใจ</p>
          </div>
          <div className="article-products__grid">
            {article.products.map((product) => {
              const imagePath = productImagePathsByName[product.name]
              return (
                <a key={product.path} href={product.path} onClick={(event) => { event.preventDefault(); navigate(product.path) }}>
                  {imagePath && (
                    <div className="article-products__image">
                      <OptimizedImage src={assetUrl(imagePath)} alt={product.name} width={480} height={360} sizes="(min-width: 768px) 340px, calc(100vw - 64px)" />
                    </div>
                  )}
                  <h3>{product.name}</h3>
                  <p>{product.fit}</p>
                  <small><strong>ควรตรวจ:</strong> {product.caution}</small>
                  <span>ดูรายละเอียดแบบประกัน <Icon name="arrow" size={16} /></span>
                </a>
              )
            })}
          </div>
        </section>

        <aside className="article-disclaimer">
          <Icon name="shield" size={22} />
          <p><strong>หมายเหตุสำคัญ</strong> บทความนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำภาษี การลงทุน การแพทย์ หรือใบเสนอขาย ผลิตภัณฑ์และสิทธิจริงขึ้นอยู่กับเงื่อนไขกรมธรรม์ สุขภาพ การพิจารณารับประกัน และกฎหมายหรือหลักเกณฑ์ล่าสุด</p>
        </aside>

        <section className="article-sources">
          <h2>แหล่งข้อมูลที่เกี่ยวข้อง</h2>
          <ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} <Icon name="external" size={15} /></a></li>)}</ul>
        </section>
      </article>

      {related.length > 0 && (
        <section className="article-related" aria-labelledby="related-articles-title">
          <div className="section-heading section-heading--inline">
            <h2 id="related-articles-title">อ่านต่อในเรื่องที่เกี่ยวข้อง</h2>
            <a href={routeUrl('/articles')} onClick={(event) => { event.preventDefault(); navigate('/articles') }}>ดูทุกบทความ <Icon name="arrow" size={17} /></a>
          </div>
          <div className="article-related__grid">
            {related.map((item) => (
              <ArticleLink key={item.slug} article={item} navigate={navigate}>
                <OptimizedImage src={item.image} alt={item.imageAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 31vw" />
                <ArticleMeta article={item} />
                <h3>{item.title}</h3>
              </ArticleLink>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
