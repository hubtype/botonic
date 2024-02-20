import { Cache, InMemoryCache, NOT_FOUND_IN_CACHE } from './cache'

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

export interface MemoizerOptions {
  strategy: MemoizerStrategy
  cacheFactory?: () => Cache<any>
  normalizer?: MemoizerNormalizer
}

export class Memoizer {
  opts: Required<MemoizerOptions>
  constructor(opts: MemoizerOptions) {
    this.opts = {
      strategy: opts.strategy,
      normalizer: opts.normalizer || jsonNormalizer,
      cacheFactory: opts.cacheFactory || (() => new InMemoryCache<any>()),
    }
  }

  memoize<
    Args extends any[],
    Return,
    F extends (...args: Args) => Promise<Return>,
  >(func: F): F {
    const cache: Cache<Return> = this.opts.cacheFactory()
    const f = (...args: Args) =>
      this.opts.strategy<Args, Return>(
        cache,
        this.opts.normalizer,
        func,
        ...args
      )
    return f as F
  }
}

/***
 * Only re-invoke if not in cache
 */
export const cacheForeverStrategy: MemoizerStrategy = async <
  Args extends any[],
  Return,
>(
  cache: Cache<Return>,
  normalizer = jsonNormalizer,
  func: (...args: Args) => Promise<Return>,
  ...args: Args
) => {
  const id = normalizer(...args)
  let val = cache.get(id)
  if (val === NOT_FOUND_IN_CACHE) {
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
      if (oldVal !== NOT_FOUND_IN_CACHE) {
        await usingFallback(String(func.name), args, e)
        return oldVal
      }
      throw e
    }
  }
}
