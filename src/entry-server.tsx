import { renderToString } from 'react-dom/server'

import App from './App'
import { getPrerenderRoutes } from './routes'
import { getSeoData } from './seo'

export function render(location: string, origin?: string) {
  const html = renderToString(<App initialLocation={location} />)
  return {
    // React 19 emits image preload links before the app tree during SSR. The
    // prerenderer adds equivalent route-aware preloads to <head>, so keeping
    // these inside #root would make the hydration tree start with <link>.
    html: html.replace(/^(?:<link rel="preload" as="image"[^>]*\/>)+/, ''),
    seo: getSeoData(location, origin),
  }
}

export { getPrerenderRoutes }
export { BASE } from './basePath'
