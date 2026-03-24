import { useAppState }  from './hooks/useAppState.js'
import Sidebar          from './components/Sidebar.jsx'
import TopNav           from './components/TopNav.jsx'
import KpiStrip         from './components/KpiStrip.jsx'
import MapSection       from './components/MapSection.jsx'
import RankingChart     from './components/RankingChart.jsx'
import DataTable        from './components/DataTable.jsx'
import Footer           from './components/Footer.jsx'
import styles           from './App.module.css'

export default function App() {
  const state = useAppState()

  return (
    <div className={styles.shell}>
      <Sidebar state={state} />

      <div className={styles.right}>
        <TopNav
          selectedYear={state.selectedYear}
          regionCount={state.filtered.length}
        />

        <main className={styles.main}>

          {/* Page title — Civqa pattern */}
          <div className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Interreg Dashboard</h1>
            <p className={styles.pageDesc}>
              Regional unemployment rates · Eurostat data · Central &amp; Eastern Europe ·{' '}
              {state.filtered.length} regions · {state.activeCountries.length} countries
            </p>
          </div>

          {/* KPI strip */}
          <KpiStrip
            stats={state.stats}
            euVal={state.euVal}
            selectedYear={state.selectedYear}
          />

          {/* Map + Trend */}
          <section>
            <MapSection state={state} />
          </section>

          {/* Ranking chart */}
          <section>
            <div className="section-header">
              <h2 className="section-title">
                Regional ranking — {state.selectedYear}
              </h2>
            </div>
            <RankingChart
              regions={state.filtered}
              selectedYear={state.selectedYear}
              euVal={state.euVal}
              focusRegionId={state.focusRegionId}
              onSelect={state.setFocusRegionId}
            />
          </section>

          {/* Full data table */}
          <section>
            <div className="section-header">
              <h2 className="section-title">Full data table</h2>
            </div>
            <DataTable
              regions={state.filtered}
              years={state.years}
              selectedYear={state.selectedYear}
              euVal={state.euVal}
              focusRegionId={state.focusRegionId}
              onSelect={state.setFocusRegionId}
            />
          </section>

          <Footer />

        </main>
      </div>
    </div>
  )
}
