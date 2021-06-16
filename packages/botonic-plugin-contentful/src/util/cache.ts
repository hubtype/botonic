import { roughSizeOfObject } from './objects'

export const NOT_FOUND_IN_CACHE = Symbol('NOT_FOUND')

export interface Cache<V> {
  set(id: string, val: V): void
  get(id: string): V | typeof NOT_FOUND_IN_CACHE
  has(id: string): boolean
  del(id: string): void

  /**
   * @return size in KB
   */
  size(): number

  /**
   * Provides the Cache keys in undefined order 1 by 1
   * @param getMoreKeys will return true if the consumer of the keys wants another key
   */
  keys(): Generator<string>
}

export class InMemoryCache<V> implements Cache<V> {
  private cache: Record<string, V> = {}
  private sizeBytes = 0

  set(id: string, val: V): void {
    this.del(id)
    this.sizeBytes += roughSizeOfObject(id) + roughSizeOfObject(val)
    this.cache[id] = val
  }

  del(id: string): void {
    const val = this.get(id)
    if (val == NOT_FOUND_IN_CACHE) {
      return
    }
    delete this.cache[id]
    this.sizeBytes -= roughSizeOfObject(id) + roughSizeOfObject(val)
  }

  get(id: string): V | typeof NOT_FOUND_IN_CACHE {
    // Cache.has is only checked when undefined to avoid always searching twice in the object
    const val = this.cache[id]
    if (val === undefined && !this.has(id)) {
      return NOT_FOUND_IN_CACHE
    }
    return val
  }

  has(id: string): boolean {
    return id in this.cache
  }

  size(): number {
    return this.sizeBytes / 1024
  }

  len(): number {
    return Object.keys(this.cache).length
  }

  *keys(): Generator<string> {
    for (const k of Object.keys(this.cache)) {
      yield k
    }
  }
}

/**
 * Decorates a cache by limiting its size.
 *
 * TODO Use an external library to have a LRU cache. However, it's not critical
 * because typically data in CMS is small (we're not caching media, only their
 * URLs)
 */
export class LimitedCacheDecorator<V> implements Cache<V> {
  constructor(
    private readonly cache: Cache<V>,
    readonly limitKB: number,
    private readonly logger: (msg: string) => void = console.error,
    readonly sizeWarningsRatio = [0.5, 0.75, 0.9]
  ) {}

  set(id: string, val: V): void {
    const incBytes = roughSizeOfObject(id) + roughSizeOfObject(val)
    const checkFit = () =>
      this.cache.size() * 1024 + incBytes <= this.limitKB * 1024
    let itFits = checkFit()

    if (!itFits) {
      for (const k of this.cache.keys()) {
        if (itFits) {
          break
        }
        this.cache.del(k)
        itFits = checkFit()
      }
      if (!itFits) {
        this.logger(
          `Cannot add entry in cache because IT ALONE is larger than max capacity(${this.limitKB})`
        )
        return
      }
    }
    this.cache.set(id, val)
    this.warnSizeRatio(incBytes / 1024)
  }

  warnSizeRatio(incKB: number): void {
    const sizeKB = this.size()
    for (const warnRatio of this.sizeWarningsRatio.sort((a, b) => b - a)) {
      if (sizeKB / this.limitKB >= warnRatio && sizeKB - incKB < warnRatio) {
        this.logger(`Cache is now more than ${warnRatio * 100}% full`)
        return
      }
    }
  }

  get(id: string): V | typeof NOT_FOUND_IN_CACHE {
    return this.cache.get(id)
  }

  has(id: string): boolean {
    return this.cache.has(id)
  }
  del(id: string): void {
    return this.cache.del(id)
  }

  keys(): Generator<string> {
    return this.cache.keys()
  }

  size(): number {
    return this.cache.size()
  }
}
