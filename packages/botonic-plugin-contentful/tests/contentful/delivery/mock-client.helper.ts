import contentful, {
  Asset,
  AssetCollection,
  ContentType,
  Entry,
  EntryCollection,
} from 'contentful'

import { ReducedClientApi } from '../../../src/contentful/delivery/client-api'

// not using mockito because (maybe due to https://github.com/medikoo/memoizee/issues/117),
// consecutive calls without a sleep in between were not hitting the cache
export class MockClientApi implements ReducedClientApi {
  error: Error | undefined
  numCalls = 0

  asset = { ka: 'va' } as any as Asset
  assetCollection = {
    items: [this.asset],
  } as any as AssetCollection

  contentType = { kct: 'vct' } as any as ContentType

  entry = { ke: 've' } as any as Entry<any>
  entryCollection = {
    items: [],
  } as any as EntryCollection<any>

  getAsset(_id: string, _query: any): Promise<contentful.Asset> {
    this.numCalls++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(this.asset)
  }

  getAssets(_query: any): Promise<contentful.AssetCollection> {
    this.numCalls++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(this.assetCollection)
  }

  getContentType(_id: string): Promise<contentful.ContentType> {
    this.numCalls++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(this.contentType)
  }

  getEntries<T>(_query: any): Promise<EntryCollection<T>> {
    this.numCalls++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(this.entryCollection)
  }

  getEntry<T>(_id: string, _query: any): Promise<Entry<T>> {
    this.numCalls++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(this.entry)
  }
}
