export const CONFIDENCE_LEVELS = ['low', 'medium', 'high'] as const

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number]

export interface DailyMarketNote {
  id: string
  title: string
  content: string
  date: string
  tags?: string[] | null
  is_pinned: boolean
  created_at: string
  updated_at: string
  confidence?: ConfidenceLevel | null
  market_context?: string | null
}

export interface WhyDidItMoveNote {
  id: string
  title: string
  content: string
  symbol: string
  asset_id: string
  date: string
  event_cause?: string | null
  catalyst_summary: string
  confidence: ConfidenceLevel
  related_events?: string[] | null
  created_at: string
  updated_at: string
}

export interface TopicDeepDive {
  id: string
  title: string
  content: string
  topic: string
  tags: string[]
  related_series_codes: string[]
  sources: string[]
  created_at: string
  updated_at: string
}
