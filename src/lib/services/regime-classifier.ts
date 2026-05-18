import { REGIME_CLASSIFICATION_RULES, MARKET_REGIMES } from '@/lib/constants'
import type { MarketRegime, RegimeClassification, RegimeConfidence, IndicatorReading } from '@/types/regime'
import { MARKET_REGIMES as REGIME_KEYS } from '@/types/regime'

interface IndicatorValues {
  SPY_1M_RETURN: number
  VIX_LEVEL: number
  HY_SPREAD: number
  FEDFUNDS: number
  DGS2: number
  DGS10: number
  GDP_GROWTH: number
  PAYEMS_CHANGE: number
  CPI_YOY: number
  PCE_YOY: number
  BREAKEVEN_10Y: number
  DXY_1M_RETURN: number
  EM_CURRENCY_INDEX: number
  RREP: number
}

export class RegimeClassifier {
  private lastClassification: RegimeClassification | null = null

  async classifyRegime(indicatorValues: Partial<IndicatorValues>): Promise<RegimeClassification> {
    const defaultValues: IndicatorValues = {
      SPY_1M_RETURN: indicatorValues.SPY_1M_RETURN ?? 0.01,
      VIX_LEVEL: indicatorValues.VIX_LEVEL ?? 18,
      HY_SPREAD: indicatorValues.HY_SPREAD ?? 4.0,
      FEDFUNDS: indicatorValues.FEDFUNDS ?? 5.5,
      DGS2: indicatorValues.DGS2 ?? 4.5,
      DGS10: indicatorValues.DGS10 ?? 4.3,
      GDP_GROWTH: indicatorValues.GDP_GROWTH ?? 0.025,
      PAYEMS_CHANGE: indicatorValues.PAYEMS_CHANGE ?? 150,
      CPI_YOY: indicatorValues.CPI_YOY ?? 0.032,
      PCE_YOY: indicatorValues.PCE_YOY ?? 0.028,
      BREAKEVEN_10Y: indicatorValues.BREAKEVEN_10Y ?? 0.024,
      DXY_1M_RETURN: indicatorValues.DXY_1M_RETURN ?? 0.005,
      EM_CURRENCY_INDEX: indicatorValues.EM_CURRENCY_INDEX ?? -0.01,
      RREP: indicatorValues.RREP ?? 50,
    }

    const regimeScores: Record<string, { score: number; supporting: IndicatorReading[]; conflicting: IndicatorReading[] }> = {}

    for (const regimeEntry of Object.entries(REGIME_CLASSIFICATION_RULES)) {
      const [regime, config] = regimeEntry as [string, typeof REGIME_CLASSIFICATION_RULES[keyof typeof REGIME_CLASSIFICATION_RULES]]
      const supporting: IndicatorReading[] = []
      const conflicting: IndicatorReading[] = []
      let matchedCount = 0

      for (const condition of config.conditions) {
        const currentValue = this.getIndicatorValue(defaultValues, condition.indicator)
        if (currentValue === null) continue

        let met = false
        switch (condition.direction) {
          case 'above':
            met = currentValue > condition.threshold
            break
          case 'below':
            met = currentValue < condition.threshold
            break
          case 'below_1m_change': {
            const change = this.get1MChange(condition.indicator, currentValue)
            met = change < condition.threshold
            break
          }
        }

        const reading: IndicatorReading = {
          name: condition.indicator,
          value: currentValue,
          threshold: condition.threshold,
          signal: met ? 'supporting' : 'conflicting',
        }

        if (met) {
          supporting.push(reading)
          matchedCount++
        } else {
          conflicting.push(reading)
        }
      }

      const matchRatio = config.conditions.length > 0 ? matchedCount / config.conditions.length : 0
      const score = Math.round(matchRatio * 100 * config.weight)

      regimeScores[regime] = {
        score: Math.min(score, 100),
        supporting,
        conflicting,
      }
    }

    const sortedRegimes = Object.entries(regimeScores).sort(([, a], [, b]) => b.score - a.score)
    const topRegime = sortedRegimes[0]
    const secondRegime = sortedRegimes[1]

    if (!topRegime) {
      return this.buildResult('risk_on', 0, [], [], 'Insufficient data to classify market regime.')
    }

    const [regime, data] = topRegime as [MarketRegime, { score: number; supporting: IndicatorReading[]; conflicting: IndicatorReading[] }]

    if (data.score === 0 && secondRegime && secondRegime[1].score === 0) {
      return this.buildResult(
        'risk_on',
        15,
        [],
        [],
        'No regime confidently identified from available indicators. Defaulting to neutral risk-on stance.'
      )
    }

    const confidence = this.mapScoreToConfidence(data.score)
    const allSupporting = data.supporting
    const allConflicting = [
      ...data.conflicting,
      ...(secondRegime ? secondRegime[1].supporting.filter(r => !data.supporting.some(s => s.name === r.name)) : []),
    ].slice(0, 5)

    const regimeDetail = MARKET_REGIMES[regime] || MARKET_REGIMES.risk_on
    const explanation = this.buildExplanation(regime, data.score, allSupporting.length, allConflicting.length, regimeDetail.description)

    const result = this.buildResult(regime, confidence.score, allSupporting, allConflicting, explanation)
    this.lastClassification = result
    return result
  }

  private getIndicatorValue(values: IndicatorValues, indicator: string): number | null {
    const key = indicator as keyof IndicatorValues
    return values[key] ?? null
  }

  private get1MChange(_indicator: string, _currentValue: number): number {
    return _currentValue * -0.05
  }

  private mapScoreToConfidence(score: number): RegimeConfidence {
    if (score >= 70) return { score, label: 'high' }
    if (score >= 40) return { score, label: 'medium' }
    return { score, label: 'low' }
  }

  private buildExplanation(
    regime: string,
    score: number,
    supportingCount: number,
    conflictingCount: number,
    description: string
  ): string {
    const regimeName = MARKET_REGIMES[regime]?.name || regime
    const level = this.mapScoreToConfidence(score).label

    return `${regimeName} regime (${level} confidence, ${score}%). ${supportingCount} supporting and ${conflictingCount} conflicting indicators. ${description}`
  }

  private buildResult(
    regime: MarketRegime,
    score: number,
    supporting: IndicatorReading[],
    conflicting: IndicatorReading[],
    explanation: string
  ): RegimeClassification {
    return {
      id: `regime-${Date.now()}`,
      regime: regime as MarketRegime,
      confidence: this.mapScoreToConfidence(score),
      supporting_indicators: supporting,
      conflicting_indicators: conflicting,
      explanation,
      classified_at: new Date().toISOString(),
    }
  }

  getLastClassification(): RegimeClassification | null {
    return this.lastClassification
  }
}
