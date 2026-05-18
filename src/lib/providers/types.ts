export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface FetchLatestResult<T> {
  data: T[]
  source: string
  sourceLabel: string
  isMock: boolean
  fetchedAt: string
}

export interface FetchHistoricalResult<T> {
  data: T[]
  source: string
  sourceLabel: string
  isMock: boolean
  fetchedAt: string
}

export interface DataProvider<T> {
  name: string
  fetchLatest: (...args: any[]) => Promise<FetchLatestResult<T>>
  fetchHistorical: (symbol: string, interval?: string, startDate?: string, endDate?: string) => Promise<FetchHistoricalResult<T>>
  isAvailable: () => boolean
  rateLimit: RateLimitConfig
}
