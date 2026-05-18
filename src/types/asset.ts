export const ASSET_CATEGORIES = [
  'equity',
  'etf',
  'index',
  'commodity',
  'currency',
  'crypto',
  'bond',
  'macro',
] as const

export type AssetCategory = (typeof ASSET_CATEGORIES)[number]

export const PERFORMANCE_PERIODS = [
  '1D',
  '5D',
  '1M',
  '3M',
  '6M',
  'YTD',
  '1Y',
] as const

export type PerformancePeriod = (typeof PERFORMANCE_PERIODS)[number]

export interface Asset {
  id: string
  symbol: string
  name: string
  category: AssetCategory
  exchange: string
  currency: string
  isin?: string | null
  sector?: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface MarketPrice {
  id: string
  asset_id: string
  asset?: Asset
  price: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  change: number
  change_percent: number
  previous_close: number
  source: string
  source_label: string
  is_mock: boolean
  fetched_at: string
}

export interface AssetWithPrice extends Asset {
  latest_price?: MarketPrice | null
}

export interface HistoricalPrice {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface AssetPerformance {
  symbol: string
  name: string
  category: AssetCategory
  period: PerformancePeriod
  return: number
  volatility?: number
  sharpe_ratio?: number
}
