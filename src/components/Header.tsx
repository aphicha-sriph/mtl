import { useEffect, useState, type MouseEvent } from 'react'

import { assetUrl, routeUrl } from '../basePath'
import { Icon } from './Icons'

interface HeaderProps {
  path: string
  onNavigate: (to: string) => void
}

const navItems = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/plans', label: 'แผนประกัน' },
  { href: '/plans?compare=1', label: 'เปรียบเทียบ' },
  { href: '/hospitals', label: 'โรงพยาบาล' },
  { href: '/articles', label: 'บทความ' },
  { href: '/about', label: 'เกี่ยวกับเรา' },
  { href: '/contact', label: 'ติดต่อเรา' },
]

export function Header({ path, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const follow = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    setMenuOpen(false)
    onNavigate(href)
  }

  const isActive = (href: string) => {
    if (href === '/') return path === '/'
    if (href.includes('?compare=1')) return false
    if (href === '/plans') return path.startsWith('/plans')
    if (href === '/articles') return path.startsWith('/articles')
    if (href === '/hospitals') return path === '/hospitals'
    return path === href
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href={routeUrl('/')} onClick={(event) => follow(event, '/')}>
          <img className="brand__logo" src={assetUrl('/images/logo-planner52.webp')} alt="MTL Planner 52" width="1254" height="1254" />
          <div className="brand__text">
            <span className="brand__title">ชีวิตที่ออกแบบได้</span>
            <span className="brand__sub">ตัวแทนประกันชีวิต บมจ.เมืองไทยประกันชีวิต</span>
          </div>
        </a>

        <nav className="desktop-nav" aria-label="เมนูหลัก">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={routeUrl(item.href)}
              className={isActive(item.href) ? 'is-active' : ''}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={(event) => follow(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={routeUrl('/contact')} onClick={(event) => follow(event, '/contact')}>
          ปรึกษาที่ปรึกษา
          <Icon name="arrow" size={18} />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? 'is-open' : ''}`}
        aria-label="เมนูบนมือถือ"
      >
        {navItems.map((item, index) => (
          <a key={item.href} href={routeUrl(item.href)} onClick={(event) => follow(event, item.href)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
            <Icon name="arrow" size={19} />
          </a>
        ))}
        <a className="mobile-nav__contact" href={routeUrl('/contact')} onClick={(event) => follow(event, '/contact')}>
          ปรึกษาที่ปรึกษา
          <Icon name="arrow" size={19} />
        </a>
      </nav>
    </header>
  )
}
