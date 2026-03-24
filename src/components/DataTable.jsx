import { useState, useMemo } from 'react'
import styles from './DataTable.module.css'

const PAGE = 10

export default function DataTable({ regions, years, selectedYear, euVal, focusRegionId, onSelect }) {
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [sortKey, setSortKey] = useState(selectedYear)
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
    setPage(1)
  }

  const arrow = (key) => {
    if (sortKey !== key) return <span className={styles.sortIcon}>↕</span>
    return <span className={styles.sortIcon}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const sorted = useMemo(() => {
    let rows = regions
      .map(r => {
        const rate = r.series[selectedYear]
        const prev = r.series[String(+selectedYear-1)]
        const yoy  = rate!=null&&prev!=null ? +(rate-prev).toFixed(1) : null
        return { ...r, rate, yoy }
      })
      .filter(r =>
        !search ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.countryName.toLowerCase().includes(search.toLowerCase())
      )

    rows.sort((a,b) => {
      let av, bv
      if (sortKey === 'name')    { av=a.name;        bv=b.name }
      else if (sortKey === 'id') { av=a.id;           bv=b.id }
      else if (sortKey === 'country') { av=a.countryName; bv=b.countryName }
      else if (sortKey === 'yoy') { av=a.yoy??-999;  bv=b.yoy??-999 }
      else { av=a.series[sortKey]??-999; bv=b.series[sortKey]??-999 }

      if (typeof av === 'string') return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir==='asc' ? av-bv : bv-av
    })

    return rows.map((r,i) => ({ ...r, rank: i+1 }))
  }, [regions, selectedYear, search, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE)
  const paged      = sorted.slice((page-1)*PAGE, page*PAGE)

  const Th = ({ k, label, cls }) => (
    <th className={`${cls||''} ${styles.th} ${sortKey===k?styles.thActive:''}`}
      onClick={() => handleSort(k)}>
      {label} {arrow(k)}
    </th>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search region, code, country…"
            value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
            className={styles.searchInput}/>
          {search && <button className={styles.clearBtn} onClick={()=>{setSearch('');setPage(1)}}>×</button>}
        </div>
        <div className={styles.showing}>{sorted.length} regions · click column header to sort</div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{width:40}}>#</th>
              <Th k="id"      label="Code"    />
              <Th k="name"    label="Region"  />
              <Th k="country" label="Country" />
              <Th k={selectedYear} label={`${selectedYear} rate`} cls={styles.thNum}/>
              <Th k="yoy"     label="Δ yoy"   cls={styles.thNum}/>
              {years.map(y => <Th key={y} k={y} label={y} cls={styles.thYear}/>)}
            </tr>
          </thead>
          <tbody>
            {paged.map(r => {
              const isFocus = r.id === focusRegionId
              return (
                <tr key={r.id}
                  className={`${styles.row} ${isFocus?styles.rowFocus:''}`}
                  onClick={()=>onSelect(r.id===focusRegionId?null:r.id)}>
                  <td className={styles.tdRank}>{r.rank}</td>
                  <td><span className={styles.code}>{r.id}</span></td>
                  <td className={styles.tdName}>{r.name}</td>
                  <td><span className={styles.country}>{r.countryName}</span></td>
                  <td className={styles.tdRate}>{r.rate!=null?r.rate.toFixed(1)+'%':'—'}</td>
                  <td className={styles.tdYoy}>
                    {r.yoy!=null
                      ? <span className={r.yoy<0?styles.better:r.yoy>0?styles.worse:''}>
                          {r.yoy>0?'+':''}{r.yoy.toFixed(1)}
                        </span>
                      : '—'}
                  </td>
                  {years.map(y=>(
                    <td key={y} className={styles.tdSeries}>
                      {r.series[y]!=null?r.series[y].toFixed(1):'—'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>Page {page} of {totalPages} · {sorted.length} regions</span>
        <div className={styles.pageBtns}>
          <button className={styles.pageBtn} disabled={page===1} onClick={()=>setPage(1)}>«</button>
          <button className={styles.pageBtn} disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
          {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
            const p = Math.max(1,Math.min(page-2,totalPages-4))+i
            return p<=totalPages
              ? <button key={p} className={`${styles.pageBtn} ${p===page?styles.pageBtnActive:''}`}
                  onClick={()=>setPage(p)}>{p}</button>
              : null
          })}
          <button className={styles.pageBtn} disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
          <button className={styles.pageBtn} disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
        </div>
      </div>
    </div>
  )
}
