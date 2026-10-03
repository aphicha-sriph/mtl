# MTL Product Explorer — Design System

This document is the implementation contract for the three approved 1586 × 992 visual references:

- `design/concepts/hero-concept.png`
- `design/concepts/catalog-concept.png`
- `design/concepts/detail-concept.png`

The references are the visual source of truth. Values below normalize small raster and generation inconsistencies into one exact, reusable system. The intended character is calm, warm, premium, and highly legible: mostly white space, one magenta action color, strong black Thai display type, fine cool-gray borders, and optimistic editorial photography.

## 1. Non-negotiable visual principles

1. **White space carries the brand.** Default to a near-white canvas, thin borders, and almost no elevation. Do not fill sections with decorative color.
2. **Magenta means action or selection.** Use it for the active navigation item, primary CTAs, selected filters, selected compare controls, and small line accents only. It must not become a large background theme.
3. **Headlines are bold and compact; supporting copy is calm.** Large Thai headings are black, heavy, and closely tracked. Body copy is cool gray and given generous line height.
4. **Photography is human, bright, and reassuring.** Show Thai/Asian people at recognizably different life stages in naturally lit, uncluttered scenes. Images are editorial, not corporate stock-photo tableaux.
5. **Product facts outrank decoration.** Age, payment term, coverage term, key fact, caveat, and official-source link must remain easy to scan.

Do not add glassmorphism, dark sections, multicolor gradients, exaggerated shadows, illustrated mascots, emoji, hand-drawn icons, or ornamental UI not present in the references.

## 2. Exact tokens

### 2.1 Color

These values are canonical implementation colors, even where antialiasing in the PNGs produces nearby shades.

| Token | Value | Use |
|---|---:|---|
| `--color-canvas` | `#FEFEFE` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, header, sticky compare dock |
| `--color-ink` | `#08090B` | Display headings and primary text |
| `--color-ink-secondary` | `#3F4858` | Lead copy, product facts, navigation |
| `--color-ink-muted` | `#667085` | Labels, metadata, helper text |
| `--color-brand` | `#DE006B` | Primary action and selected state |
| `--color-brand-hover` | `#C70060` | Primary hover |
| `--color-brand-pressed` | `#AD0053` | Primary pressed |
| `--color-brand-soft` | `#FFF0F6` | Selected card/chip background |
| `--color-brand-soft-strong` | `#FDE3EF` | Icon tile or highlighted compare area |
| `--color-brand-line` | `#F04B9A` | One-pixel image/selection accent only |
| `--color-fill-subtle` | `#F6F7F9` | Neutral icon discs, tertiary controls |
| `--color-fill-hover` | `#EFF1F4` | Neutral hover |
| `--color-border` | `#E5E7EB` | Default card/control divider |
| `--color-border-strong` | `#C8CED8` | Secondary-button and input outline |
| `--color-focus-ring` | `rgba(222, 0, 107, 0.22)` | Four-pixel keyboard focus halo |
| `--color-scrim` | `rgba(8, 9, 11, 0.42)` | Modal/drawer scrim only |

`#DE006B` against white has approximately 4.86:1 contrast, so white text is permitted at normal text sizes. Muted copy must never be lighter than `#667085` on white.

### 2.2 Typography

Use one family throughout the UI:

```css
--font-sans: "Noto Sans Thai", "Helvetica Neue", Arial, sans-serif;
```

Load weights 400, 500, 600, 700, 800, and 900. Do not synthesize missing bold weights. Use the actual MTL logo asset; never type `mtl` in the UI font.

| Style | Desktop size / line height | Weight | Tracking | Intended use |
|---|---:|---:|---:|---|
| `display-hero` | `72px / 1.10` | 900 | `-0.045em` | Two-line home hero |
| `display-page` | `60px / 1.10` | 900 | `-0.040em` | Catalog title |
| `display-detail` | `52px / 1.14` | 900 | `-0.035em` | Product title |
| `heading-1` | `40px / 1.20` | 800 | `-0.025em` | Major below-fold section |
| `heading-2` | `32px / 1.25` | 800 | `-0.020em` | Section title |
| `heading-3` | `24px / 1.30` | 700 | `-0.015em` | Product-card title |
| `title` | `20px / 1.35` | 700 | `-0.010em` | Benefit-row and tray title |
| `lead` | `28px / 1.45` | 400 | `-0.010em` | Hero and detail subhead |
| `body-large` | `18px / 1.60` | 400 | `0` | Explanatory copy |
| `body` | `16px / 1.55` | 400 | `0` | Default UI copy |
| `nav` | `18px / 1.35` | 600 | `0` | Desktop navigation |
| `button` | `18px / 1.30` | 700 | `0` | Primary and secondary buttons |
| `label` | `14px / 1.45` | 500 | `0` | Fact labels and chips |
| `caption` | `12px / 1.50` | 400 | `0.005em` | Legal/helper copy |

Responsive type overrides:

| Style | 768–1279 px | Below 768 px |
|---|---:|---:|
| `display-hero` | `56px / 1.12` | `44px / 1.12` |
| `display-page` | `48px / 1.12` | `38px / 1.16` |
| `display-detail` | `44px / 1.16` | `34px / 1.20` |
| `heading-1` | `36px / 1.22` | `30px / 1.25` |
| `heading-2` | `28px / 1.28` | `26px / 1.30` |
| `lead` | `24px / 1.50` | `20px / 1.55` |

Thai text needs its full line box. Never vertically crop headings to imitate a tighter Latin line height.

### 2.3 Spacing

Use a four-pixel base unit and only the following tokens:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-15: 60px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

Layout dimensions:

| Token | Desktop value | Use |
|---|---:|---|
| `--content-max` | `1468px` | Main catalog/detail content |
| `--rail-max` | `1526px` | Home category rail and compare dock |
| `--page-gutter` | `60px` | Desktop content inset |
| `--header-height` | `90px` | Desktop global header |
| `--section-gap` | `80px` | Major section rhythm |
| `--grid-gap` | `12px` | Catalog and category card gap |
| `--detail-gap` | `36px` | Detail media/content gap |
| `--control-height` | `56px` | Search and normal CTA |
| `--control-height-large` | `64px` | Hero CTA |
| `--compare-dock-height` | `76px` | Desktop sticky compare dock |

Content alignment is strict: major headings, search, filters, catalog grid, detail copy, and footer content share the same left and right rails.

### 2.4 Shape, borders, and elevation

```css
--radius-xs: 8px;
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 22px;
--radius-xl: 28px;
--radius-pill: 999px;

--border-default: 1px solid #E5E7EB;
--border-strong: 1px solid #C8CED8;

--shadow-card-hover: 0 12px 32px rgba(24, 17, 21, 0.08);
--shadow-floating: 0 -10px 32px rgba(24, 17, 21, 0.10);
```

- Cards use `--radius-lg`; card images use `--radius-md`.
- Inputs and all buttons use `--radius-pill`.
- Icon tiles use `--radius-sm`; icon-only circular controls use `--radius-pill`.
- Default cards have no shadow. Add `--shadow-card-hover` only on hover/focus-within.
- The compare dock is the only element that uses `--shadow-floating` continuously.

### 2.5 Motion and interaction

```css
--duration-fast: 140ms;
--duration-base: 220ms;
--duration-slow: 360ms;
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1);
```

- Hover: translate a card by at most `-2px`; never scale photography.
- Button and chip color transitions use `140ms`.
- Drawer, modal, and compare-dock entrance use `220ms`.
- Respect `prefers-reduced-motion`; remove translation and use an immediate opacity/state change.
- All actionable targets are at least `44 × 44px`.
- Keyboard focus is a `4px` `--color-focus-ring` halo outside the control border; it must not be replaced by hover styling.

## 3. Page geometry

### 3.1 Global header

- Height: `90px`; white/near-white surface; one-pixel bottom border.
- Horizontal inset: `60px` at the 1586px reference viewport.
- Left cluster: official MTL logo, a `24px` vertical divider, then `ชีวิตที่ออกแบบได้` in `20px/500` secondary text.
- Center navigation: four items with `32px` gaps. Active item is brand-colored with a `2px` underline positioned `12px` below its text.
- Right: `52px` circular neutral search control using a `24px` Phosphor `MagnifyingGlass` icon.
- Header content never wraps.

### 3.2 Home hero

- Desktop grid: `42% / 58%`, beginning directly under the header.
- Copy inset: `60px`; copy max width: `590px`; vertical start: approximately `120px` below the header.
- Headline is exactly two lines and may not be reduced to one line on wide desktop.
- CTA row has two controls, each `292 × 64px`, separated by `12px`.
- Evidence row sits `40px` below the CTA row and separates items with centered bullets.
- Hero image occupies the full right column and reaches the viewport edge. Its visible desktop slot is approximately `928 × 614px`.
- The six-card life-goal rail uses `30px` outer gutters, `12px` gaps, and six equal cards. Image ratio is approximately `2.25:1`; card height is `234px` including label.

### 3.3 Catalog

- Top heading block begins at `60px` from the left and `20px` from the top of the page content.
- Result count aligns to the heading baseline at the far right.
- Search is full width, `56px` high, with a one-pixel brand border and `24px` horizontal padding.
- Filter row is `44px` high, one line, horizontally scrollable when needed. Chips do not wrap.
- Desktop product grid: three equal columns, `12px` gaps.
- Product card: minimum height `320px`; internal padding `12px`; border `1px`; radius `22px`.
- Card image: full inner width, `150px` height, `object-fit: cover`, radius `16px`.
- Three key facts use equal columns with vertical dividers. Fact label uses `label`; fact value uses `16px/600`.
- Bottom actions form two columns: details gets the larger share; compare stays at least `168px` wide.
- Selected cards use a brand border plus `--color-brand-soft`; the selected check is visible both at the image corner and in the compare action.

### 3.4 Product detail

- Back link sits below the global header and above the main grid.
- Desktop grid: image `50%`, information `50%`, separated by `36px`.
- Primary image aspect ratio is approximately `1.21:1`, with `22px` radius and no shadow.
- Product category appears above the title in `18px/600` secondary text.
- Three fact columns are placed below the subhead with `24px` gaps and one-pixel vertical separators.
- Benefit rows use a `56px` pale-pink icon tile, a `24px` icon, a `20px/700` title, and `16px` supporting copy. Rows are divided by `--color-border`.
- Action row order: primary quote CTA, compare toggle, official-source link.
- Legal/helper line follows actions using an info icon and `caption`/muted styling.
- Recommended-plan rail appears after the main detail block and before the compare dock.

## 4. Component families

### 4.1 Buttons

| Variant | Fill | Border | Text/icon | State rule |
|---|---|---|---|---|
| Primary | `--color-brand` | Brand | White | Hover/pressed use brand state tokens |
| Secondary | White | `--color-border-strong` | `--color-ink` | Hover uses `--color-fill-subtle` |
| Tertiary | Transparent | None | `--color-ink-secondary` | Underline or subtle fill on hover |
| Soft brand | `--color-brand-soft` | None | Brand | Used only for selected compare state |
| Icon-only | `--color-fill-subtle` | None | Ink | Always circular; accessible name required |

All text buttons use a right-arrow icon after the label when they move forward. Use Phosphor Icons with regular weight at `20px`; never use a text glyph (`>`, `→`) as an icon.

### 4.2 Navigation and filter chips

- Neutral chip: white, `--color-border`, `14px/500`, `44px` high, `20px` horizontal padding.
- Selected chip: brand fill, white text, no shadow.
- Hover chip: `--color-fill-subtle`; selected hover uses `--color-brand-hover`.
- Use horizontally scrollable rails with hidden scrollbars on small screens. Keep the currently selected chip fully visible.

### 4.3 Search and sort

- Search field is a real `<input type="search">`; icon is `24px`, left inset `20px`, text begins after a `16px` gap.
- Search placeholder: `ค้นหาชื่อแผน หรือความต้องการ`.
- Sort is a pill-shaped native/select control labeled `เรียงตาม แนะนำ` with a library chevron icon.
- Search, filter, and sort state must update the visible result count.

### 4.4 Life-goal card

- Contains a purpose-specific image, one line of Thai text, and a `44px` circular chevron control.
- Default: neutral border. Selected: brand border, `--color-brand-soft`, brand icon disc.
- Label is `20px/700`; truncate only after two lines on mobile.

### 4.5 Product card

Required content order:

1. Category image and selection control.
2. Official product name.
3. Age, premium/payment term, and coverage term.
4. `ดูรายละเอียด` action.
5. Compare checkbox and label.

Hover must not hide facts. A selected card remains selected when filters change unless it is explicitly removed from compare. Compare supports at most three products.

### 4.6 Compare controls

- Checkbox: `24 × 24px`, `8px` radius, brand fill when checked, white check icon.
- Desktop dock: fixed to bottom, centered within a `calc(100% - 48px)` tray, maximum width `1536px`, height `76px`, radius `22px 22px 0 0` or `22px` when floated `12px` above the viewport.
- Dock shows count (`เปรียบเทียบแผน 2/3`), selected product pills with thumbnail and remove action, an empty slot, then the brand CTA.
- CTA label: `เปรียบเทียบตอนนี้`.
- Disabled with fewer than two selected products; enabled from two to three.

### 4.7 Benefit/caveat row

- Use `Heart`, `FileText`, and `UsersThree` from Phosphor Icons, regular weight, `28px`, in brand color.
- Icon lives in a `56px` soft-pink tile; title and copy form the second column.
- The three semantic row labels are fixed: `จุดเด่นที่ควรรู้`, `ก่อนตัดสินใจ`, `เหมาะกับใคร`.

### 4.8 Official-source and disclosure treatment

- Official-source link uses an external-link icon and text `ดูข้อมูลจากเว็บไซต์ทางการ`.
- Product-facing facts must come from `data/muangthai-official-products-2026-09-30.json`, with richer Thai copy from `docs/research/muangthai-product-catalog.md` only where the fact agrees with the JSON.
- The deprecated agent-site snapshot must never populate cards.
- Disclosures are always visible; do not hide them in a tooltip.

## 5. Image direction and treatment

### 5.1 Art direction

- Thai/Asian casting across young adults, working parents, children, clinicians, Muslim customers, and older adults.
- Warm natural daylight, airy interiors, pale sky, soft beige clothing, restrained blush and blue accents.
- Expressions are relaxed and authentic; subjects interact with one another rather than posing at camera.
- Keep backgrounds uncluttered so black UI copy remains visually dominant.
- No hospital distress, needles, visible illness, money piles, handshakes, shields, umbrellas, clip-art symbols, embedded text, watermarks, or third-party logos.
- Representation must be respectful; hijab is shown naturally without turning faith into a visual prop.

### 5.2 Asset specifications

| Slot | Source size/aspect | Crop/focal rule |
|---|---|---|
| Home hero | At least `1800 × 1200`, about `3:2` | Family group centered-right; preserve every face and both outer shoulders |
| Detail hero | At least `1440 × 1200`, about `6:5` | Family centered; keep room at top-left for the baked arc |
| Catalog thumbnail | At least `1200 × 400`, `3:1` | Faces on an upper-third line; allow a wide horizontal crop |
| Life-goal card | At least `900 × 400`, `2.25:1` | One simple subject/story per card |
| Compare thumbnail | Derive from the corresponding catalog asset | Center crop, never a separately generated look-alike |

Use `object-fit: cover`; default focal position is `50% 42%`, then set per-image focal positions when faces would be clipped. Never stretch or upscale a low-resolution crop.

The thin magenta arc seen in the hero/detail references belongs to the approved raster composition. It must be baked into the delivered image asset or supplied as an approved standalone asset. Do not redraw it with CSS, an inline SVG, or HTML elements.

Catalog/detail imagery for the same product must share the same people, wardrobe, palette, and scene. It may use a different crop of the same master image, but not a newly generated substitute.

## 6. Allowed above-fold copy

Copy below is approved exactly as written. Do not add superlatives such as “ดีที่สุด,” “การันตีผลตอบแทนสูง,” or “คุ้มที่สุด.” Product facts still require canonical-data validation.

### 6.1 Global header

- Brand line: `ชีวิตที่ออกแบบได้`
- Navigation: `หน้าแรก` · `แผนประกัน` · `คู่มือเลือกแผน` · `คำถามที่พบบ่อย`
- Search control accessible name: `ค้นหาแผนประกัน`

### 6.2 Home hero

- Eyebrow: none.
- H1, exactly two lines on desktop:

  ```text
  ทุกแผนชีวิต
  ชัดเจนในที่เดียว
  ```

- Lead: `สำรวจ 43 แผนประกันทางการ เปรียบเทียบอย่างเข้าใจ และเลือกจากเป้าหมายชีวิตของคุณ`
- Primary CTA: `ค้นหาแผนที่ใช่`
- Secondary CTA: `ดูทั้งหมด 43 แผน`
- Evidence: `43 แผนบนเว็บไซต์` · `42 ผลิตภัณฑ์หรือชุดผลิตภัณฑ์` · `10 หมวด`
- Visible life goals: `คุ้มครองชีวิต` · `สุขภาพ` · `โรคร้ายแรง` · `เกษียณ` · `ออมและลงทุน` · `อุบัติเหตุ`

The number 43 means the 43 official-site cards in the dated knowledge snapshot, not a promise that every historical product is quotable in every channel.

### 6.3 Catalog

- H1: `ค้นหาแผนที่เข้ากับชีวิตคุณ`
- Lead: `เริ่มจากเป้าหมาย แล้วค่อยดูรายละเอียด`
- Count pattern: `พบ {count} แผน`
- Search placeholder: `ค้นหาชื่อแผน หรือความต้องการ`
- Filter labels: `ทั้งหมด` · `คุ้มครองชีวิต` · `สุขภาพ` · `โรคร้ายแรง` · `เกษียณ` · `ออมและลงทุน` · `อุบัติเหตุ` · `Unit-linked` · `Universal Life` · `ประกันกลุ่ม` · `ตะกาฟุล`
- Sort default: `เรียงตาม แนะนำ`
- Card actions: `ดูรายละเอียด` and `เปรียบเทียบ`
- Compare dock: `เปรียบเทียบแผน {count}/3` · `เพิ่มแผน (สูงสุด 3 แผน)` · `เปรียบเทียบตอนนี้`

Product names and numeric facts shown inside the concept cards are layout examples. Implementation must use the canonical data rather than transcribing placeholder values from the PNG.

### 6.4 Product detail example

- Back link: `กลับไปดูทุกแผน`
- Category: `คุ้มครองชีวิต`
- H1: `เมืองไทย เฟล็กซี่ โพรเทคชั่น`
- Lead: `ความคุ้มครองชีวิตที่ปรับเป็นค่ารักษาได้หลังอายุ 65 ปี`
- Fact labels and values:
  - `อายุรับ` — `99/5: 30 วัน – 55 ปี` and `99/20: 30 วัน – 45 ปี`
  - `ระยะจ่ายเบี้ย` — `5 หรือ 20 ปี`
  - `ระยะคุ้มครอง` — `ถึงอายุ 99 ปี`
- `จุดเด่นที่ควรรู้` — `ตั้งแต่อายุ 65 ปี สามารถใช้ทุนชีวิตคงเหลือเป็นค่ารักษาแบบ IPD/OPD ได้ตามเงื่อนไข`
- `ก่อนตัดสินใจ` — `ค่ารักษาที่จ่ายไปจะลดผลประโยชน์ชีวิตและเงินครบสัญญาคงเหลือ`
- `เหมาะกับใคร` — `คนวัยทำงานที่ต้องการวางแผนมรดกและค่ารักษาหลังเกษียณในกรมธรรม์เดียว`
- Primary CTA: `ขอใบเสนอราคา`
- Compare: `เพิ่มเพื่อเปรียบเทียบ`
- Official link: `ดูข้อมูลจากเว็บไซต์ทางการ`
- Disclosure: `ข้อมูลเพื่อการสำรวจเบื้องต้น โปรดตรวจใบเสนอขาย ตารางผลประโยชน์ และเงื่อนไขกรมธรรม์ฉบับล่าสุดก่อนตัดสินใจ`
- Recommendation heading: `แผนที่น่าดูต่อ`

## 7. Responsive rules

### Wide desktop — 1280px and above

- Use `--page-gutter: 60px`, `--content-max: 1468px`, and the exact desktop typography.
- Header navigation is fully visible.
- Hero and product detail use two-column layouts.
- Catalog uses three columns.
- Home goal rail shows six cards in one row.
- Compare dock shows selected product pills and the empty third slot.

### Desktop/tablet landscape — 1024–1279px

- Use `40px` page gutters and a `76px` header.
- Hide the logo tagline before compressing the central navigation.
- Hero remains two columns at `44% / 56%`; reduce headline to the tablet size.
- Catalog uses two columns.
- Detail stacks image above information below `1120px`.
- Goal cards become a horizontal snap rail; show at least 3.25 cards.

### Tablet portrait — 768–1023px

- Use `32px` page gutters and a `72px` header.
- Replace center navigation with a library menu icon and an accessible drawer. Keep search visible.
- Stack hero copy above the image. CTAs may stay side by side if each remains at least `220px` wide.
- Hero image uses `min-height: 420px`; preserve all faces.
- Catalog stays two columns until a card would become narrower than `340px`.
- Search occupies its own row; filters and sort occupy a second horizontal rail.
- Detail image and content are one column. Product facts may remain three columns.

### Mobile — below 768px

- Use `20px` page gutters and a `64px` header.
- Show logo, menu, and search only; hide tagline and desktop navigation.
- Stack hero copy, CTAs, evidence, image, then goal rail. CTAs are full width and `56px` high.
- Headline may wrap to three lines, but the words and order remain unchanged.
- Hero/detail images use a minimum `4:3` visible crop; faces may never be cut off.
- Goal rail shows about 1.2 cards to reveal horizontal continuation.
- Catalog uses one column. Chips remain a single horizontal scrolling line.
- Product-card actions stack only below `420px`; otherwise retain two columns.
- Product-detail facts become one column with horizontal dividers.
- Detail action buttons stack full width; the official-source link follows them.
- Compare dock collapses to count plus CTA. Hide selected-product pills, but expose selected names in an accessible expand/collapse panel.
- Reserve bottom safe-area padding with `env(safe-area-inset-bottom)` so the dock never obscures controls.

### Small mobile — below 380px

- Page gutter becomes `16px`.
- Use `40px` for the hero display and `32px` for detail display.
- Keep all tap targets at `44px`; allow labels to wrap rather than shrinking below `14px`.

## 8. Accessibility and content behavior

- Use semantic landmarks, headings in order, real links, real buttons, native inputs, and a fieldset/legend for compare selection where practical.
- Every image has concise Thai alt text describing the life situation, not insurance marketing copy. Decorative images use empty alt text.
- Never place text over photography in this system.
- Announce filtered result counts and compare-count changes with a polite live region.
- Selected state cannot rely on magenta alone; pair color with the check icon and text/state attributes.
- Official links open predictably and display the external-link indicator; do not imply that this local experience is the insurer's transactional quotation system.
- Preserve the visible disclosure and clarify that eligibility, underwriting, channel, version, and current sale status require confirmation.

## 9. Five-point fidelity checklist

Implementation passes only when all five checks are true:

1. **Geometry:** At 1586 × 992, header height, 60px rails, hero/detail split, three-column catalog, 12px grid gaps, image ratios, corner radii, and 76px compare dock visibly match the references without overlap or unexpected wrapping.
2. **Type:** Noto Sans Thai is loaded at real weights; hero/catalog/detail headings use the specified sizes, weights, tracking, and line breaks; body copy remains at least 16px with intact Thai marks and line boxes.
3. **Color and state:** Canvas, ink, border, and canonical `#DE006B` are exact; only actions/selections use magenta; hover, focus, selected, disabled, empty, and checked states are all present and keyboard-visible.
4. **Imagery:** Each slot uses a purpose-made, correctly cropped asset in the shared warm editorial direction; faces are uncropped; product imagery remains consistent across card/detail/compare; the arc is an approved image asset rather than CSS art.
5. **Content and responsiveness:** Approved above-fold Thai copy is unchanged, product facts come from the official canonical data, disclosures remain visible, search/filter/compare controls work, and the 1280+, 1024–1279, 768–1023, below-768, and below-380 layouts pass without horizontal page scrolling.

