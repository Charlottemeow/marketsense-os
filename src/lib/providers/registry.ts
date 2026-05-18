import type { DataProvider, FetchLatestResult, FetchHistoricalResult } from './types'
import { DATA_SOURCE_PRIORITY } from '@/lib/constants'

type AnyProvider = DataProvider<any>

export class ProviderRegistry {
  private static instance: ProviderRegistry
  private providers: Map<string, AnyProvider> = new Map()
  private activeProviderName: string | null = null

  static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry()
    }
    return ProviderRegistry.instance
  }

  register(provider: AnyProvider): void {
    this.providers.set(provider.name, provider)
    if (!this.activeProviderName && provider.isAvailable()) {
      this.activeProviderName = provider.name
    }
  }

  registerMany(providers: AnyProvider[]): void {
    for (const provider of providers) {
      this.register(provider)
    }
    this.resolveActiveProvider()
  }

  private resolveActiveProvider(): void {
    for (const name of DATA_SOURCE_PRIORITY) {
      const provider = this.providers.get(name)
      if (provider?.isAvailable()) {
        this.activeProviderName = name
        return
      }
    }
    const firstAvailable = Array.from(this.providers.values()).find(p => p.isAvailable())
    if (firstAvailable) {
      this.activeProviderName = firstAvailable.name
    }
  }

  getActiveProvider<T>(): DataProvider<T> | null {
    if (this.activeProviderName) {
      return (this.providers.get(this.activeProviderName) as DataProvider<T>) || null
    }
    return null
  }

  getProvider<T>(name: string): DataProvider<T> | null {
    return (this.providers.get(name) as DataProvider<T>) || null
  }

  getAllProviders(): AnyProvider[] {
    return Array.from(this.providers.values())
  }

  getAvailableProviders(): AnyProvider[] {
    return Array.from(this.providers.values()).filter(p => p.isAvailable())
  }

  async fetchLatest<T>(...args: any[]): Promise<FetchLatestResult<T>> {
    const active = this.getActiveProvider<T>()
    if (active) {
      return active.fetchLatest(...args)
    }
    const available = Array.from(this.providers.values()).find(p => p.isAvailable())
    if (available) {
      return (available as DataProvider<T>).fetchLatest(...args)
    }
    return {
      data: [],
      source: 'none',
      sourceLabel: 'No Provider Available',
      isMock: true,
      fetchedAt: new Date().toISOString(),
    }
  }

  async fetchHistorical<T>(symbol: string, interval?: string, startDate?: string, endDate?: string): Promise<FetchHistoricalResult<T>> {
    const active = this.getActiveProvider<T>()
    if (active) {
      return active.fetchHistorical(symbol, interval, startDate, endDate)
    }
    const available = Array.from(this.providers.values()).find(p => p.isAvailable())
    if (available) {
      return (available as DataProvider<T>).fetchHistorical(symbol, interval, startDate, endDate)
    }
    return {
      data: [],
      source: 'none',
      sourceLabel: 'No Provider Available',
      isMock: true,
      fetchedAt: new Date().toISOString(),
    }
  }
}
