export const RECOMMENDATIONS = [
  'strong_buy',
  'buy',
  'hold',
  'sell',
  'strong_sell',
] as const

export type Recommendation = (typeof RECOMMENDATIONS)[number]

export const PITCH_STATUSES = ['draft', 'active', 'completed', 'archived'] as const

export type PitchStatus = (typeof PITCH_STATUSES)[number]

export interface PitchStep {
  id: string
  stock_pitch_id: string
  step_number: number
  title: string
  content: string
  checklist_items: string[]
}

export interface StockPitch {
  id: string
  symbol: string
  asset_id: string
  title: string
  recommendation: Recommendation
  status: PitchStatus
  entry_price?: number | null
  current_price?: number | null
  target_price?: number | null
  stop_loss?: number | null
  steps?: PitchStep[] | null
  tags?: string[] | null
  notes?: string | null
  confidence?: number | null
  created_at: string
  updated_at: string
}
