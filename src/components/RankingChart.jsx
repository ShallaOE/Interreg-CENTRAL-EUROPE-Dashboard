import { useMemo, useState } from 'react'
import styles from './RankingChart.module.css'

const CCOLORS = {
  AT:'#E63946',CZ:'#2A9D8F',DE:'#E9C46A',HR:'#F4A261',
  HU:'#A8DADC',IT:'#457B9D',PL:'#1D3557',SI:'#8338EC',SK:'#FB5607',
}
const TABS = ['All regions','Top 20','Bottom 20']

export default function RankingChart({ regions, selectedYear, euVal, focusRegionId, onSelect }) {
  const [tab, setTab] = useState('All regions')

  const sorted = useMemo(() =>
    regions.map(r => ({ ...r, rate: r.series[selectedYear] }))
      .filter(r => r.rate != null)
      .sort((a,b) => b.rate - a.rate),
    [regions, selectedYear]
  )

  const displayed = useMemo(() => {
    if (tab === 'Top 20')    return sorted.slice(0, 20)
    if (tab === 'Bottom 20') return sorted.slice(-20).reverse()
    return sorted
  }, [sorted, tab])

  const barMax = Math.ceil((sorted[0]?.rate ?? 12) * 1.1)
  const euPct  = (euVal / barMax) * 100

  return (
    <div className={styles.wrap}>
      {/* Tab group — Civqa style */}
      <div className="tab-group" style={{ marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t}
            className={`tab-pill ${tab===t ? 'active' : ''}`}
            onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className={styles.chart}>
        {/* EU27 reference line */}
        <div className={styles.euLine} style={{ left: `calc(160px + ${euPct}% * (100% - 160px - 60px) / 100)` }}>
          <div className={styles.euLabel}>EU27 {euVal.toFixed(1)}%</div>
        </div>

        {displayed.map((r) => {
          const pct = (r.rate / barMax) * 100
          const isFocus = r.id === focusRegionId
          return (
            <div key={r.id}
              className={`${styles.row} ${isFocus ? styles.rowFocus : ''}`}
              onClick={() => onSelect(r.id === focusRegionId ? null : r.id)}>
              <div className={styles.rowLabel}>
                <span className={styles.code}>{r.id}</span>
                <span className={styles.name}> — {r.name}</span>
              </div>
              <div className={styles.barArea}>
                <div className={styles.bar}
                  style={{ width:`${pct}%`, background: CCOLORS[r.country]||'#888' }} />
                <span className={styles.barVal}>{r.rate.toFixed(1)}%</span>
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.foot}>
        {displayed.length} regioni · clicca una barra per evidenziarla sulla mappa
      </div>
    </div>
  )
}
