export class Cache<V> {
  static readonly NOT_FOUND = Symbol('NOT_FOUND')
  cache: Record<string, V> = {}
  set(id: string, val: V): void {
    this.cache[id] = val
  }
  get(id: string): V | typeof Cache.NOT_FOUND {
    // Cache.has is only checked when undefined to avoid always searching twice in the object
    const val = this.cache[id]
    if (val === undefined && !this.has(id)) {
      return Cache.NOT_FOUND
    }
    return val
  }
  has(id: string): boolean {
    return id in this.cache
  }
}

export type MemoizerNormalizer = (...args: any) => string

export const jsonNormalizer: MemoizerNormalizer = (...args: any) => {
  return JSON.stringify(args)
}

export type MemoizedFunction<Args extends any[], Return> = (
  ...args: Args
) => Promise<Return> //& { cache: Cache<Return> }

export type MemoizerStrategy = <Args extends any[], Return>(
  cache: Cache<Return>,
  normalizer: typeof jsonNormalizer,
  func: (...args: Args) => Promise<Return>,
  ...args: Args
) => Promise<Return>

export class Memoizer {
  constructor(
    private readonly strategy: MemoizerStrategy,
    private readonly cacheFactory = () => new Cache<any>(),
    private readonly normalizer = jsonNormalizer
  ) {}

  memoize<
    Args extends any[],
    Return,
    F extends (...args: Args) => Promise<Return>
  >(func: F): F {
    const cache: Cache<Return> = this.cacheFactory()
    const f = (...args: Args) =>
      this.strategy<Args, Return>(cache, this.normalizer, func, ...args)
    return f as F
  }
}

/***
 * Only re-invoke if not in cache
 */
export const cacheForeverStrategy: MemoizerStrategy = async <
  Args extends any[],
  Return
>(
  cache: Cache<Return>,
  normalizer = jsonNormalizer,
  func: (...args: Args) => Promise<Return>,
  ...args: Args
) => {
  const id = normalizer(...args)
  let val = cache.get(id)
  if (val === Cache.NOT_FOUND) {
    val = await func(...args)
    cache.set(id, val)
  }
  return val
}

/**
 * Always invokes the function, but fallbacks to last invocation result if available
 */
export function fallbackStrategy(
  usingFallback: (functName: string, args: any[], error: any) => Promise<void>
): MemoizerStrategy {
  return async <Args extends any[], Return>(
    cache: Cache<Return>,
    normalizer = jsonNormalizer,
    func: (...args: Args) => Promise<Return>,
    ...args: Args
  ) => {
    const id = normalizer(...args)
    const oldVal = cache.get(id)

    try {
      const newVal = await func(...args)
      cache.set(id, newVal)
      return newVal
    } catch (e) {
      if (oldVal !== Cache.NOT_FOUND) {
        await usingFallback(String(func.name), args, e)
        return oldVal
      }
      throw e
    }
  }
}
