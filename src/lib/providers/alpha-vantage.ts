import type { DataProvider, RateLimitConfig } from './types'
import type { HistoricalPrice } from '@/types/asset'

interface AVGlobalQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  previousClose: number
  change: number
  changePercent: number
}

export class AlphaVantageProvider implements DataProvider<AVGlobalQuote> {
  name = 'ALPHA_VANTAGE'
  rateLimit: RateLimitConfig = { maxRequests: 5, windowMs: 60000 }

  private apiKey: string

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || ''
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0
  }

  private async fetchFromApi(params: Record<string, string>): Promise<any> {
    const query = new URLSearchParams({ ...params, apikey: this.apiKey })
    const url = `https://www.alphavantage.co/query?${query.toString()}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`)
    }
    return response.json()
  }

  async fetchLatest(symbols: string[]): Promise<{
    data: AVGlobalQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const results: AVGlobalQuote[] = []

      for (const symbol of symbols) {
        const data = await this.fetchFromApi({
          function: 'GLOBAL_QUOTE',
          symbol,
        })

        const quote = data['Global Quote']
        if (quote) {
          results.push({
            symbol: quote['01. symbol'] || symbol,
            price: parseFloat(quote['05. price']) || 0,
            open: parseFloat(quote['02. open']) || 0,
            high: parseFloat(quote['03. high']) || 0,
            low: parseFloat(quote['04. low']) || 0,
            volume: parseInt(quote['06. volume'], 10) || 0,
            previousClose: parseFloat(quote['08. previous close']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(String(quote['10. change percent'] || '0%').replace('%', '')) || 0,
          })
        }

        await new Promise(r => setTimeout(r, 200))
      }

      return {
        data: results,
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private makeMockQuote(symbol: string): AVGlobalQuote {
    const basePrice = this.getBasePrice(symbol)
    const variation = basePrice * (Math.random() * 0.03 - 0.015)
    return {
      symbol,
      price: basePrice + variation,
      open: basePrice - variation * 0.3,
      high: basePrice + Math.abs(variation) * 1.3,
      low: basePrice - Math.abs(variation) * 1.3,
      volume: Math.floor(Math.random() * 8000000) + 500000,
      previousClose: basePrice,
      change: variation,
      changePercent: (variation / basePrice) * 100,
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
    interval = 'DAILY',
    _startDate?: string,
    _endDate?: string
  ): Promise<{
    data: AVGlobalQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as AVGlobalQuote[],
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const fn = interval === 'WEEKLY' ? 'TIME_SERIES_WEEKLY' : interval === 'MONTHLY' ? 'TIME_SERIES_MONTHLY' : 'TIME_SERIES_DAILY'
      const data = await this.fetchFromApi({ function: fn, symbol, outputsize: 'compact' })

      const seriesKey = Object.keys(data).find(k => k.includes('Time Series') || k.includes('Weekly') || k.includes('Monthly'))
      if (!seriesKey || !data[seriesKey]) return { data: [], source: 'alpha_vantage', sourceLabel: 'Alpha Vantage', isMock: false, fetchedAt: new Date().toISOString() }

      const timeSeries = data[seriesKey]
      const historical: AVGlobalQuote[] = Object.entries(timeSeries)
        .slice(0, 100)
        .map(([date, vals]: [string, any]) => ({
          symbol,
          price: parseFloat(vals['4. close']),
          open: parseFloat(vals['1. open']),
          high: parseFloat(vals['2. high']),
          low: parseFloat(vals['3. low']),
          volume: parseInt(vals['5. volume'], 10),
          previousClose: parseFloat(vals['4. close']),
          change: 0,
          changePercent: 0,
        }))
        .reverse()

      return {
        data: historical,
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as AVGlobalQuote[],
        source: 'alpha_vantage',
        sourceLabel: 'Alpha Vantage (mock)',
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
