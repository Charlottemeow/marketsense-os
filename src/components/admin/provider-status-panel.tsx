'use client'

import { cn } from '@/lib/utils'
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
  online: { icon: CheckCircle, color: 'text-positive', label: 'Online' },
  degraded: { icon: AlertTriangle, color: 'text-warning', label: 'Degraded' },
  error: { icon: XCircle, color: 'text-negative', label: 'Error' },
  idle: { icon: Clock, color: 'text-muted', label: 'Idle' },
}

export default function ProviderStatusPanel({ providers }: ProviderStatusPanelProps) {
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
                    Status: <span className={cn('font-medium', config.color)}>{config.label}</span>
                  </span>
                  {provider.lastFetch && (
                    <span>Last fetch: {provider.lastFetch}</span>
                  )}
                  <span>Records: {provider.records}</span>
                </div>
                {provider.error && (
                  <div className="mt-1 text-xs text-negative">{provider.error}</div>
                )}
              </div>
            </div>
            <RefreshButton providerId={provider.id} label="Refresh Now" />
          </div>
        )
      })}
    </div>
  )
}
