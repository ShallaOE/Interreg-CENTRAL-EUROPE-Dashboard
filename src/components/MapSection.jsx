import { useState, useMemo, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Legend } from 'recharts'
import { geoMercator, geoPath } from 'd3-geo'
import styles from './MapSection.module.css'

const PROG = new Set(["AT11","AT12","AT13","AT21","AT22","AT31","AT32","AT33","AT34","CZ01","CZ02","CZ03","CZ04","CZ05","CZ06","CZ07","CZ08","DE11","DE12","DE13","DE14","DE21","DE22","DE23","DE24","DE25","DE26","DE27","DE30","DE40","DE80","DE91","DED2","DED4","DED5","DEE0","DEG0","HR02","HR03","HR05","HR06","HU11","HU12","HU21","HU22","HU23","HU31","HU32","HU33","ITC1","ITC2","ITC3","ITC4","ITH1","ITH2","ITH3","ITH4","ITH5","PL21","PL22","PL41","PL42","PL43","PL51","PL52","PL61","PL62","PL63","PL71","PL72","PL81","PL82","PL84","PL91","PL92","SI03","SI04","SK01","SK02","SK03","SK04"])
const BREAKS=[[0,'#4CAF50'],[2,'#81C784'],[4,'#FFF176'],[6,'#FFB74D'],[8,'#EF5350'],[11,'#B71C1C']]
function rateColor(v){if(v==null)return '#C8D8E8';for(let i=BREAKS.length-1;i>=0;i--)if(v>=BREAKS[i][0])return BREAKS[i][1];return BREAKS[0][1]}

const CCOLORS={AT:'#E63946',CZ:'#2A9D8F',DE:'#E9C46A',HR:'#F4A261',HU:'#A8DADC',IT:'#457B9D',PL:'#1D3557',SI:'#8338EC',SK:'#FB5607'}
const RCOLORS=['#E63946','#2A9D8F','#E9C46A','#F4A261','#A8DADC','#457B9D','#8338EC','#FB5607','#06B6D4','#84CC16']

const MAP_W=580, MAP_H=430
let _geo=null
async function loadGeo(){
  if(_geo)return _geo
  const b='/Interreg-CENTRAL-EUROPE-Dashboard'
  const[n,c]=await Promise.all([fetch(`${b}/nuts2_ce.geojson`).then(r=>r.json()),fetch(`${b}/eu_countries.geojson`).then(r=>r.json())])
  n.features=n.features.filter(f=>PROG.has(f.properties.NUTS_ID))
  const proj=geoMercator().fitExtent([[16,16],[MAP_W-36,MAP_H-16]],n)
  const pg=geoPath().projection(proj)
  _geo={regions:n.features.map(f=>({id:f.properties.NUTS_ID,d:pg(f)})),countries:c.features.map(f=>({id:f.properties.NUTS_ID||f.properties.id,d:pg(f)}))}
  return _geo
}

export default function MapSection({state}){
  const {filtered,selectedYear,eu27,years,focusRegionId,setFocusRegionId,focusRegionObjects,activeCountries}=state
  const mapRef=useRef(null)
  const [tooltip,setTooltip]=useState(null)
  const [geo,setGeo]=useState({regions:[],countries:[]})
  const [minRate,setMinRate]=useState(0)
  const [maxRate,setMaxRate]=useState(12)

  useEffect(()=>{loadGeo().then(setGeo)},[])
  useEffect(()=>{
    const rates=filtered.map(r=>r.series[selectedYear]).filter(v=>v!=null)
    if(rates.length){setMinRate(Math.min(...rates));setMaxRate(Math.max(...rates))}
  },[filtered,selectedYear])

  const lu=useMemo(()=>{const m={};filtered.forEach(r=>{m[r.id]=r});return m},[filtered])

  const hasFocus = focusRegionObjects.length > 0

  const trendData=useMemo(()=>years.map(y=>{
    const row={year:y,'EU27 avg':eu27[y]}
    const allRates=filtered.map(r=>r.series[y]).filter(v=>v!=null)
    row['Regional avg']=allRates.length?+(allRates.reduce((a,b)=>a+b,0)/allRates.length).toFixed(2):null

    if(hasFocus){
      // Show selected regions
      focusRegionObjects.forEach(r=>{ row[r.id]=r.series[y]??null })
    } else {
      // Show country averages
      activeCountries.forEach(c=>{
        const rates=filtered.filter(r=>r.country===c).map(r=>r.series[y]).filter(v=>v!=null)
        if(rates.length) row[c]=+(rates.reduce((a,b)=>a+b,0)/rates.length).toFixed(2)
      })
    }
    return row
  }),[filtered,years,eu27,focusRegionObjects,activeCountries,hasFocus])

  const onMove=(e,id)=>{
    const r=lu[id];if(!r||!mapRef.current)return
    const rect=mapRef.current.getBoundingClientRect()
    setTooltip({x:e.clientX-rect.left,y:e.clientY-rect.top,id,name:r.name,country:r.countryName,rate:r.series[selectedYear]})
  }

  return(
    <div className={styles.grid}>
      <div className={`card ${styles.mapCard}`}>
        <div className={`section-header ${styles.cardHead}`}>
          <span className="section-title">Regional map</span>
        </div>
        <div className={styles.mapBody} ref={mapRef} onMouseLeave={()=>setTooltip(null)}>
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className={styles.svg}>
            {geo.countries.map(({id,d})=><path key={`c-${id}`} d={d} fill="#E8ECF0" stroke="#fff" strokeWidth={0.8}/>)}
            {geo.regions.map(({id,d})=>{
              const r=lu[id],rate=r?.series[selectedYear]??null,isFocus=id===focusRegionId
              return(<path key={`r-${id}`} d={d}
                fill={r?rateColor(rate):'#C8D8E8'} stroke="white"
                strokeWidth={isFocus?2.5:0.4}
                opacity={hasFocus&&!focusRegionObjects.find(f=>f.id===id)?0.4:1}
                style={{cursor:r?'pointer':'default',transition:'opacity 0.12s'}}
                onClick={()=>r&&setFocusRegionId(id)}
                onMouseMove={e=>r&&onMove(e,id)}/>)
            })}
          </svg>
          {tooltip&&(
            <div className={styles.tooltip} style={{left:Math.min(tooltip.x+14,MAP_W-160),top:Math.max(tooltip.y-60,4)}}>
              <div className={styles.ttName}>{tooltip.name}</div>
              <div className={styles.ttCode}>{tooltip.id} · {tooltip.country}</div>
              <div className={styles.ttRate}>{tooltip.rate!=null?tooltip.rate.toFixed(1)+'%':'n/a'}</div>
            </div>
          )}
          <div className={styles.colorBar}>
            <span className={styles.colorBarMax}>{maxRate.toFixed(1)}%</span>
            <div className={styles.colorBarGrad}/>
            <span className={styles.colorBarMin}>{minRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className={`card ${styles.trendCard}`}>
        <div className={`section-header ${styles.cardHead}`}>
          <span className="section-title">Trend over time</span>
        </div>
        <div className={styles.trendBody}>
          <div className={styles.trendNote}>
            {hasFocus
              ? `${focusRegionObjects.map(r=>r.id).join(', ')} vs EU27 avg & Regional avg`
              : 'Country averages + EU27 avg + Regional avg — select regions for detail'
            }
          </div>
          <LineChart width={420} height={390} data={trendData} margin={{top:8,right:16,bottom:0,left:0}}>
            <XAxis dataKey="year" tick={{fontSize:10,fill:'var(--text-3)',fontFamily:'var(--font)'}} tickLine={false} axisLine={false} interval={1}/>
            <YAxis tick={{fontSize:10,fill:'var(--text-3)',fontFamily:'var(--font)'}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`} width={36} domain={['auto','auto']}/>
            <Tooltip formatter={(v,n)=>[v!=null?`${v.toFixed(1)}%`:'n/a',n]} contentStyle={{fontFamily:'var(--font)',fontSize:11,border:'1px solid var(--border)',borderRadius:'var(--r-m)'}}/>
            <Legend wrapperStyle={{fontSize:9,fontFamily:'var(--font)',paddingTop:6}} formatter={v=><span style={{color:'var(--text-2)'}}>{v}</span>}/>
            <ReferenceLine x={selectedYear} stroke="var(--violet)" strokeDasharray="3 3" strokeWidth={1}/>

            {/* Always visible — dashed */}
            <Line dataKey="EU27 avg" stroke="#5B4FCF" strokeWidth={2} strokeDasharray="6 3" dot={false} name="EU27 avg"/>
            <Line dataKey="Regional avg" stroke="#888" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Regional avg"/>

            {/* Default: country lines */}
            {!hasFocus && activeCountries.map(c=>(
              <Line key={c} dataKey={c} stroke={CCOLORS[c]||'#888'} strokeWidth={1.8}
                dot={{r:2,fill:CCOLORS[c]||'#888'}} name={c} connectNulls/>
            ))}

            {/* Focus: selected region lines */}
            {hasFocus && focusRegionObjects.map((r,i)=>(
              <Line key={r.id} dataKey={r.id}
                stroke={RCOLORS[i%RCOLORS.length]} strokeWidth={2.5}
                dot={{r:3,fill:RCOLORS[i%RCOLORS.length]}}
                name={`${r.id} ${r.name}`} connectNulls/>
            ))}
          </LineChart>
        </div>
      </div>
    </div>
  )
}
