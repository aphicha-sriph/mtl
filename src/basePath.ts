const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function assetUrl(path: string) {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function routeUrl(path: string) {
  if (base && path.startsWith(base)) return path
  return `${base}${path}`
}

export function stripBase(pathname: string) {
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/'
  }
  return pathname
}

export { base as BASE }
