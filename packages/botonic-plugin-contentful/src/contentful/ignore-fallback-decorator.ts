import { Asset, ContentType, Entry, EntryCollection } from 'contentful'
import * as contentful from 'contentful'

import { Context } from '../cms'
import { DeliveryApi } from './delivery-api'
import { convertContentfulException } from './delivery-utils'
import {
  ContentfulVisitor,
  I18nEntryTraverser,
  I18nValue,
  VisitedField,
} from './traverser'

/**
 * It requests contentful to deliver all locales for each entry, and we discard all except the one in the context
 */
export class IgnoreFallbackDecorator implements DeliveryApi {
  constructor(private readonly api: DeliveryApi) {}

  getContentType(id: string): Promise<ContentType> {
    return this.api.getContentType(id)
  }

  async getEntries<T>(
    context: Context,
    query: any = {}
  ): Promise<EntryCollection<T>> {
    if (!context.ignoreFallbackLocale) {
      return this.api.getEntries(context, query)
    }
    try {
      let entries = await this.api.getEntries<T>(
        this.i18nContext(context),
        query
      )

      entries = { ...entries }
      entries.items = await this.traverseEntries(context, entries.items)
      return entries
    } catch (e) {
      throw convertContentfulException(e, query)
    }
  }

  async getEntry<T>(
    id: string,
    context: Context,
    query: any = {}
  ): Promise<Entry<T>> {
    if (!context.ignoreFallbackLocale) {
      return this.api.getEntry(id, context, query)
    }
    const entry = await this.api.getEntry<T>(
      id,
      this.i18nContext(context),
      query
    )
    return (await this.traverseEntries(context, [entry]))[0]
  }

  async traverseEntries<T>(
    context: Context,
    entries: Entry<T>[]
  ): Promise<Entry<T>[]> {
    const visitor = new IgnoreFallbackVisitor(context)
    return Promise.all(
      entries.map(async item => {
        const traverser = new I18nEntryTraverser(this.api, visitor)
        return await traverser.traverse(item, context)
      })
    )
  }

  getAsset(id: string, context: Context, query?: any): Promise<Asset> {
    console.warn(
      'IgnoreFallbackDecorator does not any special treatment for getAsset'
    )
    return this.api.getAsset(id, context, query)
  }

  async getAssets(
    context: Context,
    query?: any
  ): Promise<contentful.AssetCollection> {
    console.warn(
      'IgnoreFallbackDecorator does not any special treatment for getAssets'
    )
    return this.api.getAssets(context, query)
  }

  private i18nContext(context: Context) {
    return {
      ...context,
      locale: '*',
    } as Context
  }
}

class IgnoreFallbackVisitor implements ContentfulVisitor {
  contextForContentful: Context
  constructor(readonly context: Context) {
    if (!context.locale) {
      throw new Error(
        'Context.ignoreFallbackLocale set but Context.locale not set'
      )
    }
    this.contextForContentful = {
      ...context,
      locale: '*',
    }
  }

  visitEntry<T>(entry: Entry<T>): Entry<T> {
    return entry
  }

  visitOtherField(vf: VisitedField<any>): I18nValue<any> {
    return this.hackType(vf.value[vf.locale], undefined)
  }

  visitStringField(vf: VisitedField<string>): I18nValue<string> {
    return this.hackType(vf.value[vf.locale], '')
  }

  hackType<T>(t: T, defaultValue?: T): I18nValue<T> {
    if (defaultValue != undefined) {
      t = t ?? defaultValue
    }
    return (t as any) as I18nValue<T>
  }

  visitMultipleStringField(vf: VisitedField<string[]>): I18nValue<string[]> {
    return this.hackType(vf.value[vf.locale], [])
  }

  visitSingleReference<T>(vf: VisitedField<Entry<T>>): I18nValue<Entry<T>> {
    return this.hackType(vf.value[vf.locale], (undefined as any) as Entry<T>)
  }

  visitMultipleReference<T>(
    vf: VisitedField<EntryCollection<T>>
  ): I18nValue<EntryCollection<T>> {
    return this.hackType(vf.value[vf.locale])
  }

  name(): string {
    return 'ignoreFallbackLocale'
  }
}
