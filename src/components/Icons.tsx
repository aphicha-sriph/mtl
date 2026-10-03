import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'arrow'
  | 'check'
  | 'chat'
  | 'chevron'
  | 'close'
  | 'compare'
  | 'download'
  | 'external'
  | 'family'
  | 'filter'
  | 'group'
  | 'health'
  | 'heart'
  | 'hospital'
  | 'location'
  | 'menu'
  | 'moon'
  | 'phone'
  | 'plus'
  | 'retirement'
  | 'savings'
  | 'search'
  | 'shield'
  | 'spark'
  | 'travel'
  | 'trend'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h13" /><path d="m14 7 5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chat: <><path d="M6 5h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 3v-5.3A3 3 0 0 1 3 13.5V8a3 3 0 0 1 3-3Z" /><path d="M8 10h8" /><path d="M8 14h5" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    compare: <><path d="M7 4v16" /><path d="M17 4v16" /><path d="M4 8h6" /><path d="M14 16h6" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    external: <><path d="M15 4h5v5" /><path d="m20 4-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    filter: <><path d="M3 6h18" /><path d="M7 12h10" /><path d="M10 18h4" /></>,
    family: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 20c.6-4.2 2.4-6 5.5-6s5 1.8 5.5 6" /><path d="M13.5 15.5c1-.9 2.1-1.4 3.5-1.4 2.6 0 4.1 1.6 4.5 5.9" /></>,
    group: <><circle cx="12" cy="7" r="3" /><circle cx="5" cy="10" r="2" /><circle cx="19" cy="10" r="2" /><path d="M6 20c.5-4.2 2.4-6 6-6s5.5 1.8 6 6" /><path d="M1.8 19c.2-2.8 1.3-4.2 3.4-4.2" /><path d="M22.2 19c-.2-2.8-1.3-4.2-3.4-4.2" /></>,
    health: <><path d="M12 21S4 16.4 4 9.5A4.5 4.5 0 0 1 12 6.7a4.5 4.5 0 0 1 8 2.8C20 16.4 12 21 12 21Z" /><path d="M8 12h2.2l1.4-3 1.8 6 1.2-3H17" /></>,
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />,
    hospital: <><path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14" /><path d="M9 5V3h6v2" /><path d="M12 8v4" /><path d="M10 10h4" /><path d="M7 15h2v3H7z" /><path d="M15 15h2v3h-2z" /><path d="M10 18h4v3h-4z" /></>,
    location: <><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7Z" /><circle cx="12" cy="9" r="2.5" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    moon: <><path d="M20.5 15.3A9 9 0 0 1 8.7 3.5 9 9 0 1 0 20.5 15.3Z" /><path d="m17 4 .5 1.3L19 6l-1.5.7L17 8l-.5-1.3L15 6l1.5-.7L17 4Z" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.7 12.7 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6.1 6.1l1.3-1.3a2 2 0 0 1 2.1-.5 12.7 12.7 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    retirement: <><path d="M5 20h14" /><path d="M7 20v-8h10v8" /><path d="M4 12h16L12 4 4 12Z" /><path d="M10 15h4" /></>,
    savings: <><path d="M5 9a7 7 0 0 1 13.2 1" /><path d="M6 15a6 6 0 0 0 10.7 1" /><path d="M18 7v4h-4" /><path d="M6 17v-4h4" /><path d="M12 7v10" /><path d="M14.2 9.2c-.5-.7-1.2-1.1-2.2-1.1-1.3 0-2.2.7-2.2 1.7 0 2.7 4.4 1.2 4.4 4 0 1.1-.9 1.9-2.3 1.9-1 0-1.9-.4-2.5-1.2" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    shield: <><path d="M12 3 4.8 6v5.3c0 4.6 3 7.8 7.2 9.7 4.2-1.9 7.2-5.1 7.2-9.7V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    spark: <><path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8L12 3Z" /><path d="m18.5 14 .6 2.1L21 17l-1.9.9-.6 2.1-.6-2.1L16 17l1.9-.9.6-2.1Z" /></>,
    travel: <><path d="M4 17h16" /><path d="m6 17 2-8h8l2 8" /><path d="M9 9V6h6v3" /><path d="M8 21h.01" /><path d="M16 21h.01" /></>,
    trend: <><path d="M4 18 10 12l4 4 6-8" /><path d="M15 8h5v5" /></>,
  }

  return <svg {...common} {...props}>{paths[name]}</svg>
}
