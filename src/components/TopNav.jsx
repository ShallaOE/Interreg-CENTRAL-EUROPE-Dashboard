import styles from './TopNav.module.css'

export default function TopNav({ selectedYear, regionCount }) {
  return (
    <header className={styles.topnav}>
      <div className={styles.breadcrumb}>
        <span className={styles.crumbRoot}>Data Room</span>
        <span className={styles.sep}>›</span>
        <span className={styles.crumbCurrent}>Indicators</span>
        <span className={styles.sep}>›</span>
        <span className={styles.crumbPage}>Interreg CENTRAL EUROPE Dashboard</span>
      </div>
      <div className={styles.search}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input placeholder="Search documents, projects…" className={styles.searchInput} />
      </div>
      <div className={styles.right}>
        <span className={styles.yearBadge}>{selectedYear}</span>
        <span className={styles.regionCount}>{regionCount} regions · 9 countries</span>
        <div className={styles.avatar}>OE</div>
      </div>
    </header>
  )
}
