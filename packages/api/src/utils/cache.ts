import NodeCache from 'node-cache';

const DEFAULT_TTL = 3600; // 1 hour

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class PreviewCache {
  private cache: NodeCache;

  constructor(ttl: number = DEFAULT_TTL) {
    this.cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: Math.min(ttl / 2, 300),
      useClones: true,
    });
  }

  get<T>(key: string): { data: T; hit: boolean } | null {
    const value = this.cache.get<T>(key);
    if (value === undefined) {
      return null;
    }
    return { data: value, hit: true };
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, data);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Global cache instance
export const previewCache = new PreviewCache();
