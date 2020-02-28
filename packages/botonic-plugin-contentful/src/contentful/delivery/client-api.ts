import { ContentfulClientApi } from 'contentful'

export type ReducedClientApi = Pick<
  ContentfulClientApi,
  'getAsset' | 'getEntries' | 'getEntry' | 'getContentType'
>
