import type { DataProvider, RateLimitConfig } from './types'
import type { NewsItem, NewsCategory } from '@/types/news'
import type { HistoricalPrice } from '@/types/asset'

interface FinnhubQuote {
  symbol: string
  price: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  previousClose: number
  change: number
  changePercent: number
}

interface FinnhubNewsItem {
  id: number
  headline: string
  summary: string
  url: string
  source: string
  category: string
  datetime: number
  related: string
  image: string
}

export class FinnhubProvider implements DataProvider<FinnhubQuote> {
  name = 'FINNHUB'
  rateLimit: RateLimitConfig = { maxRequests: 30, windowMs: 60000 }

  private apiKey: string

  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY || ''
  }

  isAvailable(): boolean {
    return this.apiKey.length > 0
  }

  private async fetchFromApi(path: string): Promise<any> {
    const baseUrl = 'https://finnhub.io/api/v1'
    const separator = path.includes('?') ? '&' : '?'
    const url = `${baseUrl}${path}${separator}token=${this.apiKey}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`)
    }
    return response.json()
  }

  async fetchLatest(symbols: string[]): Promise<{
    data: FinnhubQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const results: FinnhubQuote[] = []
      for (const symbol of symbols) {
        const data = await this.fetchFromApi(`/quote?symbol=${symbol}`)
        if (data && data.c !== undefined && data.c !== 0) {
          results.push({
            symbol,
            price: data.c,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.pc,
            volume: data.v || 0,
            previousClose: data.pc,
            change: data.d,
            changePercent: data.dp,
          })
        }
        await new Promise(r => setTimeout(r, 100))
      }

      return {
        data: results,
        source: 'finnhub',
        sourceLabel: 'Finnhub',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: symbols.map(s => this.makeMockQuote(s)),
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  async fetchNews(categories: string = 'general', fromDate?: string, toDate?: string): Promise<{
    data: NewsItem[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockNews(),
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const today = new Date()
      const oneWeekAgo = new Date(today)
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      const from = fromDate || oneWeekAgo.toISOString().split('T')[0]
      const to = toDate || today.toISOString().split('T')[0]

      const data = await this.fetchFromApi(`/company-news?symbol=${categories}&from=${from}&to=${to}`)

      const newsItems: NewsItem[] = Array.isArray(data)
        ? data.slice(0, 50).map((item: FinnhubNewsItem) => ({
            id: String(item.id),
            title: item.headline,
            summary: item.summary || '',
            url: item.url,
            source: item.source,
            source_logo_url: null,
            category: this.mapCategory(item.category),
            published_at: new Date(item.datetime * 1000).toISOString(),
            author: null,
            sentiment: null,
            symbols: item.related ? item.related.split(',') : [],
            is_mock: false,
            image_url: item.image || null,
          }))
        : []

      return {
        data: newsItems,
        source: 'finnhub',
        sourceLabel: 'Finnhub',
        isMock: false,
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return {
        data: this.generateMockNews(),
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }
  }

  private mapCategory(cat: string): NewsCategory {
    const lower = (cat || '').toLowerCase()
    if (lower.includes('earn')) return 'earnings'
    if (lower.includes('economy') || lower.includes('macro')) return 'economy'
    if (lower.includes('central') || lower.includes('fed') || lower.includes('cb')) return 'central_banks'
    if (lower.includes('ipo') || lower.includes('merger') || lower.includes('company')) return 'company'
    if (lower.includes('sector') || lower.includes('industry')) return 'sector'
    if (lower.includes('geo') || lower.includes('politics')) return 'geopolitics'
    if (lower.includes('regul')) return 'regulation'
    return 'markets'
  }

  private generateMockNews(): NewsItem[] {
    const headlines = [
      { title: 'S&P 6500 first — Goldman Sachs raises year-end target', cat: 'markets' as const },
      { title: 'Fed minutes: Officials saw progress on inflation, but want to see more', cat: 'central_banks' as const },
      { title: 'Treasury yields rise as traders reassess Fed rate path', cat: 'markets' as const },
      { title: 'Nvidia shares climb after analyst raises price target on AI chip demand', cat: 'company' as const },
      { title: 'Oil prices steady as Middle East tensions offset demand concerns', cat: 'markets' as const },
      { title: 'US jobless claims fall more than expected, labor market remains resilient', cat: 'economy' as const },
      { title: 'China GDP growth misses estimates, stimulus hopes rise', cat: 'economy' as const },
      { title: 'Apple reports record Q2 earnings, announces $110B buyback', cat: 'earnings' as const },
    ]
    return headlines.map((h, i) => ({
      id: `mock-news-${i}`,
      title: h.title,
      summary: 'Mock data — no API key configured.',
      url: '#',
      source: 'Finnhub (mock)',
      source_logo_url: null,
      category: h.cat,
      published_at: new Date().toISOString(),
      author: null,
      sentiment: Math.random() * 2 - 1,
      symbols: [],
      is_mock: true,
      image_url: null,
    }))
  }

  private makeMockQuote(symbol: string): FinnhubQuote {
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
    _interval = 'D',
    _startDate?: string,
    _endDate?: string
  ): Promise<{
    data: FinnhubQuote[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    if (!this.isAvailable()) {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as FinnhubQuote[],
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
        isMock: true,
        fetchedAt: new Date().toISOString(),
      }
    }

    try {
      const resolution = 'D'
      const to = Math.floor(Date.now() / 1000)
      const from = to - 86400 * 100
      const data = await this.fetchFromApi(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`)

      if (data.s === 'ok' && data.t) {
        const historical: FinnhubQuote[] = data.t.map((t: number, i: number) => ({
          symbol,
          open: data.o[i],
          high: data.h[i],
          low: data.l[i],
          close: data.c[i],
          volume: data.v[i],
          price: data.c[i],
          previousClose: i > 0 ? data.c[i - 1] : data.c[i],
          change: i > 0 ? data.c[i] - data.c[i - 1] : 0,
          changePercent: i > 0 ? ((data.c[i] - data.c[i - 1]) / data.c[i - 1]) * 100 : 0,
        }))

        return {
          data: historical,
          source: 'finnhub',
          sourceLabel: 'Finnhub',
          isMock: false,
          fetchedAt: new Date().toISOString(),
        }
      }

      return { data: [], source: 'finnhub', sourceLabel: 'Finnhub', isMock: false, fetchedAt: new Date().toISOString() }
    } catch {
      return {
        data: this.generateMockHistory(symbol, 30) as unknown as FinnhubQuote[],
        source: 'finnhub',
        sourceLabel: 'Finnhub (mock)',
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
