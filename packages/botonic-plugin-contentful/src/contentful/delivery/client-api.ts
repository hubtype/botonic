import { ContentfulClientApi } from 'contentful'

export type ReducedClientApi = Pick<
  ContentfulClientApi,
  | 'getAsset'
  | 'getAssets'
  | 'getEntries'
  | 'getEntry'
  | 'getContentType'
  | 'getContentTypes'
>
