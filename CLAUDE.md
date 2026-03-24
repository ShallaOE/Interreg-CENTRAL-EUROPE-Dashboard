# CLAUDE.md — Interreg Dashboard
> Istruzioni per Claude Code nel Codespace

## Setup iniziale

```bash
npm install
npm run dev
# apri http://localhost:5173
```

## Deploy su GitHub Pages

```bash
# 1. Crea repo GitHub (es: interreg-dashboard)
# 2. Aggiorna base in vite.config.js con il nome del repo:
#    base: '/interreg-dashboard/'
# 3. Push del codice
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/TUO-USERNAME/interreg-dashboard.git
git push -u origin main

# 4. Deploy
npm run deploy
# → pubblica su https://TUO-USERNAME.github.io/interreg-dashboard/
```

## Struttura progetto

```
src/
├── data/
│   └── data.js          ← 81 regioni NUTS2, dati Eurostat 2015-2024
├── hooks/
│   └── useAppState.js   ← stato globale (anno, paesi, focus region)
├── components/
│   ├── Sidebar.jsx/.css ← nav + filtri (dark violet, Civqa style)
│   ├── TopNav.jsx/.css  ← breadcrumb + search + year badge
│   ├── KpiStrip.jsx     ← 4 KPI cards
│   ├── MapSection.jsx   ← mappa hex tiles + trend chart
│   ├── RankingChart.jsx ← bar chart orizzontale tutte regioni
│   ├── DataTable.jsx    ← tabella completa con paginazione
│   └── Footer.jsx
├── App.jsx              ← orchestrazione layout
└── index.css            ← OE design tokens
```

## Design system

Colori principali dal DS OE / Civqa mockup:
- `--violet: #5B4FCF`       — bottoni, elementi attivi
- `--violet-dark: #3D2B8E`  — sidebar, header accenti
- `--violet-light: #EEF0FD` — sfondi pills, hover states
- Sidebar bg: `#1A1730`     — dark violet-black

Font: `Atkinson Hyperlegible Next` (sans) + `Atkinson Hyperlegible Mono` (numeri)

## Se vuoi aggiungere confini NUTS2 reali

```bash
# Esegui localmente (richiede internet)
pip install requests
python download_nuts2_for_flourish.py
# → genera nuts2_interreg_ce.geojson
```

Poi sostituisci la mappa SVG con hex tiles in `MapSection.jsx`
usando D3 + il GeoJSON scaricato.

## Dati

File sorgente: `Interreg_NUTS2_Unemployment_Rate_.xlsx`
Aggiornare `src/data/data.js` rieseguendo:
```bash
python3 build_data.py
```
