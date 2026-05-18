import { APP_TIMEZONE } from '@/lib/constants'

export function formatHKT(date: Date | string, format: 'date' | 'time' | 'datetime' | 'relative' = 'datetime'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  try {
    switch (format) {
      case 'date':
        return d.toLocaleDateString('en-US', {
          timeZone: APP_TIMEZONE,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      case 'time':
        return d.toLocaleTimeString('en-US', {
          timeZone: APP_TIMEZONE,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      case 'relative':
        return formatRelativeTime(d)
      case 'datetime':
      default:
        return d.toLocaleDateString('en-US', {
          timeZone: APP_TIMEZONE,
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
    }
  } catch {
    return d.toISOString()
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(Math.abs(diffMs) / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    timeZone: APP_TIMEZONE,
    month: 'short',
    day: 'numeric',
  })
}

export function getLastBusinessDay(date: Date = new Date()): Date {
  const d = new Date(date)
  let day = d.getDay()

  while (day === 0 || day === 6) {
    d.setDate(d.getDate() - 1)
    day = d.getDay()
  }

  return d
}

export function daysSince(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  return Math.floor(diffMs / 86400000)
}

export function isMarketOpen(date: Date = new Date()): boolean {
  const d = new Date(date)
  const day = d.getUTCDay()

  if (day === 0 || day === 6) return false

  const hourEST = d.getUTCHours() - 5
  const minEST = d.getUTCMinutes()
  const timeEST = hourEST * 60 + minEST

  return timeEST >= 570 && timeEST <= 960
}

export function dateToISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function calculatePercentile(data: number[], value: number): number {
  if (data.length === 0) return 50
  const below = data.filter(v => v < value).length
  return Math.round((below / data.length) * 100)
}
