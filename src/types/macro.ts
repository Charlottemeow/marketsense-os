export const MACRO_CATEGORIES = [
  'interest_rates',
  'inflation',
  'employment',
  'gdp',
  'housing',
  'consumer',
  'manufacturing',
  'services',
  'trade',
  'sentiment',
] as const

export type MacroCategory = (typeof MACRO_CATEGORIES)[number]

export const MACRO_FREQUENCIES = [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'annual',
] as const

export type MacroFrequency = (typeof MACRO_FREQUENCIES)[number]

export interface MacroSeries {
  id: string
  fred_code: string
  name: string
  category: MacroCategory
  unit: string
  frequency: MacroFrequency
  seasonally_adjusted: boolean
  last_updated: string
  description: string
}

export interface MacroObservation {
  id: string
  series_id: string
  series?: MacroSeries
  date: string
  value: number
  change: number | null
  change_percent: number | null
}

export interface MacroSeriesWithObservations extends MacroSeries {
  observations: MacroObservation[]
  latest_value?: number | null
  previous_value?: number | null
  latest_change?: number | null
  latest_change_percent?: number | null
}
