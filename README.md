# Interreg Central Europe — Territorial Analysis Dashboard

**OpenEconomics · 2026**

An open-access interactive dashboard for the territorial monitoring of the **Interreg Central Europe** programme area. Built by [OpenEconomics](https://openeconomics.net) to support evidence-based regional analysis across the 9 participating countries and 81 NUTS2 regions.

🔗 **Live:** https://RS-OpenEconomics.github.io/Interreg-CENTRAL-EUROPE-Dashboard/

---

## What it does

Transforms Eurostat regional statistics into an interactive, explorable environment accessible to all programme stakeholders — no technical background required.

- **Choropleth map** — real NUTS2 boundaries from Eurostat GISCO, coloured by indicator value
- **Year slider** — annual data 2015–2024, all panels update simultaneously
- **Country & region filters** — multi-select with focus region highlighting
- **KPI strip** — programme area average, highest/lowest region, EU27 benchmark
- **Trend chart** — country averages, EU27 reference line, selected region overlay
- **Regional ranking** — all 81 regions sorted by value with year-on-year change
- **Data table** — full sortable, searchable dataset with complete time series

---

## Current indicator

| Indicator | Source | Geography | Period |
|---|---|---|---|
| Unemployment rate (%) | Eurostat · lfst_r_lfu3rt | NUTS 2 · 81 regions | 2015–2024 |

Additional thematic indicators are in development.

---

## Roadmap

| Version | Description | Status |
|---|---|---|
| v1 | Unemployment rate prototype — map, trend, ranking, table | ✅ Live |
| v2 | Multi-indicator platform — demography, innovation, environment, connectivity, labour market, cultural heritage, housing, governance | 🔜 Planned |
| v3 | Stakeholder survey integration — georeferenced consultation results overlaid with territorial indicators | 🔜 Planned |
| v4 | Geographic extension to Ukrainian oblasts bordering the programme area, subject to data availability | 🔜 Conditional |

---

## Design System

This project implements the **OpenEconomics Design System 2.0** (Figma file key: `ULFrjRJzopTyLKczdJLJkn`, extracted 13/03/2026).

### Fonts

| Token | Value | Usage |
|---|---|---|
| `--font-family-0` | `'Atkinson Hyperlegible Mono'` | Numbers, codes, data values |
| `--font-family-1` | `'Atkinson Hyperlegible Next'` | All body and UI text |
| `--font-family-2` | `'Hedvig Letters Serif'` | Editorial / display headings |

Atkinson Hyperlegible is specifically designed for accessibility — optimised for users with low vision and dyslexia.

### Typography scale

| Style | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| Heading Desktop H1 | 32px | 700 | 35.2px | Page titles |
| Heading Desktop H2 | 28px | 600 | 30.8px | Section titles |
| Heading Desktop H3 | 24px | 600 | 26.4px | Card titles |
| Heading Desktop H4 | 20px | 500 | 22px | Sub-section labels |
| Heading Desktop H5 | 18px | 500 | 19.8px | Component labels |
| Heading Desktop H6 | 16px | 500 | 19.2px | Small labels |
| Body Text L | 24px | 400 | 31.2px | Lead paragraphs |
| Body Text M | 18px | 400 | 23.4px | Standard body |
| Body Text S | 16px | 400 | 20.8px | Secondary body |
| Caption XS | 14px | 400 | 18.2px | Captions, metadata |
| Caption XXS | 12px | 400 | 15.6px | Fine print, footnotes |
| Number Text XL | 32px | 400–700 | 41.6px | KPI values |
| Number Text L | 24px | 400–700 | 31.2px | Chart values |
| Number Text M | 18px | 400–700 | 23.4px | Table numbers |
| Number Text S | 16px | 400–700 | 20.8px | Small data labels |
| Number Text XS | 14px | 400–700 | 18.2px | Axis ticks |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-s` | `0px 4px 4px 0px rgba(0,0,0,0.15)` | Cards, tooltips, badges |
| `--shadow-m` | `0px 8px 16px 0px rgba(0,0,0,0.15)` | Panels, dropdowns, interactive cards |
| `--shadow-l` | `0px 16px 48px 0px rgba(0,0,0,0.15)` | Modals, floating panels, elevated layers |

### Colour tokens (dashboard implementation)

```css
/* Brand */
--violet:        #5B4FCF;   /* primary — buttons, active states, section dividers */
--violet-dark:   #3D2B8E;   /* sidebar background, deep accents */
--violet-light:  #EEF0FD;   /* backgrounds, hover states, badges */
--violet-border: #C5BFEE;   /* borders on violet elements */

/* Surfaces */
--bg:            #F5F4F0;   /* page background */
--surface:       #FFFFFF;   /* cards, panels */
--surface-2:     #FAFAF8;   /* subtle card backgrounds */

/* Text */
--text:          #111110;
--text-2:        rgba(17,17,16,0.55);
--text-3:        rgba(17,17,16,0.35);

/* Borders */
--border:        rgba(17,17,16,0.08);
--border-md:     rgba(17,17,16,0.15);

/* Status */
--green:         #15803D;   --green-bg:  #DCFCE7;
--red:           #B91C1C;   --red-bg:    #FEE2E2;
--amber:         #B45309;   --amber-bg:  #FEF3C7;
```

### Choropleth colour scale

Green = low (positive) → Red = high (critical). Legend always shows actual min/max values of the current dataset.

```
0%  → #4CAF50
2%  → #81C784
4%  → #FFF176
6%  → #FFB74D
8%  → #EF5350
11% → #B71C1C
```

---

## Accessibility — WCAG 2.1 AA

This project targets **WCAG 2.1 Level AA** compliance. All contributions must respect the following requirements.

### Colour & Contrast
- Body text: minimum **4.5:1** contrast ratio against background
- Large text (18px+ regular or 14px+ bold): minimum **3:1**
- The choropleth scale is never the sole means of conveying data — values are always accessible via tooltips, legend, and data table
- Red/green distinctions include supplementary cues (numeric labels, icons)

### Keyboard Navigation
- All interactive elements fully operable via keyboard (Tab, Enter, Arrow keys, Escape)
- Logical, predictable focus order throughout
- Visible focus indicators on all focusable elements — `outline: none` without a visible replacement is not permitted

### Screen Readers & Semantic Markup
- All SVG map elements include `role="img"` and descriptive `aria-label`
- Form controls have associated `<label>` elements
- Data tables use `<th scope="col|row">` throughout
- Page uses semantic landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`
- Dynamic content updates announced via `aria-live` regions

### Typography & Zoom
- Minimum body font size: 14px
- Page fully usable at 200% browser zoom
- Line height minimum 1.5× font size for body text
- No text rendered as images

### Interactive Components
- Sliders expose `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- Tooltip content accessible via keyboard focus, not hover-only
- All chart data available in the sortable data table as a non-visual alternative

### Testing

```bash
# Automated audit — run before each deploy
npm install -g @axe-core/cli
axe https://RS-OpenEconomics.github.io/Interreg-CENTRAL-EUROPE-Dashboard/ --tags wcag2aa
```

Manual checklist before each release:
- [ ] Full keyboard-only navigation (no mouse)
- [ ] Screen reader: NVDA (Windows) or VoiceOver (Mac/iOS)
- [ ] Browser zoom at 200% and 400%
- [ ] Windows High Contrast / `forced-colors` mode
- [ ] Colour blindness simulation (Deuteranopia, Protanopia)

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 18.3 |
| Build tool | Vite | 5.3 |
| Charts | Recharts | 2.12 |
| Map projection | D3-geo | 3.x |
| Map boundaries | Eurostat GISCO GeoJSON | 2021 edition |
| Styling | CSS Modules | — |
| Deploy | gh-pages | 6.x |

---

## Project structure

```
src/
├── data/
│   └── data.js              ← NUTS2 regions + Eurostat time series
├── hooks/
│   └── useAppState.js       ← global state: year, countries, focus regions
├── components/
│   ├── Sidebar.jsx          ← navigation + filter controls
│   ├── TopNav.jsx           ← breadcrumb + search bar
│   ├── KpiStrip.jsx         ← headline KPI cards
│   ├── MapSection.jsx       ← D3 choropleth map + trend chart
│   ├── RankingChart.jsx     ← regional ranking bar chart
│   ├── DataTable.jsx        ← sortable, searchable data table
│   └── Footer.jsx
├── App.jsx
└── index.css                ← OE Design System tokens
public/
├── nuts2_ce.geojson         ← NUTS2 boundaries (Eurostat GISCO, LEVL_2, 20M, 2021)
└── eu_countries.geojson     ← EU country outlines (NUTS LEVL_0)
```

---

## Local development

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build
npm run deploy     # → GitHub Pages
```

### Updating the dataset
1. Replace the source Excel file in the project root
2. Run `python3 build_data.py` to regenerate `src/data/data.js`
3. Commit and run `npm run deploy`

---

## Data sources

| Dataset | Source | Licence |
|---|---|---|
| Unemployment rate | Eurostat · lfst_r_lfu3rt | [Eurostat reuse policy](https://ec.europa.eu/eurostat/about-us/policies/copyright) |
| NUTS2 boundaries | Eurostat GISCO · 2021 · 20M | [GISCO reuse policy](https://ec.europa.eu/eurostat/web/gisco) |
| EU country outlines | Eurostat GISCO · NUTS level 0 | [GISCO reuse policy](https://ec.europa.eu/eurostat/web/gisco) |

---

*Built by [OpenEconomics](https://openeconomics.eu) · 2026*