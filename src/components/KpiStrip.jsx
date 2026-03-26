import styles from './KpiStrip.module.css'

export default function KpiStrip({ stats, euVal, selectedYear }) {
  if (!stats) return null
  const gap = stats.avg - euVal  // negative = programme below EU27 (good)

  const cards = [
    {
      label: 'REGIONAL AVERAGE',
      value: stats.avg.toFixed(1) + '%',
      sub: `${stats.count} regions · 9 countries`,
      delta: (gap > 0 ? '+' : '') + gap.toFixed(1) + ' pp vs EU27',
      deltaOk: gap <= 0,
    },
    {
      label: 'HIGHEST RATE',
      value: stats.max.toFixed(1) + '%',
      sub: stats.maxRegion?.name || '—',
      delta: '+' + (stats.max - euVal).toFixed(1) + ' pp vs EU27',
      deltaOk: false,
    },
    {
      label: 'LOWEST RATE',
      value: stats.min.toFixed(1) + '%',
      sub: stats.minRegion?.name || '—',
      delta: (stats.min - euVal).toFixed(1) + ' pp vs EU27',
      deltaOk: true,
    },
    {
      label: 'EU27 BENCHMARK',
      value: euVal.toFixed(1) + '%',
      sub: `EU27 reference · ${selectedYear}`,
      // gap from EU27's perspective: if regional avg is BELOW EU27, gap is positive for EU27
      delta: (gap <= 0 ? '+' : '') + (gap <= 0 ? (-gap).toFixed(1) : gap.toFixed(1)) + ' pp gap vs Regional avg',
      deltaOk: gap <= 0, // green if regional avg is below EU27
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
