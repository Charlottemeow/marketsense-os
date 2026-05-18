interface RateLimitEntry {
  count: number
  windowStart: number
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(private cleanupMs: number = 60000) {
    this.startCleanup()
  }

  private startCleanup(): void {
    if (this.cleanupInterval) return
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, this.cleanupMs)
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of Array.from(this.store.entries())) {
      if (now - entry.windowStart >= this.cleanupMs) {
        this.store.delete(key)
      }
    }
  }

  canCall(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now - entry.windowStart >= windowMs) {
      this.store.set(key, { count: 1, windowStart: now })
      return true
    }

    if (entry.count < maxRequests) {
      entry.count++
      return true
    }

    return false
  }

  async waitAndCall<T>(
    key: string,
    maxRequests: number,
    windowMs: number,
    fn: () => Promise<T>
  ): Promise<T> {
    while (!this.canCall(key, maxRequests, windowMs)) {
      await this.delay(100)
    }

    return fn()
  }

  getRemainingRequests(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now - entry.windowStart >= windowMs) {
      return maxRequests
    }

    return Math.max(0, maxRequests - entry.count)
  }

  getTimeUntilReset(key: string, windowMs: number): number {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry) return 0

    const elapsed = now - entry.windowStart
    return Math.max(0, windowMs - elapsed)
  }

  reset(key: string): void {
    this.store.delete(key)
  }

  resetAll(): void {
    this.store.clear()
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.store.clear()
  }
}
