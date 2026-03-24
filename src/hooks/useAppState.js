import { useState, useMemo } from 'react'
import { DATA } from '../data/data.js'

export function useAppState() {
  const allCountryCodes = DATA.countries.map(c => c.code)
  const [selectedYear,    setSelectedYear]    = useState('2024')
  const [activeCountries, setActiveCountries] = useState(allCountryCodes)
  const [focusRegions,    setFocusRegions]    = useState([]) // array — multi-select

  const filtered = useMemo(
    () => DATA.regions.filter(r => activeCountries.includes(r.country)),
    [activeCountries]
  )

  const euVal = DATA.eu27[selectedYear]

  const stats = useMemo(() => {
    const rates = filtered.map(r => r.series[selectedYear]).filter(v => v != null)
    if (!rates.length) return null
    const avg = rates.reduce((a,b) => a+b, 0) / rates.length
    const max = Math.max(...rates)
    const min = Math.min(...rates)
    return {
      avg, max, min, count: rates.length,
      maxRegion: filtered.find(r => r.series[selectedYear] === max),
      minRegion: filtered.find(r => r.series[selectedYear] === min),
    }
  }, [filtered, selectedYear])

  const focusRegionObjects = useMemo(
    () => focusRegions.map(id => DATA.regions.find(r => r.id === id)).filter(Boolean),
    [focusRegions]
  )

  // Keep single focusRegionId for map highlight (first selected)
  const focusRegionId = focusRegions[0] || null
  const setFocusRegionId = (id) => {
    if (!id) setFocusRegions([])
    else setFocusRegions(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  return {
    selectedYear, setSelectedYear,
    activeCountries, setActiveCountries,
    focusRegions, setFocusRegions,
    focusRegionId, setFocusRegionId,
    focusRegionObjects,
    filtered, euVal, stats,
    years: DATA.years,
    countries: DATA.countries,
    eu27: DATA.eu27,
    allRegions: DATA.regions,
  }
}
