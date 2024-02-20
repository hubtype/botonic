import * as contentful from 'contentful'
import { ContentType } from 'contentful'

import { InMemoryCache, LimitedCacheDecorator } from '../../util/cache'
import { fallbackStrategy, Memoizer } from '../../util/memoizer'
import {
  ClientApiErrorReporter,
  GetEntriesType,
  GetEntryType,
  ReducedClientApi,
} from './client-api'

/**
 * Use memoization to remember forever the last successful result, and use it
 * whenever Contentful fails.
 */
export class FallbackCachedClientApi implements ReducedClientApi {
  numRecoveredErrors = 0
  memoizer: Memoizer
  readonly getAsset: (id: string, query?: any) => Promise<contentful.Asset>
  readonly getAssets: (query?: any) => Promise<contentful.AssetCollection>
  readonly getEntries: GetEntriesType
  readonly getEntry: GetEntryType
  readonly getContentType: (id: string) => Promise<ContentType>
  private static readonly NUM_APIS = 5
  private numMemoizations = 0

  constructor(
    client: ReducedClientApi,
    cacheLimitKB: number,
    reporter: ClientApiErrorReporter,
    logger: (msg: string) => void = console.error
  ) {
    // TODO share the same cache for all APIs to avoid reaching a Memoizer limit
    // while others have empty space
    const memoizerCache = () =>
      new LimitedCacheDecorator(
        new InMemoryCache<any>(),
        cacheLimitKB / FallbackCachedClientApi.NUM_APIS,
        logger
      )
    // We could maybe use a more optimal normalizer than jsonNormalizer
    // (like they do in fast-json-stringify to avoid JSON.stringify for functions with a single nulls, numbers and booleans).
    // But it's not worth since stringify will have a cost much lower than constructing/rendering a botonic component
    // (and we're already optimizing the costly call to CMS)
    this.memoizer = new Memoizer({
      cacheFactory: memoizerCache,
      strategy: fallbackStrategy((f, args, e) =>
        reporter(
          `Successfully used cached fallback after Contentful API error`,
          f,
          args,
          e
        )
      ),
    })
    this.getAsset = this.memoize(client.getAsset.bind(client))
    this.getAssets = this.memoize(client.getAssets.bind(client))
    this.getEntries = this.memoize(
      client.getEntries.bind(client)
    ) as GetEntriesType
    this.getEntry = this.memoize(client.getEntry.bind(client)) as GetEntryType
    this.getContentType = this.memoize(client.getContentType.bind(client))
    if (this.numMemoizations != FallbackCachedClientApi.NUM_APIS) {
      throw new Error(
        'FallbackCachedClientApi.NUM_APIS must equal the number of memoized APIs'
      )
    }
  }

  memoize<
    Args extends any[],
    Return,
    F extends (...args: Args) => Promise<Return>,
  >(func: F): F {
    this.numMemoizations++
    return this.memoizer.memoize<Args, Return, F>(func)
  }
}
