import { FMPProvider } from '@/lib/providers/fmp'
import type { EconomicEvent } from '@/types/news'

export class CalendarService {
  private fmpProvider: FMPProvider

  constructor() {
    this.fmpProvider = new FMPProvider()
  }

  async fetchEconomicCalendar(
    from?: string,
    to?: string
  ): Promise<{
    data: EconomicEvent[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    const today = new Date()
    const startDate = from || today.toISOString().split('T')[0]
    const endDate = to || new Date(today.getTime() + 30 * 86400000).toISOString().split('T')[0]

    const result = await this.fmpProvider.fetchEconomicCalendarEvents(startDate, endDate)
    const sorted = result.data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const withIds = sorted.map((event, idx) => ({
      ...event,
      id: event.id || `event-${idx}-${event.date}`,
    }))

    return {
      ...result,
      data: withIds,
    }
  }

  async fetchEarningsCalendar(
    from?: string,
    to?: string
  ): Promise<{
    data: any[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    const today = new Date()
    const startDate = from || today.toISOString().split('T')[0]
    const endDate = to || new Date(today.getTime() + 14 * 86400000).toISOString().split('T')[0]

    return this.fmpProvider.fetchEarningsCalendar(startDate, endDate)
  }

  async getUpcomingHighImpactEvents(days = 7): Promise<EconomicEvent[]> {
    const result = await this.fetchEconomicCalendar()
    const now = new Date()
    const future = new Date(now.getTime() + days * 86400000)

    return result.data.filter(
      event =>
        event.importance === 'high' &&
        new Date(event.date) >= now &&
        new Date(event.date) <= future
    )
  }

  async getRecentEvents(days = 7): Promise<EconomicEvent[]> {
    const result = await this.fetchEconomicCalendar()
    const past = new Date(Date.now() - days * 86400000)

    return result.data.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= past && event.actual != null
    })
  }
}
