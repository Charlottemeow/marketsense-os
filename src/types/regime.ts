export const MARKET_REGIMES = [
  'risk_on',
  'risk_off',
  'higher_for_longer',
  'growth_scare',
  'inflation_scare',
  'usd_liquidity_stress',
] as const

export type MarketRegime = (typeof MARKET_REGIMES)[number]

export interface RegimeConfidence {
  score: number
  label: string
}

export interface IndicatorReading {
  name: string
  value: number
  threshold: number
  signal: 'supporting' | 'conflicting' | 'neutral'
}

export interface RegimeClassification {
  id?: string
  regime: MarketRegime
  confidence: RegimeConfidence
  supporting_indicators: IndicatorReading[]
  conflicting_indicators: IndicatorReading[]
  explanation: string
  classified_at: string
  source?: string | null
  asset_id?: string | null
}

export interface RegimeTransition {
  from: MarketRegime
  to: MarketRegime
  triggered_at: string
  reason: string
}
