'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import ProviderStatusPanel from '@/components/admin/provider-status-panel'
import UpdateLogs from '@/components/admin/update-logs'
import RefreshButton from '@/components/admin/refresh-button'
import { Settings, Radio, Activity, Database } from 'lucide-react'

const MOCK_PROVIDERS = [
  { id: 'fred', name: 'FRED (Fed Economic Data)', status: 'online' as const, lastFetch: '2025-05-15 08:30:00', records: 2847, error: null },
  { id: 'marketaux', name: 'MarketAux (News)', status: 'online' as const, lastFetch: '2025-05-15 08:15:00', records: 1523, error: null },
  { id: 'polygon', name: 'Polygon (Prices)', status: 'degraded' as const, lastFetch: '2025-05-15 07:45:00', records: 8921, error: 'Rate limit at 85%' },
  { id: 'finnhub', name: 'Finnhub (Calendar)', status: 'online' as const, lastFetch: '2025-05-15 08:00:00', records: 456, error: null },
  { id: 'openai', name: 'OpenAI (Classification)', status: 'error' as const, lastFetch: '2025-05-14 23:00:00', records: 128, error: 'API returned 429: Too Many Requests' },
  { id: 'rss', name: 'RSS Feeds', status: 'idle' as const, lastFetch: null, records: 0, error: null },
]

const MOCK_LOGS = [
  { id: 'l1', provider: 'FRED', action: 'REFRESH', status: 'success' as const, message: 'Updated 12 series successfully', timestamp: '2025-05-15 08:30', duration: '2.3s' },
  { id: 'l2', provider: 'MarketAux', action: 'REFRESH', status: 'success' as const, message: 'Fetched 48 new articles', timestamp: '2025-05-15 08:15', duration: '1.8s' },
  { id: 'l3', provider: 'Polygon', action: 'REFRESH', status: 'success' as const, message: 'Updated prices for SPY, QQQ, TLT, AAPL, MSFT', timestamp: '2025-05-15 07:45', duration: '4.1s' },
  { id: 'l4', provider: 'Finnhub', action: 'REFRESH', status: 'success' as const, message: 'Synced 8 economic calendar events', timestamp: '2025-05-15 08:00', duration: '1.2s' },
  { id: 'l5', provider: 'OpenAI', action: 'CLASSIFY', status: 'error' as const, message: 'API rate limit exceeded. Retry in 60s.', timestamp: '2025-05-14 23:00', duration: '0.4s' },
  { id: 'l6', provider: 'FRED', action: 'REFRESH', status: 'success' as const, message: 'Updated CPI, PPI, NFP data series', timestamp: '2025-05-15 06:00', duration: '3.5s' },
  { id: 'l7', provider: 'MarketAux', action: 'REFRESH', status: 'success' as const, message: 'Fetched 32 new articles', timestamp: '2025-05-15 05:45', duration: '1.9s' },
  { id: 'l8', provider: 'Polygon', action: 'REFRESH', status: 'error' as const, message: 'Timeout after 10s on /v2/aggs/ticker/SPY', timestamp: '2025-05-15 05:30', duration: '10.0s' },
  { id: 'l9', provider: 'FRED', action: 'REFRESH', status: 'success' as const, message: 'Updated interest rate series', timestamp: '2025-05-15 04:00', duration: '2.1s' },
  { id: 'l10', provider: 'RSS', action: 'INIT', status: 'success' as const, message: 'RSS poller initialized with 12 feeds', timestamp: '2025-05-15 03:00', duration: '0.8s' },
  { id: 'l11', provider: 'MarketAux', action: 'REFRESH', status: 'success' as const, message: 'Fetched 25 new articles', timestamp: '2025-05-15 03:15', duration: '1.5s' },
  { id: 'l12', provider: 'Polygon', action: 'REFRESH', status: 'success' as const, message: 'Updated crypto prices: BTC, ETH, SOL', timestamp: '2025-05-15 03:00', duration: '3.2s' },
]

export default function AdminPage() {
  const { t } = useLanguage()
  const [rssFeedsConfig] = useState([
    { id: '1', url: 'https://feeds.ft.com/ft/news', enabled: true },
    { id: '2', url: 'https://www.wsj.com/xml/rss/3_7085.xml', enabled: true },
    { id: '3', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', enabled: true },
    { id: '4', url: 'https://feeds.bloomberg.com/markets/news.rss', enabled: false },
    { id: '5', url: 'https://www.zerohedge.com/rss.xml', enabled: false },
  ])

  const [watchlist] = useState([
    { id: '1', ticker: 'SPY', type: 'ETF', active: true },
    { id: '2', ticker: 'QQQ', type: 'ETF', active: true },
    { id: '3', ticker: 'TLT', type: 'ETF', active: true },
    { id: '4', ticker: 'AAPL', type: 'Stock', active: true },
    { id: '5', ticker: 'MSFT', type: 'Stock', active: true },
    { id: '6', ticker: 'NVDA', type: 'Stock', active: true },
    { id: '7', ticker: 'BTC-USD', type: 'Crypto', active: true },
    { id: '8', ticker: 'ETH-USD', type: 'Crypto', active: false },
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-accent" />
        <div>
          <h1 className="text-2xl font-display text-foreground">{t('admin.title')}</h1>
          <p className="text-sm text-muted mt-1">System monitoring and configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-foreground">{t('admin.providerStatus')}</h2>
          </div>
          <ProviderStatusPanel providers={MOCK_PROVIDERS} />
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-foreground">{t('admin.updateLogs')}</h2>
          </div>
          <UpdateLogs logs={MOCK_LOGS} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-foreground">{t('admin.rssConfig')}</h2>
          </div>
          <div className="space-y-3">
            {rssFeedsConfig.map(feed => (
              <div key={feed.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    feed.enabled ? 'bg-positive' : 'bg-muted',
                  )} />
                  <span className="text-sm text-foreground truncate max-w-[300px]">{feed.url}</span>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  feed.enabled ? 'bg-positive/10 text-positive' : 'bg-card text-muted border border-border',
                )}>
                  {feed.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-foreground">{t('admin.watchlistConfig')}</h2>
          </div>
          <div className="space-y-3">
            {watchlist.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    item.active ? 'bg-positive' : 'bg-muted',
                  )} />
                  <span className="text-sm font-mono font-semibold text-foreground">{item.ticker}</span>
                  <span className="text-xs text-muted">{item.type}</span>
                </div>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  item.active ? 'bg-positive/10 text-positive' : 'bg-card text-muted border border-border',
                )}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
