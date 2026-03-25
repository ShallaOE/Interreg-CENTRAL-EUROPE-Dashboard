import styles from './Sidebar.module.css'

export default function Sidebar({ state }) {
  const { years, selectedYear, setSelectedYear,
          countries, activeCountries, setActiveCountries,
          focusRegions, setFocusRegions, filtered } = state

  const toggleCountry = (code) => {
    if (activeCountries.includes(code)) {
      if (activeCountries.length > 1)
        setActiveCountries(activeCountries.filter(c => c !== code))
    } else {
      setActiveCountries([...activeCountries, code])
    }
  }

  const toggleRegion = (id) => {
    setFocusRegions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const clearRegions = () => setFocusRegions([])

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoMark}>OE</div>
        <div>
          <div className={styles.logoName}>Interreg CENTRAL EUROPE</div>
          <div className={styles.logoSub}>Dashboard</div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.filtersArea}>

        <div className={styles.filterLabel}>Reference year</div>
        <div className={styles.yearNum}>{selectedYear}</div>
        <input type="range" className={styles.slider}
          min={0} max={years.length - 1}
          value={years.indexOf(selectedYear)}
          onChange={e => setSelectedYear(years[+e.target.value])} />
        <div className={styles.yearBounds}>
          <span>{years[0]}</span><span>{years[years.length-1]}</span>
        </div>

        <div className={styles.filterLabel} style={{marginTop:18}}>Countries</div>
        <div className={styles.pillList}>
          {countries.map(c => {
            const on = activeCountries.includes(c.code)
            return (
              <button key={c.code}
                className={`${styles.pill} ${on ? styles.pillOn : styles.pillOff}`}
                onClick={() => toggleCountry(c.code)}>
                <span className={styles.pillCode}>{c.code}</span>
                <span className={styles.pillName}>{c.name}</span>
                {on && <span className={styles.pillX}>×</span>}
              </button>
            )
          })}
        </div>
        <button className={styles.allBtn}
          onClick={() => setActiveCountries(countries.map(c => c.code))}>
          Select all
        </button>

        <div className={styles.filterLabel} style={{marginTop:18}}>
          Focus regions
          {focusRegions.length > 0 && (
            <button className={styles.clearBtn} onClick={clearRegions}>
              Clear ({focusRegions.length})
            </button>
          )}
        </div>
        <div className={styles.regionList}>
          {[...filtered].sort((a,b) => a.name.localeCompare(b.name)).map(r => {
            const on = focusRegions.includes(r.id)
            return (
              <button key={r.id}
                className={`${styles.regionItem} ${on ? styles.regionOn : ''}`}
                onClick={() => toggleRegion(r.id)}>
                <span className={`${styles.regionCheck} ${on ? styles.regionCheckOn : ''}`}>
                  {on ? '✓' : ''}
                </span>
                <span className={styles.regionCode}>{r.id}</span>
                <span className={styles.regionName}>{r.name}</span>
              </button>
            )
          })}
        </div>

      </div>

      <div className={styles.spacer} />
      <div className={styles.sourceNote}>
        Source: Eurostat · lfst_r_lfu3rt<br/>
        NUTS 2 · Annual 2015–2024
      </div>
    </aside>
  )
}
