import { NextRequest, NextResponse } from 'next/server'

const MOCK_FRED_DATA = {
  GDP: {
    seriesId: 'GDP',
    name: 'Gross Domestic Product',
    frequency: 'Quarterly',
    unit: 'Billions of Dollars',
    observations: [
      { date: '2024-Q3', value: '28265.4' },
      { date: '2024-Q4', value: '28450.2' },
      { date: '2025-Q1', value: '28580.1' },
    ],
  },
  CPIAUCSL: {
    seriesId: 'CPIAUCSL',
    name: 'Consumer Price Index for All Urban Consumers',
    frequency: 'Monthly',
    unit: 'Index 1982-1984=100',
    observations: [
      { date: '2025-02', value: '319.08' },
      { date: '2025-03', value: '319.85' },
      { date: '2025-04', value: '320.52' },
    ],
  },
  UNRATE: {
    seriesId: 'UNRATE',
    name: 'Unemployment Rate',
    frequency: 'Monthly',
    unit: 'Percent',
    observations: [
      { date: '2025-02', value: '3.9' },
      { date: '2025-03', value: '3.8' },
      { date: '2025-04', value: '4.0' },
    ],
  },
  FEDFUNDS: {
    seriesId: 'FEDFUNDS',
    name: 'Federal Funds Effective Rate',
    frequency: 'Monthly',
    unit: 'Percent',
    observations: [
      { date: '2025-02', value: '5.33' },
      { date: '2025-03', value: '5.33' },
      { date: '2025-04', value: '5.33' },
    ],
  },
  DGS10: {
    seriesId: 'DGS10',
    name: '10-Year Treasury Constant Maturity Rate',
    frequency: 'Daily',
    unit: 'Percent',
    observations: [
      { date: '2025-05-13', value: '4.48' },
      { date: '2025-05-14', value: '4.46' },
      { date: '2025-05-15', value: '4.42' },
    ],
  },
  T10YIE: {
    seriesId: 'T10YIE',
    name: '10-Year Breakeven Inflation Rate',
    frequency: 'Daily',
    unit: 'Percent',
    observations: [
      { date: '2025-05-13', value: '2.38' },
      { date: '2025-05-14', value: '2.36' },
      { date: '2025-05-15', value: '2.35' },
    ],
  },
  PAYEMS: {
    seriesId: 'PAYEMS',
    name: 'Total Nonfarm Payrolls',
    frequency: 'Monthly',
    unit: 'Thousands of Persons',
    observations: [
      { date: '2025-02', value: '158932' },
      { date: '2025-03', value: '159204' },
      { date: '2025-04', value: '159379' },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const seriesId = searchParams.get('series_id')
  const limit = parseInt(searchParams.get('limit') || '10')

  let data
  if (seriesId && seriesId in MOCK_FRED_DATA) {
    const series = MOCK_FRED_DATA[seriesId as keyof typeof MOCK_FRED_DATA]
    data = {
      ...series,
      observations: series.observations.slice(-limit),
    }
  } else if (!seriesId) {
    data = MOCK_FRED_DATA
  } else {
    return NextResponse.json({ error: `Series '${seriesId}' not found` }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    source: 'FRED',
    data,
    updatedAt: new Date().toISOString(),
  })
}
