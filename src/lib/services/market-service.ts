import { ProviderRegistry } from '@/lib/providers/registry'
import { TwelveDataProvider } from '@/lib/providers/twelve-data'
import { AlphaVantageProvider } from '@/lib/providers/alpha-vantage'
import { FMPProvider } from '@/lib/providers/fmp'
import { FinnhubProvider } from '@/lib/providers/finnhub'
import { DEFAULT_WATCHLIST, STALE_DATA_THRESHOLD_MINUTES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import type { MarketPrice, Asset, HistoricalPrice, AssetPerformance, PerformancePeriod } from '@/types/asset'

type QuoteResult = {
  symbol: string
  name?: string
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

export class MarketPriceService {
  private registry: ProviderRegistry

  constructor() {
    this.registry = ProviderRegistry.getInstance()
  }

  private ensureProviders(): void {
    if (this.registry.getAllProviders().length === 0) {
      this.registry.registerMany([
        new TwelveDataProvider(),
        new AlphaVantageProvider(),
        new FMPProvider(),
        new FinnhubProvider(),
      ])
    }
  }

  async getLatestPrices(symbols?: string[]): Promise<MarketPrice[]> {
    this.ensureProviders()
    const targetSymbols = symbols || DEFAULT_WATCHLIST.map(w => w.symbol)
    const result = await this.registry.fetchLatest<QuoteResult>(targetSymbols)

    return result.data.map((q: QuoteResult) => {
      const watchlistItem = DEFAULT_WATCHLIST.find(w => w.symbol === q.symbol)
      return {
        id: `${q.symbol}-${Date.now()}`,
        asset_id: q.symbol,
        price: q.price || 0,
        open: q.open || 0,
        high: q.high || 0,
        low: q.low || 0,
        close: q.close || 0,
        volume: q.volume || 0,
        change: q.change || 0,
        change_percent: q.changePercent || 0,
        previous_close: q.previousClose || 0,
        source: result.source,
        source_label: result.sourceLabel,
        is_mock: result.isMock,
        fetched_at: result.fetchedAt,
      }
    })
  }

  async refreshPrices(symbols?: string[]): Promise<MarketPrice[]> {
    this.ensureProviders()
    const prices = await this.getLatestPrices(symbols)

    try {
      const supabase = createClient()
      const now = new Date().toISOString()

      for (const price of prices) {
        const symbol = price.asset_id
        const assetRecord = await supabase
          .from('assets')
          .select('id')
          .eq('symbol', symbol)
          .single()

        if (assetRecord.data?.id) {
          await supabase.from('market_prices').insert({
            asset_id: assetRecord.data.id,
            price: price.price,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
            volume: price.volume,
            change: price.change,
            change_percent: price.change_percent,
            previous_close: price.previous_close,
            source: price.source,
            source_label: price.source_label,
            is_mock: price.is_mock,
            fetched_at: now,
          })
        }
      }
    } catch {
      // silently fail on DB write errors
    }

    return prices
  }

  async getTopMovers(limit = 5, direction: 'up' | 'down' = 'down'): Promise<MarketPrice[]> {
    const prices = await this.getLatestPrices()
    const sorted = [...prices].sort((a, b) => {
      return direction === 'down'
        ? a.change_percent - b.change_percent
        : b.change_percent - a.change_percent
    })
    return sorted.slice(0, limit)
  }

  async getCrossAssetHeatmap(): Promise<AssetPerformance[]> {
    const prices = await this.getLatestPrices()
    const categorySet = new Set(prices.map(p => {
      const watchlistItem = DEFAULT_WATCHLIST.find(w => w.symbol === p.asset_id)
      return watchlistItem?.category || 'equity'
    }))
    const categories = Array.from(categorySet)

    return categories.map(category => {
      const categoryPrices = prices.filter(p => {
        const watchlistItem = DEFAULT_WATCHLIST.find(w => w.symbol === p.asset_id)
        return watchlistItem?.category === category
      })

      const avgReturn = categoryPrices.length > 0
        ? categoryPrices.reduce((sum, p) => sum + p.change_percent, 0) / categoryPrices.length
        : 0

      return {
        symbol: category,
        name: category,
        category: category as AssetPerformance['category'],
        period: '1D' as PerformancePeriod,
        return: Math.round(avgReturn * 100) / 100,
      }
    })
  }

  async getHistoricalPrices(symbol: string, days = 30): Promise<HistoricalPrice[]> {
    this.ensureProviders()
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
    const result = await this.registry.fetchHistorical<HistoricalPrice>(symbol, '1day', startDate, endDate)
    return result.data
  }

  isDataStale(fetchedAt: string): boolean {
    const now = Date.now()
    const fetchTime = new Date(fetchedAt).getTime()
    const diffMinutes = (now - fetchTime) / 60000
    return diffMinutes > STALE_DATA_THRESHOLD_MINUTES
  }
}
