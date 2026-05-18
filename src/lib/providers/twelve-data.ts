import type { DataProvider, RateLimitConfig, FetchLatestResult, FetchHistoricalResult } from './types'

interface TwelveDataQuote {
  symbol: string
  name: string
  price: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  previous_close: number
  change: number
  percent_change: number
}

interface TwelveDataTimeSeries {
  datetime: string
  open: string
  high: string
  low: string
  close: string
  volume: string
}

export class TwelveDataProvider implements DataProvider<TwelveDataQuote> {
  name = 'TWELVE_DATA'
  rateLimit: RateLimitConfig = { maxRequests: 8, windowMs: 60000 }

  private apiKey: string

  constructor() {
    this.apiKey = process.env.TWELVE_DATA_API_KEY || ''
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0
  }

  private async fetchFromApi(path: string): Promise<any> {
    const baseUrl = 'https://api.twelvedata.com'
    const url = `${baseUrl}${path}&apikey=${this.apiKey}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Twelve Data API error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async fetchLatest(symbols: string[]): Promise<FetchLatestResult<TwelveDataQuote>> {
    if (!this.isAvailable()) {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'twelve_data',
        sourceLabel: 'Twelve Data (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const symbolStr = symbols.join(',')
      const result = await this.fetchFromApi(`/quote?symbol=${symbolStr}`)
      const quotes: TwelveDataQuote[] = []

      if (result.status === 'ok') {
        if (symbols.length === 1) {
          quotes.push(this.parseQuote(result, symbols[0]))
        } else {
          for (const sym of symbols) {
            if (result[sym] && result[sym].status === 'ok') {
              quotes.push(this.parseQuote(result[sym], sym))
            }
          }
        }
      }

      return {
        data: quotes,
        source: 'twelve_data',
        sourceLabel: 'Twelve Data',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'twelve_data',
        sourceLabel: 'Twelve Data (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private parseQuote(raw: any, symbol: string): TwelveDataQuote {
    return {
      symbol,
      name: raw.name || symbol,
      price: parseFloat(raw.close) || 0,
      open: parseFloat(raw.open) || 0,
      high: parseFloat(raw.high) || 0,
      low: parseFloat(raw.low) || 0,
      close: parseFloat(raw.close) || 0,
      volume: parseInt(raw.volume, 10) || 0,
      previous_close: parseFloat(raw.previous_close) || 0,
      change: parseFloat(raw.change) || 0,
      percent_change: parseFloat(raw.percent_change) || 0,
    }
  }

  private makeMockQuote(symbol: string): TwelveDataQuote {
    const basePrice = this.getBasePrice(symbol)
    const variation = basePrice * (Math.random() * 0.04 - 0.02)
    return {
      symbol,
      name: symbol,
      price: basePrice + variation,
      open: basePrice - variation * 0.5,
      high: basePrice + Math.abs(variation) * 1.5,
      low: basePrice - Math.abs(variation) * 1.5,
      close: basePrice + variation,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      previous_close: basePrice,
      change: variation,
      percent_change: (variation / basePrice) * 100,
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

  async fetchHistorical(
    symbol: string,
    interval = '1day',
    startDate?: string,
    endDate?: string
  ): Promise<FetchHistoricalResult<TwelveDataQuote>> {
    if (!this.isAvailable()) {
      return {
        data: [this.makeMockQuote(symbol)],
        source: 'twelve_data',
        sourceLabel: 'Twelve Data (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      let path = `/time_series?symbol=${symbol}&interval=${interval}&outputsize=100`
      if (startDate) path += `&start_date=${startDate}`
      if (endDate) path += `&end_date=${endDate}`

      const result = await this.fetchFromApi(path)
      const values: TwelveDataTimeSeries[] = result.values || []

      const data: TwelveDataQuote[] = values.map((v: TwelveDataTimeSeries) => ({
        symbol,
        name: symbol,
        price: parseFloat(v.close),
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume, 10),
        previous_close: parseFloat(v.close),
        change: 0,
        percent_change: 0,
      }))

      return {
        data,
        source: 'twelve_data',
        sourceLabel: 'Twelve Data',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: [this.makeMockQuote(symbol)],
        source: 'twelve_data',
        sourceLabel: 'Twelve Data (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private generateMockHistory(symbol: string, days: number): TwelveDataQuote[] {
    const data: TwelveDataQuote[] = []
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
        symbol,
        name: symbol,
        price: Math.round(close * 100) / 100,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        previous_close: Math.round(open * 100) / 100,
        change: Math.round(change * 100) / 100,
        percent_change: Math.round((change / open) * 10000) / 100,
      })
    }

    return data
  }
}
