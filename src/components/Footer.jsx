import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        <strong>OpenEconomics</strong> · Interreg Central Europe · Labour Market Monitor
      </span>
      <span>
        Source: Eurostat · lfst_r_lfu3rt · NUTS 2 · Annual 2015–2024 · Updated Jan 2025
      </span>
    </footer>
  )
}
