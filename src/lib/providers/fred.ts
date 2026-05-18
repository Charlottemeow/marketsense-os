import type { DataProvider, RateLimitConfig, FetchLatestResult, FetchHistoricalResult } from './types'
import type { MacroSeries, MacroObservation } from '@/types/macro'
import { FRED_SERIES } from '@/lib/constants'

interface FREDObservation {
  date: string
  value: string
}

export class FREDProvider implements DataProvider<MacroSeries> {
  name = 'FRED'
  rateLimit: RateLimitConfig = { maxRequests: 120, windowMs: 60000 }

  private apiKey: string

  constructor() {
    this.apiKey = process.env.FRED_API_KEY || ''
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0
  }

  private async fetchFromApi(path: string): Promise<any> {
    const baseUrl = 'https://api.stlouisfed.org/fred'
    const separator = path.includes('?') ? '&' : '?'
    const url = `${baseUrl}${path}${separator}api_key=${this.apiKey}&file_type=json`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`)
    }
    return response.json()
  }

  async fetchLatest(): Promise<FetchLatestResult<MacroSeries>> {
    if (!this.isAvailable()) {
      return {
        data: FRED_SERIES.map((s, i) => this.makeMockSeries(s, i)),
        source: 'fred',
        sourceLabel: 'FRED (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const seriesList: MacroSeries[] = []
      for (const s of FRED_SERIES.slice(0, 10)) {
        try {
          const data = await this.fetchFromApi(`/series/observations?series_id=${s.code}&sort_order=desc&limit=1`)
          if (data.observations?.length) {
            seriesList.push(this.buildSeries(s, data.observations[0], data.observations))
          }
        } catch {
          continue
        }
        await new Promise(r => setTimeout(r, 100))
      }

      return {
        data: seriesList,
        source: 'fred',
        sourceLabel: 'FRED',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: FRED_SERIES.map((s, i) => this.makeMockSeries(s, i)),
        source: 'fred',
        sourceLabel: 'FRED (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async fetchSeries(seriesCode: string): Promise<{
    series: MacroSeries | null
    source: string
    sourceLabel: string
    isMock: boolean
  }> {
    if (!this.isAvailable()) {
      const def = FRED_SERIES.find(s => s.code === seriesCode)
      if (def) {
        return {
          series: {
            id: `${seriesCode}-mock`,
            fred_code: seriesCode,
            name: def.name,
            category: def.category as any,
            unit: def.unit,
            frequency: def.frequency as any,
            seasonally_adjusted: false,
            last_updated: new Date().toISOString(),
            description: def.description,
          },
          source: 'fred',
          sourceLabel: 'FRED (mock)',
          isMock: true,
        }
      }
      return { series: null, source: 'fred', sourceLabel: 'FRED (mock)', isMock: true }
    }

    try {
      const data = await this.fetchFromApi(`/series/observations?series_id=${seriesCode}&sort_order=desc&limit=1`)
      const obs = data.observations?.[0]
      const def = FRED_SERIES.find(s => s.code === seriesCode)

      const series: MacroSeries = {
        id: seriesCode,
        fred_code: seriesCode,
        name: def?.name || seriesCode,
        category: (def?.category as any) || 'sentiment',
        unit: def?.unit || '',
        frequency: (def?.frequency as any) || 'monthly',
        seasonally_adjusted: false,
        last_updated: obs?.date ? new Date(obs.date).toISOString() : new Date().toISOString(),
        description: def?.description || '',
      }

      return { series, source: 'fred', sourceLabel: 'FRED', isMock: false }
    } catch {
      const def = FRED_SERIES.find(s => s.code === seriesCode)
      if (def) {
        return {
          series: {
            id: `${seriesCode}-mock`,
            fred_code: seriesCode,
            name: def.name,
            category: def.category as any,
            unit: def.unit,
            frequency: def.frequency as any,
            seasonally_adjusted: false,
            last_updated: new Date().toISOString(),
            description: def.description,
          },
          source: 'fred',
          sourceLabel: 'FRED (mock)',
          isMock: true,
        }
      }
      return { series: null, source: 'fred', sourceLabel: 'FRED (mock)', isMock: true }
    }
  }

  async fetchObservations(
    seriesCode: string,
    observationStart?: string,
    observationEnd?: string,
    limit = 100
  ): Promise<{
    data: MacroObservation[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockObservations(seriesCode, 30),
        source: 'fred',
        sourceLabel: 'FRED (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      let path = `/series/observations?series_id=${seriesCode}&sort_order=desc&limit=${limit}`
      if (observationStart) path += `&observation_start=${observationStart}`
      if (observationEnd) path += `&observation_end=${observationEnd}`

      const data = await this.fetchFromApi(path)
      const observations: MacroObservation[] = (data.observations || [])
        .filter((o: FREDObservation) => o.value !== '.' && o.value !== '')
        .map((o: FREDObservation, idx: number) => ({
          id: `${seriesCode}-${o.date}-${idx}`,
          series_id: seriesCode,
          date: o.date,
          value: parseFloat(o.value),
          change: null,
          change_percent: null,
        }))
        .reverse()

      for (let i = 1; i < observations.length; i++) {
        const prev = observations[i - 1].value
        const curr = observations[i].value
        if (prev !== 0) {
          observations[i].change = curr - prev
          observations[i].change_percent = ((curr - prev) / Math.abs(prev)) * 100
        }
      }

      return {
        data: observations.slice(-limit),
        source: 'fred',
        sourceLabel: 'FRED',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: this.generateMockObservations(seriesCode, 30),
        source: 'fred',
        sourceLabel: 'FRED (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private buildSeries(def: typeof FRED_SERIES[0], latestObs: FREDObservation, _allObs: FREDObservation[]): MacroSeries {
    return {
      id: def.code,
      fred_code: def.code,
      name: def.name,
      category: def.category as any,
      unit: def.unit,
      frequency: def.frequency as any,
      seasonally_adjusted: false,
      last_updated: latestObs.date,
      description: def.description,
    }
  }

  private makeMockSeries(def: typeof FRED_SERIES[0], _idx: number): MacroSeries {
    return {
      id: `${def.code}-mock`,
      fred_code: def.code,
      name: def.name,
      category: def.category as any,
      unit: def.unit,
      frequency: def.frequency as any,
      seasonally_adjusted: false,
      last_updated: new Date().toISOString(),
      description: def.description,
    }
  }

  private generateMockObservations(seriesCode: string, count: number): MacroObservation[] {
    const baseValue = this.getBaseValue(seriesCode)
    const observations: MacroObservation[] = []
    let currentValue = baseValue * 0.95

    for (let i = count; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i * 7)
      currentValue += (Math.random() - 0.48) * baseValue * 0.02
      observations.push({
        id: `${seriesCode}-mock-${i}`,
        series_id: seriesCode,
        date: date.toISOString().split('T')[0],
        value: Math.round(currentValue * 100) / 100,
        change: i > 0 ? Math.round((currentValue - observations[observations.length - 1]?.value || currentValue) * 100) / 100 : null,
        change_percent: i > 0 ? Math.round(((currentValue - (observations[observations.length - 1]?.value || currentValue)) / Math.abs(observations[observations.length - 1]?.value || 1)) * 10000) / 100 : null,
      })
    }

    return observations
  }

  private getBaseValue(code: string): number {
    const values: Record<string, number> = {
      'FEDFUNDS': 5.5, 'DFF': 5.5, 'DGS10': 4.3, 'DGS2': 4.7,
      'T10Y2Y': -0.4, 'CPIAUCSL': 310, 'CPILFESL': 320,
      'PCEPILFE': 120, 'UNRATE': 3.8, 'PAYEMS': 158000,
      'AWHMAN': 40, 'GDP': 28000, 'GDPC1': 23000,
      'HOUST': 1450, 'MORTGAGE30US': 6.8, 'UMCSENT': 70,
      'INDPRO': 100, 'TCU': 78, 'DSPIC96': 17000,
      'WTREGEN': 78,
    }
    return values[code] || 100
  }

  async fetchHistorical(
    _symbol: string,
    _interval?: string,
    _startDate?: string,
    _endDate?: string
  ): Promise<FetchHistoricalResult<MacroSeries>> {
    const def = FRED_SERIES.find(s => s.code === _symbol)
    if (!def) {
      return {
        data: [],
        source: 'fred',
        sourceLabel: 'FRED',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    }
    const obs = await this.fetchObservations(_symbol, _startDate, _endDate)
    const series: MacroSeries = {
      id: def.code,
      fred_code: def.code,
      name: def.name,
      category: def.category as any,
      unit: def.unit,
      frequency: def.frequency as any,
      seasonally_adjusted: false,
      last_updated: obs.data[obs.data.length - 1]?.date || new Date().toISOString(),
      description: def.description,
    }
    return {
      data: [series],
      source: 'fred',
      sourceLabel: 'FRED',
      isMock: obs.isMock,
      fetchedAt: new Date().toISOString(),
    }
  }
}
