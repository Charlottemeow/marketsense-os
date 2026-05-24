'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { RefreshCw, Loader2 } from 'lucide-react'

interface RefreshButtonProps {
  providerId: string
  label?: string
  onRefresh?: (providerId: string) => Promise<void>
  size?: 'sm' | 'md'
}

export default function RefreshButton({ providerId, label, onRefresh, size = 'sm' }: RefreshButtonProps) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const displayLabel = label ?? t('admin.refreshNow')

  const handleClick = async () => {
    setLoading(true)
    try {
      if (onRefresh) {
        await onRefresh(providerId)
      } else {
        const res = await fetch('/api/admin/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: providerId }),
        })
        if (!res.ok) throw new Error('Refresh failed')
      }
    } catch (err) {
      console.error('Refresh error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md transition-colors',
        size === 'sm'
          ? 'px-2.5 py-1 text-xs bg-card border border-border hover:bg-card-hover text-muted hover:text-foreground'
          : 'px-3 py-1.5 text-sm bg-accent text-accent-foreground hover:opacity-90',
        loading && 'opacity-50 cursor-not-allowed',
      )}
    >
      {loading ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      ) : (
        <RefreshCw className={cn(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      )}
      {loading ? t('common.loading') : displayLabel}
    </button>
  )
}
