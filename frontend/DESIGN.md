# BhriguSetu — Visual System

## Direction

BhriguSetu should feel like a serious Jyotisha study room joined to an astronomical observatory: rooted in Sanskrit textual culture, calm enough for long study, and precise enough for technical work. It must not resemble a generic horoscope marketplace, chatbot landing page or AI-generated SaaS template.

The visual language is **manuscript, observatory and shastra**:
- Warm manuscript paper for reading and catalogue surfaces.
- Deep forest green for primary navigation, focus areas and important actions.
- Antique brass for rules, indices, diagrams and restrained emphasis.
- Vermilion only as a secondary accent.
- Original geometric linework, nakshatra-like star points and chart diagrams instead of stock photography.
- Sanskrit terminology is retained where it is meaningful; English remains the default interface language, with Hindi available as a deliberate alternate.

## Figma references reviewed

The following Figma Community pages were read on 19 November 2026. These are references for design approach, not assets to copy blindly.

1. [Free Premium Astronomy Icons Illustrations](https://www.figma.com/community/file/1301906211902091547/free-premium-astronomy-icons-illustrations) — the description offers four icon treatments: flat colour, lineal, glyph and outline. BhriguSetu should choose one coherent line-art family for planetary, zodiac and calculation symbols rather than mixing styles.
2. [Boodoo — Astrology & Horoscope](https://www.figma.com/community/file/1278228207043697002/boodoo-astrology-horoscope) — a customizable astrology website template with grouped components. Its page notes that preview images are not included in the design file; do not depend on those images.
3. [Advisor — Astrology App Mobile UI Kit](https://www.figma.com/community/file/1326199686751139069/advisor-astrology-app-mobile-ui-kit) — described as providing styles, components and variations. Use as a reference for mobile component consistency, not for an unexamined copy of its screens.
4. [Calestial — Astrology & Horoscope Website Design](https://www.figma.com/community/file/1393188926327766162/calestial-astrology-horoscope-website-design) — a customizable homepage template with grouped components. Use the idea of clear section hierarchy and reusable components, not its brand styling.

**Important evidence limitation:** Figma Community page branding extraction reflects Figma's own interface, not the colour or typography of the underlying design file. The preview pages were readable, but their interactive editor files were not opened. No exact template colours, fonts or spacing values are claimed here. The reference pages are used for high-level component and icon direction only.

## Design tokens

| Role | Value | Use |
|---|---|---|
| Manuscript | `#F2ECDD` | Main reading canvas |
| Light folio | `#FAF7EF` | Cards and document surfaces |
| Aged paper | `#E9DFCA` | Secondary panels |
| Forest | `#243D32` | Brand and structural surfaces |
| Deep observatory | `#142A23` | Homepage hero |
| Forest shade | `#1B352B` | Hero depth |
| Antique brass | `#A77E43` | Lines, indices, ornamental detail |
| Warm gold | `#D9B879` | Hero highlights |
| Vermilion | `#793E35` | Small accent only |
| Ink | `#29271F` | Main text |
| Muted ink | `#706B5E` | Supporting text |

Typography: serif display faces for editorial headings and Sanskrit titles; a highly legible sans-serif for controls, metadata and dense tables. Keep Devanagari text on a proper Devanagari-capable font stack.

## Homepage composition

1. Compact Sanskrit/discipline topline.
2. Brand header with desktop navigation and a real mobile menu.
3. Dark observatory hero: original SVG mandala, restrained radial light, concise product statement, and an illustrative North Indian chart folio.
4. Manuscript-coloured discipline ribbon.
5. Traditions selector with an explicit status distinction between live tools and catalogue scope.
6. Live/research/planned product areas.
7. Granthalaya manuscript composition.
8. Research standard: source, settings, worked examples and uncertainty.
9. Dark closing panel and restrained footer.

The hero ornament is an original SVG at `public/patterns/jyotisha-mandala.svg`. It is vector-only and contains no external image, deity depiction, stock photography or remote dependency.

## Interaction and accessibility

- English is the default; Hindi is an explicit language toggle.
- Mobile navigation exposes the same destinations as desktop and reports expanded/collapsed state.
- Focus-visible outlines remain visible.
- Respect `prefers-reduced-motion`.
- Maintain text contrast over the dark hero and do not place essential copy over dense ornament.
- Tabs must expose selected state and preserve keyboard focus.
- Dense chart output should use tables, clear units, explicit calculation settings and responsive horizontal scrolling.
- Do not add an AI assistant panel, generated horoscope copy or generic "AI-powered" marketing claims. The product's value is inspectable calculation, source material and method clarity.

## Product voice

Use short, specific statements grounded in what the application actually does. Prefer:
- "Calculate a Jyotisha chart."
- "Inspect the vargas and graha positions."
- "See the calculation settings."
- "Read the source and edition."

Avoid inflated claims, generic AI language, invented certainty, vague promises and feature lists for engines that are not live. Clearly label Live, Research and Planned work.

## Asset and licensing policy

Do not copy assets from the Figma files into production until the actual file, author attribution, licence and permitted use have been checked. The Boodoo page explicitly says its preview images are not included. Prefer original SVG icons and diagrams for the first implementation; use a single consistent line-art family.

## Responsive acceptance checks

- 1440px desktop: hero remains balanced, chart folio does not collide with copy, mandala stays behind content.
- 900px tablet: both hero columns remain legible or stack without overlap.
- 390px mobile: menu opens/closes, all destinations remain reachable, hero ornament does not obscure copy, CTA fits without horizontal scrolling.
- 320px narrow mobile: no horizontal page overflow.
- Keyboard: menu button and nav links are reachable and visibly focused.
- Reduced motion: no nonessential motion is required to understand the page.
