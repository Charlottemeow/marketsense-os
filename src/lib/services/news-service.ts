import { FinnhubProvider } from '@/lib/providers/finnhub'
import type { NewsItem, NewsCategory } from '@/types/news'
import { NEWS_CATEGORIES } from '@/types/news'

interface CachedFeed {
  items: NewsItem[]
  fetchedAt: string
}

export class NewsService {
  private finnhubProvider: FinnhubProvider
  private cachedFeeds: Map<string, CachedFeed> = new Map()
  private cacheTTL = 5 * 60 * 1000

  constructor() {
    this.finnhubProvider = new FinnhubProvider()
  }

  async fetchNews(category?: string, limit = 50): Promise<{
    data: NewsItem[]
    source: string
    sourceLabel: string
    isMock: boolean
    fetchedAt: string
  }> {
    const result = await this.finnhubProvider.fetchNews(category || 'general')
    const items = result.data.slice(0, limit)

    return {
      ...result,
      data: items.map(item => ({
        ...item,
        category: this.normalizeCategory(item.category),
      })),
    }
  }

  async fetchNewsBySymbol(symbol: string, limit = 20): Promise<NewsItem[]> {
    const result = await this.finnhubProvider.fetchNews(symbol)
    return result.data.slice(0, limit)
  }

  deduplicate(items: NewsItem[]): NewsItem[] {
    const seen = new Set<string>()
    return items.filter(item => {
      const key = item.title.toLowerCase().trim()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  categorize(item: NewsItem): NewsCategory {
    return this.normalizeCategory(item.category)
  }

  private normalizeCategory(cat: string): NewsCategory {
    const valid = NEWS_CATEGORIES.find(c => c === cat)
    if (valid) return valid

    const lower = cat.toLowerCase()
    if (lower.includes('market') || lower.includes('stock')) return 'markets'
    if (lower.includes('econom') || lower.includes('macro')) return 'economy'
    if (lower.includes('earn')) return 'earnings'
    if (lower.includes('central') || lower.includes('fed') || lower.includes('cb')) return 'central_banks'
    if (lower.includes('geo') || lower.includes('politics') || lower.includes('war')) return 'geopolitics'
    if (lower.includes('sector') || lower.includes('industry')) return 'sector'
    if (lower.includes('compan') || lower.includes('corp')) return 'company'
    if (lower.includes('regul') || lower.includes('legal')) return 'regulation'

    return 'markets'
  }

  async fetchRSSCached(
    feedUrl: string,
    forceRefresh = false
  ): Promise<NewsItem[]> {
    const now = Date.now()
    const cached = this.cachedFeeds.get(feedUrl)

    if (!forceRefresh && cached && (now - new Date(cached.fetchedAt).getTime()) < this.cacheTTL) {
      return cached.items
    }

    try {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
      )

      if (!response.ok) {
        return cached?.items || []
      }

      const data = await response.json()
      const items: NewsItem[] = (data.items || []).map((item: any, index: number) => ({
        id: item.guid || `rss-${feedUrl}-${index}`,
        title: item.title || '',
        summary: item.description?.replace(/<[^>]*>/g, '').slice(0, 500) || '',
        url: item.link || '#',
        source: item.source?.name || data.feed?.title || 'RSS Feed',
        source_logo_url: null,
        category: this.normalizeCategory(item.categories?.[0] || 'markets'),
        published_at: item.pubDate || new Date().toISOString(),
        author: item.author || null,
        sentiment: null,
        symbols: [],
        is_mock: false,
        image_url: item.thumbnail || null,
      }))

      const deduplicated = this.deduplicate(items)
      this.cachedFeeds.set(feedUrl, { items: deduplicated, fetchedAt: new Date().toISOString() })

      return deduplicated
    } catch {
      return cached?.items || []
    }
  }

  clearCache(): void {
    this.cachedFeeds.clear()
  }
}
