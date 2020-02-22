import * as contentful from 'contentful/index'
import { Entry } from 'contentful/index'
import memoize from 'memoizee'
import { ReducedClientApi } from './client-api'

export class CachedClientApi implements ReducedClientApi {
  readonly getAsset: (id: string, query?: any) => Promise<contentful.Asset>
  readonly getEntries: <T>(query: any) => Promise<contentful.EntryCollection<T>>
  readonly getEntry: <T>(id: string, query?: any) => Promise<Entry<T>>

  constructor(readonly client: ReducedClientApi, readonly cacheTtlMs = 10000) {
    const options = (length: number) =>
      ({
        primitive: true,
        maxAge: cacheTtlMs,
        length,
        normalizer: function(...args: any): string {
          return args
            .map((arg: any) => JSON.stringify(arg))
            .reduce((a: any, b: any) => a + b)
        },
      } as memoize.Options)

    this.getAsset = memoize(client.getAsset, options(2))
    this.getEntries = memoize(client.getEntries, options(1))
    this.getEntry = memoize(client.getEntry, options(2))
  }
}
