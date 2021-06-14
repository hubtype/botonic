import { ContentfulClientApi, Entry } from 'contentful'
import * as contentful from 'contentful'

export type ReducedClientApi = Pick<
  ContentfulClientApi,
  'getAsset' | 'getAssets' | 'getEntries' | 'getEntry' | 'getContentType'
>

export type GetEntriesType = <T>(
  query: any
) => Promise<contentful.EntryCollection<T>>

export type GetEntryType = <T>(id: string, query?: any) => Promise<Entry<T>>

export type ClientApiErrorReporter = (
  description: string,
  functName: string,
  args: any[],
  err: Error
) => Promise<void>
