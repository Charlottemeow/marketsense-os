export function formatPrice(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—'

  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  if (Math.abs(value) >= 1) {
    return value.toFixed(decimals)
  }

  return value.toFixed(Math.max(decimals, 4))
}

export function formatChange(value: number): string {
  if (!Number.isFinite(value)) return '—'

  const prefix = value > 0 ? '+' : ''
  return `${prefix}${formatPrice(value)}`
}

export function formatPercent(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—'

  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(decimals)}%`
}

export function formatLargeNumber(value: number): string {
  if (!Number.isFinite(value)) return '—'

  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toFixed(2)
}

export function formatCurrency(
  value: number,
  currency = 'USD',
  showSymbol = true
): string {
  if (!Number.isFinite(value)) return '—'

  try {
    return new Intl.NumberFormat('en-US', {
      style: showSymbol ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${showSymbol ? '$' : ''}${formatPrice(value)}`
  }
}

export function formatCompactCurrency(value: number, currency = 'USD'): string {
  if (!Number.isFinite(value)) return '—'

  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥'

  if (Math.abs(value) >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`
  }
  if (Math.abs(value) >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(1)}K`
  }

  return `${symbol}${value.toFixed(2)}`
}

export function formatVolume(value: number): string {
  if (!Number.isFinite(value)) return '—'

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

export function formatBasisPoint(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return `${(value * 100).toFixed(0)} bps`
}

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}
