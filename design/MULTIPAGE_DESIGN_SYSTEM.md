# MTL multi-page experience

## Source concepts

- `design/concepts/multipage-home-concept.png` — homepage, finder, featured plans, need links, direct contact
- `design/concepts/multipage-finder-concept.png` — dedicated plan finder and paged results
- `design/concepts/multipage-detail-concept.png` — shareable plan detail, tabs, lead form, contact channels

The concepts are the visual source of truth for the multi-page redesign. Product facts continue to come from `src/data/catalog.ts`.

## Information architecture

- `/` — short orientation page, quick finder, featured plans, need-based navigation, direct contact
- `/plans` — searchable and filterable finder that reveals six results at a time
- `/plans/:slug` — permanent page for one plan with its own breadcrumb, facts, documents, lead form, and related plans
- `/contact` — dedicated lead form and simulated LINE/telephone channels

The compare selection persists while navigating between routes and supports two or three plans.

## Visual system

- Canvas: true white `#FFFFFF`
- Ink: `#09090B`; secondary ink `#3F4858`; muted `#687286`
- Brand: `#E0006D`; hover `#C70060`; soft surface `#FFF0F6`
- Borders: `#E4E7EC`; strong controls `#CBD1DB`
- Typography: SF Pro TH with Helvetica/Arial fallbacks
- Content rail: `1500px`; desktop gutter `32px`; mobile gutter `20px`
- Radii: controls use full pills; content frames use `18–24px`; fields use `10–12px`
- Shadows are reserved for hover and the persistent compare tray
- Icons are 1.8px outline SVGs using `currentColor`

## Component families

- Quiet sticky header with four destinations and one primary contact action
- Primary/secondary pill buttons, 50px normal and 60px large
- Quick-finder form with age, occupation, and life-goal inputs
- Featured editorial plans with a 48/52 image-to-copy split
- Need links that remain navigation, not decorative cards
- Finder sidebar plus two-column result list; one column on mobile
- Detail hero, tab rail, benefit rows, compact disclosure, and a single contact frame
- Direct contact rows for LINE OA and telephone, both explicitly marked as mock data
- Persistent compare tray and accessible comparison dialog

## Responsive rules

- `>1180px`: desktop header, two-column hero/detail, two-column finder results
- `901–1180px`: compact header, simplified finder spacing, single-column results where necessary
- `<=900px`: menu drawer, stacked hero/detail, inline finder form becomes two columns
- `<=680px`: one-column forms and results, horizontal category rails, stacked actions, compact compare tray

No route relies on a section hash for core navigation. Each plan remains directly addressable and shareable.
