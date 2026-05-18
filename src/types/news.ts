import type { MacroCategory } from './macro'

export const NEWS_CATEGORIES = [
  'markets',
  'economy',
  'earnings',
  'central_banks',
  'geopolitics',
  'sector',
  'company',
  'regulation',
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const EVENT_IMPORTANCE = ['low', 'medium', 'high'] as const

export type EventImportance = (typeof EVENT_IMPORTANCE)[number]

export interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  source: string
  source_logo_url?: string | null
  category: NewsCategory
  published_at: string
  author?: string | null
  sentiment?: number | null
  symbols?: string[] | null
  is_mock: boolean
  image_url?: string | null
}

export interface EconomicEvent {
  id: string
  title: string
  date: string
  country: string
  category: MacroCategory
  importance: EventImportance
  previous: number | null
  forecast: number | null
  actual: number | null
  revised: number | null
  source: string
  source_label: string
  is_mock: boolean
}

export interface RSSFeedConfig {
  id: string
  url: string
  name: string
  category: NewsCategory
  enabled: boolean
  update_interval_minutes: number
}
