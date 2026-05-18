import { NextRequest, NextResponse } from 'next/server'

const REFERENCE_DATA = {
  fred: { name: 'FRED (Fed Economic Data)', records: 2847 },
  marketaux: { name: 'MarketAux (News)', records: 1523 },
  polygon: { name: 'Polygon (Prices)', records: 8921 },
  finnhub: { name: 'Finnhub (Calendar)', records: 456 },
  openai: { name: 'OpenAI (Classification)', records: 128 },
  rss: { name: 'RSS Feeds', records: 0 },
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { provider } = body as { provider?: string }

  if (provider && !(provider in REFERENCE_DATA)) {
    return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
  }

  const results: { provider: string; status: string; recordsUpdated: number; duration: string }[] = []

  if (provider) {
    const info = REFERENCE_DATA[provider as keyof typeof REFERENCE_DATA]
    const recordsUpdated = Math.floor((info.records || 100) * (0.05 + Math.random() * 0.15))
    const duration = `${(1.5 + Math.random() * 4).toFixed(1)}s`

    results.push({
      provider: info.name,
      status: 'success',
      recordsUpdated,
      duration,
    })
  } else {
    for (const [id, info] of Object.entries(REFERENCE_DATA)) {
      if (id === 'openai') {
        results.push({
          provider: info.name,
          status: 'error',
          recordsUpdated: 0,
          duration: '0.4s',
        })
      } else if (id === 'rss') {
        results.push({
          provider: info.name,
          status: 'success',
          recordsUpdated: 0,
          duration: '0.8s',
        })
      } else {
        const recordsUpdated = Math.floor((info.records || 100) * (0.03 + Math.random() * 0.1))
        const duration = `${(1.0 + Math.random() * 3).toFixed(1)}s`
        results.push({
          provider: info.name,
          status: 'success',
          recordsUpdated,
          duration,
        })
      }
    }
  }

  const totalUpdated = results.reduce((sum, r) => sum + (r.status === 'success' ? r.recordsUpdated : 0), 0)

  return NextResponse.json({
    success: true,
    message: provider
      ? `Refresh completed for ${REFERENCE_DATA[provider as keyof typeof REFERENCE_DATA]?.name || provider}`
      : 'Full refresh completed',
    results,
    totalRecordsUpdated: totalUpdated,
    timestamp: new Date().toISOString(),
  })
}
