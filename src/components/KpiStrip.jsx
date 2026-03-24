import styles from './KpiStrip.module.css'

export default function KpiStrip({ stats, euVal, selectedYear }) {
  if (!stats) return null
  const gap = stats.avg - euVal

  const cards = [
    {
      label: 'REGIONAL AVERAGE',
      value: stats.avg.toFixed(1) + '%',
      sub: `${stats.count} regions · 9 countries`,
      delta: (gap > 0 ? '+' : '') + gap.toFixed(1) + ' pp',
      deltaOk: gap <= 0,
    },
    {
      label: 'HIGHEST RATE',
      value: stats.max.toFixed(1) + '%',
      sub: stats.maxRegion?.name || '—',
      delta: '+' + (stats.max - euVal).toFixed(1) + ' pp',
      deltaOk: false,
    },
    {
      label: 'LOWEST RATE',
      value: stats.min.toFixed(1) + '%',
      sub: stats.minRegion?.name || '—',
      delta: (stats.min - euVal).toFixed(1) + ' pp',
      deltaOk: true,
    },
    {
      label: 'EU27 BENCHMARK',
      value: euVal.toFixed(1) + '%',
      sub: `Regional avg gap: ${gap > 0 ? '+' : ''}${gap.toFixed(1)} pp`,
      delta: (gap > 0 ? '+' : '') + gap.toFixed(1) + ' pp',
      deltaOk: gap <= 0,
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map((c, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.label}>{c.label}</div>
          <div className={styles.value}>{c.value}</div>
          <div className={styles.sub}>{c.sub}</div>
          <div className={`${styles.delta} ${c.deltaOk ? styles.green : styles.red}`}>
            {c.delta}
          </div>
        </div>
      ))}
    </div>
  )
}
