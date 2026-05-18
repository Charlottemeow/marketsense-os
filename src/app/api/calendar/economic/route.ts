import { NextRequest, NextResponse } from 'next/server'

const MOCK_EVENTS = [
  {
    id: 'e1',
    title: 'Initial Jobless Claims',
    date: '2025-05-15',
    time: '08:30 ET',
    country: 'US',
    previous: '231K',
    consensus: '228K',
    importance: 'high' as const,
    category: 'Employment',
  },
  {
    id: 'e2',
    title: 'Philadelphia Fed Manufacturing Index',
    date: '2025-05-15',
    time: '08:30 ET',
    country: 'US',
    previous: '5.2',
    consensus: '3.8',
    importance: 'medium' as const,
    category: 'Manufacturing',
  },
  {
    id: 'e3',
    title: 'Industrial Production MoM',
    date: '2025-05-15',
    time: '09:15 ET',
    country: 'US',
    previous: '0.1%',
    consensus: '0.2%',
    importance: 'medium' as const,
    category: 'Industrial',
  },
  {
    id: 'e4',
    title: 'NAHB Housing Market Index',
    date: '2025-05-15',
    time: '10:00 ET',
    country: 'US',
    previous: '42',
    consensus: '44',
    importance: 'low' as const,
    category: 'Housing',
  },
  {
    id: 'e5',
    title: 'Fed Governor Waller Speaks',
    date: '2025-05-15',
    time: '12:00 ET',
    country: 'US',
    previous: null,
    consensus: null,
    importance: 'high' as const,
    category: 'Fed Speakers',
  },
  {
    id: 'e6',
    title: 'UK CPI YoY',
    date: '2025-05-16',
    time: '02:00 ET',
    country: 'GB',
    previous: '2.8%',
    consensus: '2.6%',
    importance: 'high' as const,
    category: 'Inflation',
  },
  {
    id: 'e7',
    title: 'Eurozone Final CPI YoY',
    date: '2025-05-16',
    time: '05:00 ET',
    country: 'EU',
    previous: '2.3%',
    consensus: '2.2%',
    importance: 'high' as const,
    category: 'Inflation',
  },
  {
    id: 'e8',
    title: 'US Building Permits',
    date: '2025-05-16',
    time: '08:30 ET',
    country: 'US',
    previous: '1.48M',
    consensus: '1.45M',
    importance: 'medium' as const,
    category: 'Housing',
  },
  {
    id: 'e9',
    title: 'US Housing Starts',
    date: '2025-05-16',
    time: '08:30 ET',
    country: 'US',
    previous: '1.42M',
    consensus: '1.40M',
    importance: 'medium' as const,
    category: 'Housing',
  },
  {
    id: 'e10',
    title: 'Michigan Consumer Sentiment (Preliminary)',
    date: '2025-05-16',
    time: '10:00 ET',
    country: 'US',
    previous: '75.2',
    consensus: '76.0',
    importance: 'high' as const,
    category: 'Consumer',
  },
  {
    id: 'e11',
    title: 'Japan National CPI YoY',
    date: '2025-05-19',
    time: '18:30 ET',
    country: 'JP',
    previous: '2.5%',
    consensus: '2.4%',
    importance: 'high' as const,
    category: 'Inflation',
  },
  {
    id: 'e12',
    title: 'FOMC Meeting Minutes',
    date: '2025-05-21',
    time: '14:00 ET',
    country: 'US',
    previous: null,
    consensus: null,
    importance: 'high' as const,
    category: 'Central Bank',
  },
  {
    id: 'e13',
    title: 'US Existing Home Sales',
    date: '2025-05-22',
    time: '10:00 ET',
    country: 'US',
    previous: '4.12M',
    consensus: '4.15M',
    importance: 'medium' as const,
    category: 'Housing',
  },
  {
    id: 'e14',
    title: 'US Durable Goods Orders',
    date: '2025-05-23',
    time: '08:30 ET',
    country: 'US',
    previous: '2.1%',
    consensus: '1.5%',
    importance: 'high' as const,
    category: 'Manufacturing',
  },
  {
    id: 'e15',
    title: 'US PCE Price Index YoY',
    date: '2025-05-30',
    time: '08:30 ET',
    country: 'US',
    previous: '2.5%',
    consensus: '2.4%',
    importance: 'high' as const,
    category: 'Inflation',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const importance = searchParams.get('importance')
  const limit = parseInt(searchParams.get('limit') || '20')

  let filtered = [...MOCK_EVENTS]

  if (startDate) {
    filtered = filtered.filter(e => e.date >= startDate)
  }

  if (endDate) {
    filtered = filtered.filter(e => e.date <= endDate)
  }

  if (importance && ['high', 'medium', 'low'].includes(importance)) {
    filtered = filtered.filter(e => e.importance === importance)
  }

  filtered = filtered.slice(0, limit)

  return NextResponse.json({
    success: true,
    total: MOCK_EVENTS.length,
    returned: filtered.length,
    events: filtered,
    updatedAt: new Date().toISOString(),
  })
}
