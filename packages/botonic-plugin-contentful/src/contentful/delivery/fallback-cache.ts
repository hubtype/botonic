import * as contentful from 'contentful'
import { ContentType } from 'contentful'

import { fallbackStrategy, Memoizer } from '../../util/memoizer'
import {
  ClientApiErrorReporter,
  GetEntriesType,
  GetEntryType,
  ReducedClientApi,
} from './client-api'

export class FallbackCachedClientApi implements ReducedClientApi {
  numRecoveredErrors = 0
  memoizer: Memoizer
  readonly getAsset: (id: string, query?: any) => Promise<contentful.Asset>
  readonly getAssets: (query?: any) => Promise<contentful.AssetCollection>
  readonly getEntries: GetEntriesType
  readonly getEntry: GetEntryType
  readonly getContentType: (id: string) => Promise<ContentType>

  constructor(
    readonly client: ReducedClientApi,
    reporter: ClientApiErrorReporter
  ) {
    // We could maybe use a more optimal normalizer than jsonNormalizer
    // (like they do in fast-json-stringify to avoid JSON.stringify for functions with a single nulls, numbers and booleans).
    // But it's not worth since stringify will have a cost much lower than constructing/rendering a botonic component
    // (and we're already optimizing the costly call to CMS)
    this.memoizer = new Memoizer(
      fallbackStrategy((f, args, e) =>
        reporter(
          `Successfully used cached fallback after Contentful API error`,
          f,
          args,
          e
        )
      )
    )
    this.getAsset = this.memoize(client.getAsset.bind(client))
    this.getAssets = this.memoize(client.getAssets.bind(client))
    this.getEntries = this.memoize(
      client.getEntries.bind(client)
    ) as GetEntriesType
    this.getEntry = this.memoize(client.getEntry.bind(client)) as GetEntryType
    this.getContentType = this.memoize(client.getContentType.bind(client))
  }

  memoize<
    Args extends any[],
    Return,
    F extends (...args: Args) => Promise<Return>
  >(func: F): F {
    return this.memoizer.memoize<Args, Return, F>(func)
  }
}
