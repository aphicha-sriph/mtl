import { createRoot, hydrateRoot } from 'react-dom/client'

import App from './App'
import './styles.css'

const rootElement = document.getElementById('root')!

const initialLocation = `${window.location.pathname}${window.location.search}`
const app = <App initialLocation={initialLocation} />

if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app)
else createRoot(rootElement).render(app)
