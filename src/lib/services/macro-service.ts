import { FREDProvider } from '@/lib/providers/fred'
import type { MacroSeries, MacroObservation, MacroSeriesWithObservations } from '@/types/macro'
import { FRED_SERIES, STALE_DATA_THRESHOLD_MINUTES } from '@/lib/constants'

export class MacroService {
  private fredProvider: FREDProvider

  constructor() {
    this.fredProvider = new FREDProvider()
  }

  async getMacroSeries(): Promise<MacroSeries[]> {
    const result = await this.fredProvider.fetchLatest()
    return result.data
  }

  async getMacroObservations(
    seriesCode: string,
    limit = 100
  ): Promise<MacroObservation[]> {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - limit * 7 * 86400000).toISOString().split('T')[0]

    const result = await this.fredProvider.fetchObservations(
      seriesCode,
      startDate,
      endDate,
      limit
    )
    return result.data
  }

  async getMacroSeriesWithData(
    seriesCode: string,
    limit = 30
  ): Promise<MacroSeriesWithObservations | null> {
    const seriesResult = await this.fredProvider.fetchSeries(seriesCode)
    if (!seriesResult.series) return null

    const observationsResult = await this.fredProvider.fetchObservations(
      seriesCode,
      undefined,
      undefined,
      limit
    )

    const observations = observationsResult.data
    const latestVal = observations.length > 0 ? observations[observations.length - 1].value : null
    const prevVal = observations.length > 1 ? observations[observations.length - 2].value : null
    const latestChange = latestVal != null && prevVal != null ? latestVal - prevVal : null
    const latestChangePct = latestChange != null && prevVal != null && prevVal !== 0
      ? (latestChange / Math.abs(prevVal)) * 100
      : null

    return {
      ...seriesResult.series,
      observations,
      latest_value: latestVal,
      previous_value: prevVal,
      latest_change: latestChange ? Math.round(latestChange * 100) / 100 : null,
      latest_change_percent: latestChangePct ? Math.round(latestChangePct * 100) / 100 : null,
    }
  }

  async getAllSeriesWithData(limit = 12): Promise<MacroSeriesWithObservations[]> {
    const results: MacroSeriesWithObservations[] = []

    for (const def of FRED_SERIES) {
      try {
        const data = await this.getMacroSeriesWithData(def.code, limit)
        if (data) {
          results.push(data)
        }
      } catch {
        continue
      }
    }

    return results
  }

  async refreshMacroData(): Promise<void> {
    await this.fredProvider.fetchLatest()
  }

  calculateChanges(
    observations: MacroObservation[]
  ): MacroObservation[] {
    return observations.map((obs, idx) => {
      if (idx === 0) return { ...obs, change: null, change_percent: null }

      const prev = observations[idx - 1].value
      const change = obs.value - prev
      const changePercent = prev !== 0 ? (change / Math.abs(prev)) * 100 : null

      return {
        ...obs,
        change: Math.round(change * 100) / 100,
        change_percent: changePercent != null ? Math.round(changePercent * 100) / 100 : null,
      }
    })
  }

  isDataStale(seriesLastUpdated: string): boolean {
    const now = Date.now()
    const updated = new Date(seriesLastUpdated).getTime()
    const diffMinutes = (now - updated) / 60000
    return diffMinutes > STALE_DATA_THRESHOLD_MINUTES
  }
}
