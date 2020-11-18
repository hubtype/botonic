import * as contentful from 'contentful'
import { ContentfulCollection, ContentType, Entry } from 'contentful'
import memoize from 'memoizee'

import { ReducedClientApi } from './client-api'

export class CachedClientApi implements ReducedClientApi {
  readonly getAsset: (id: string, query?: any) => Promise<contentful.Asset>
  readonly getAssets: (query?: any) => Promise<contentful.AssetCollection>
  readonly getEntries: <T>(query: any) => Promise<contentful.EntryCollection<T>>
  readonly getEntry: <T>(id: string, query?: any) => Promise<Entry<T>>
  readonly getContentType: (id: string) => Promise<ContentType>
  readonly getContentTypes: () => Promise<ContentfulCollection<ContentType>>

  constructor(readonly client: ReducedClientApi, readonly cacheTtlMs = 10000) {
    const options = (length: number) =>
      ({
        primitive: true,
        maxAge: cacheTtlMs,
        length,
        normalizer: function (...args: any): string {
          return args
            .map((arg: any) => JSON.stringify(arg))
            .reduce((a: string, b: string) => a + b)
        },
      } as memoize.Options<any>)

    this.getAsset = memoize(client.getAsset, options(2))
    this.getAssets = memoize(client.getAssets, options(1))
    this.getEntries = memoize(client.getEntries, options(1))
    this.getEntry = memoize(client.getEntry, options(2))
    this.getContentType = memoize(client.getContentType, options(1))
    this.getContentTypes = memoize(client.getContentTypes, options(0))
  }
}
