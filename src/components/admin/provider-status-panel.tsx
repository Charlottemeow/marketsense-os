'use client'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import RefreshButton from './refresh-button'
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface ProviderStatus {
  id: string
  name: string
  status: 'online' | 'degraded' | 'error' | 'idle'
  lastFetch: string | null
  records: number
  error: string | null
}

interface ProviderStatusPanelProps {
  providers: ProviderStatus[]
}

const statusConfig = {
  online: { icon: CheckCircle, color: 'text-positive' },
  degraded: { icon: AlertTriangle, color: 'text-warning' },
  error: { icon: XCircle, color: 'text-negative' },
  idle: { icon: Clock, color: 'text-muted' },
}

export default function ProviderStatusPanel({ providers }: ProviderStatusPanelProps) {
  const { t } = useLanguage()

  const statusLabel = (status: ProviderStatus['status']): string => {
    const map: Record<string, string> = {
      online: t('admin.healthy'),
      degraded: t('admin.healthy'),
      error: t('admin.error2'),
      idle: t('admin.notConfigured'),
    }
    return map[status]
  }

  return (
    <div className="space-y-3">
      {providers.map(provider => {
        const config = statusConfig[provider.status]
        const Icon = config.icon

        return (
          <div
            key={provider.id}
            className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Icon className={cn('w-4 h-4 shrink-0', config.color)} />
              <div>
                <div className="text-sm font-medium text-foreground">{provider.name}</div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted">
                  <span>
                    {t('admin.status')}: <span className={cn('font-medium', config.color)}>{statusLabel(provider.status)}</span>
                  </span>
                  {provider.lastFetch && (
                    <span>{t('admin.lastFetch')}: {provider.lastFetch}</span>
                  )}
                  <span>{t('admin.records')}: {provider.records}</span>
                </div>
                {provider.error && (
                  <div className="mt-1 text-xs text-negative">{provider.error}</div>
                )}
              </div>
            </div>
            <RefreshButton providerId={provider.id} label={t('admin.refreshNow')} />
          </div>
        )
      })}
    </div>
  )
}
