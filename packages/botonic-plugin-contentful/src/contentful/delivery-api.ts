import * as contentful from 'contentful'

import { Context } from '../cms'
import { ContentfulOptions } from '../plugin'
import { ReducedClientApi } from './delivery/client-api'

/**
 * https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
 */
export interface DeliveryApi {
  getAsset(id: string, context: Context, query?: any): Promise<contentful.Asset>

  getAssets(context: Context, query?: any): Promise<contentful.AssetCollection>

  getEntry<T>(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Entry<T>>

  getEntries<T>(
    context: Context,
    query?: any
  ): Promise<contentful.EntryCollection<T>>

  getContentType(id: string): Promise<contentful.ContentType>
}

/**
 * Manages the {@link Context}, parses Content's Id and ContentType from the Contentful entries...
 */
export class AdaptorDeliveryApi implements DeliveryApi {
  constructor(
    readonly client: ReducedClientApi,
    readonly options: ContentfulOptions
  ) {}

  async getAsset(
    id: string,
    context: Context,
    query?: any
  ): Promise<contentful.Asset> {
    return this.client.getAsset(id, this.queryFromContext(context, query))
  }

  async getAssets(
    context: Context,
    query?: any
  ): Promise<contentful.AssetCollection> {
    return this.client.getAssets(this.queryFromContext(context, query))
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<contentful.Entry<T>> {
    return this.client.getEntry<T>(id, this.queryFromContext(context, query))
  }

  async getEntries<T>(
    context: Context,
    query: any = {}
  ): Promise<contentful.EntryCollection<T>> {
    return this.client.getEntries<T>(this.queryFromContext(context, query))
  }

  async getContentType(id: string): Promise<contentful.ContentType> {
    try {
      return this.client.getContentType(id)
    } catch (e) {
      console.error(`ERROR in getContentType for id ${id}:`, e)
      throw e
    }
  }

  private queryFromContext(context: Context, query: any = {}): any {
    const locale = this.options.cmsLocale
      ? this.options.cmsLocale(context.locale)
      : context.locale
    if (locale) {
      query['locale'] = locale
    }
    return query
  }
}
