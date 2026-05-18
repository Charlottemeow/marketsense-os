import type { DataProvider, RateLimitConfig } from './types'
import type { EconomicEvent, EventImportance } from '@/types/news'
import type { MacroCategory } from '@/types/macro'
import type { HistoricalPrice } from '@/types/asset'

interface FMPQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  previousClose: number
  change: number
  changesPercentage: number
}

export class FMPProvider implements DataProvider<FMPQuote> {
  name = 'FMP'
  rateLimit: RateLimitConfig = { maxRequests: 10, windowMs: 60000 }

  private apiKey: string

  constructor() {
    this.apiKey = process.env.FMP_API_KEY || ''
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0
  }

  private async fetchFromApi(path: string): Promise<any> {
    const baseUrl = 'https://financialmodelingprep.com/api/v3'
    const separator = path.includes('?') ? '&' : '?'
    const url = `${baseUrl}${path}${separator}apikey=${this.apiKey}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`FMP API error: ${response.status}`)
    }
    return response.json()
  }

  async fetchLatest(symbols: string[]): Promise<{
    data: FMPQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const symbolStr = symbols.join(',')
      const result = await this.fetchFromApi(`/quote/${symbolStr}`)

      const quotes: FMPQuote[] = Array.isArray(result)
        ? result.map((q: any) => ({
            symbol: q.symbol,
            price: q.price || 0,
            open: q.open || 0,
            high: q.dayHigh || q.high || 0,
            low: q.dayLow || q.low || 0,
            close: q.previousClose || q.close || 0,
            volume: q.volume || 0,
            previousClose: q.previousClose || 0,
            change: q.change || 0,
            changesPercentage: q.changesPercentage || 0,
          }))
        : []

      return {
        data: quotes,
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async fetchEconomicCalendarEvents(from: string, to: string): Promise<{
    data: EconomicEvent[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockEvents(from, to),
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const result = await this.fetchFromApi(`/economic_calendar?from=${from}&to=${to}`)
      const events: EconomicEvent[] = Array.isArray(result)
        ? result.map((e: any) => ({
            id: '',
            title: e.event || e.name || '',
            date: e.date || '',
            country: e.country || 'US',
            category: this.mapCategory(e.category || e.type || ''),
            importance: this.mapImportance(e.impact || e.importance || ''),
            previous: e.previous != null ? parseFloat(e.previous) : null,
            forecast: e.forecast != null ? parseFloat(e.forecast) : null,
            actual: e.actual != null ? parseFloat(e.actual) : null,
            revised: e.revised != null ? parseFloat(e.revised) : null,
            source: 'fmp',
            source_label: 'Financial Modeling Prep',
            is_mock: false,
          }))
        : []

      return {
        data: events,
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: this.generateMockEvents(from, to),
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async fetchEarningsCalendar(from: string, to: string): Promise<{
    data: any[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return { data: [], source: 'fmp', sourceLabel: 'Financial Modeling Prep (mock)', isMock: true, fetchedAt: new Date().toISOString() }
    }

    try {
      const result = await this.fetchFromApi(`/earnings_calendar?from=${from}&to=${to}`)
      return {
        data: Array.isArray(result) ? result : [],
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return { data: [], source: 'fmp', sourceLabel: 'Financial Modeling Prep (mock)', isMock: true, fetchedAt: new Date().toISOString() }
    }
  }

  private mapCategory(cat: string): MacroCategory {
    const map: Record<string, MacroCategory> = {
      'employment': 'employment', 'gdp': 'gdp', 'inflation': 'inflation',
      'interest rate': 'interest_rates', 'housing': 'housing',
      'consumer': 'consumer', 'trade': 'trade', 'manufacturing': 'manufacturing',
    }
    return map[cat.toLowerCase()] || 'sentiment'
  }

  private mapImportance(imp: string): EventImportance {
    const lower = imp.toLowerCase()
    if (lower.includes('high') || lower === '3') return 'high'
    if (lower.includes('low') || lower === '1') return 'low'
    return 'medium'
  }

  private makeMockQuote(symbol: string): FMPQuote {
    const basePrice = this.getBasePrice(symbol)
    const variation = basePrice * (Math.random() * 0.03 - 0.015)
    return {
      symbol,
      price: basePrice + variation,
      open: basePrice - variation * 0.3,
      high: basePrice + Math.abs(variation) * 1.3,
      low: basePrice - Math.abs(variation) * 1.3,
      close: basePrice,
      volume: Math.floor(Math.random() * 8000000) + 500000,
      previousClose: basePrice,
      change: variation,
      changesPercentage: (variation / basePrice) * 100,
    }
  }

  private getBasePrice(symbol: string): number {
    const prices: Record<string, number> = {
      'SPY': 540, 'QQQ': 460, 'DIA': 400, 'IWM': 210,
      'AAPL': 220, 'MSFT': 430, 'GOOGL': 175, 'AMZN': 190,
      'NVDA': 900, 'META': 510, 'TSLA': 180, 'JPM': 200,
      'VTI': 270, 'GLD': 230, 'TLT': 95, 'USO': 80,
      'DXY': 104, 'VIX': 14, 'HYG': 76, 'EEM': 42,
      'XLF': 42, 'XLK': 215, 'BTC/USD': 67000, 'ETH/USD': 3400,
      'XAU/USD': 2350, 'XAG/USD': 28, 'IXIC': 18500, 'DJI': 39000,
    }
    return prices[symbol] || 100
  }

  private generateMockEvents(from: string, _to: string): EconomicEvent[] {
    return [
      {
        id: 'mock-001',
        title: 'Nonfarm Payrolls (mock)',
        date: from,
        country: 'US',
        category: 'employment',
        importance: 'high',
        previous: 228,
        forecast: 200,
        actual: 215,
        revised: null,
        source: 'fmp',
        source_label: 'Financial Modeling Prep (mock)',
        is_mock: true,
      },
      {
        id: 'mock-002',
        title: 'CPI YoY (mock)',
        date: from,
        country: 'US',
        category: 'inflation',
        importance: 'high',
        previous: 3.2,
        forecast: 3.1,
        actual: 3.15,
        revised: null,
        source: 'fmp',
        source_label: 'Financial Modeling Prep (mock)',
        is_mock: true,
      },
      {
        id: 'mock-003',
        title: 'Fed Interest Rate Decision (mock)',
        date: from,
        country: 'US',
        category: 'interest_rates',
        importance: 'high',
        previous: 5.5,
        forecast: 5.5,
        actual: 5.5,
        revised: null,
        source: 'fmp',
        source_label: 'Financial Modeling Prep (mock)',
        is_mock: true,
      },
    ]
  }

  async fetchHistorical(
    symbol: string,
    interval = 'daily',
    _startDate?: string,
    _endDate?: string
  ): Promise<{
    data: FMPQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as FMPQuote[],
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const series = interval === 'weekly' ? 'historical-price-full' : 'historical-price-full'
      const result = await this.fetchFromApi(`/${series}/${symbol}?timeseries=100`)

      if (result.historical) {
        const historical: FMPQuote[] = result.historical.map((h: any) => ({
          symbol,
          price: h.close,
          open: h.open,
          high: h.high,
          low: h.low,
          close: h.close,
          volume: h.volume,
          previousClose: h.previousClose || h.close,
          change: h.change || 0,
          changesPercentage: h.changesPercentage || 0,
        })).reverse()

        return {
          data: historical,
          source: 'fmp',
          sourceLabel: 'Financial Modeling Prep',
          isMock: false,
          fetchedAt: new Date().toISOString(),
        }
      }

      return { data: [], source: 'fmp', sourceLabel: 'Financial Modeling Prep', isMock: false, fetchedAt: new Date().toISOString() }
    } catch {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as FMPQuote[],
        source: 'fmp',
        sourceLabel: 'Financial Modeling Prep (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private generateMockHistory(symbol: string, days: number): HistoricalPrice[] {
    const data: HistoricalPrice[] = []
    const basePrice = this.getBasePrice(symbol)
    let currentPrice = basePrice * 0.95

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const change = currentPrice * (Math.random() * 0.04 - 0.02)
      const open = currentPrice
      const close = currentPrice + change
      const high = Math.max(open, close) * (1 + Math.random() * 0.015)
      const low = Math.min(open, close) * (1 - Math.random() * 0.015)
      currentPrice = close

      data.push({
        date: date.toISOString().split('T')[0],
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
      })
    }

    return data
  }
}
