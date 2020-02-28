import { Asset, ContentType, Entry, EntryCollection, Field } from 'contentful'
import { DeliveryApi } from './delivery-api'
import { Context } from '../cms'
import { Locale } from '../nlp'
import {
  ContentfulVisitor,
  I18nEntryTraverser,
  I18nValue,
  LoggerContentfulVisitor,
} from './traverser'
import { ContentfulOptions } from '../plugin'

/**
 * Option required because IgnoreFallbackDecorator modifies the entries
 * Consider using deepCopy in the decorator
 */
export const OPTIONS_FOR_IGNORE_FALLBACK: Partial<ContentfulOptions> = {
  disableCache: true,
}

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
    const entries = await this.api.getEntries<T>(
      this.i18nContext(context),
      query
    )

    await this.traverseEntries(context, entries.items)
    return entries
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
    await this.traverseEntries(context, [entry])
    return entry
  }

  async traverseEntries(
    context: Context,
    entries: Entry<any>[]
  ): Promise<void[]> {
    const traverser = new I18nEntryTraverser(this.api)
    const visitor = new IgnoreFallbackVisitor(context)
    return Promise.all(
      entries.map(item => traverser.traverse(item, visitor, context))
    )
  }

  getAsset(id: string, query?: any): Promise<Asset> {
    return this.api.getAsset(id, query)
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

  visitEntry(entry: Entry<any>): void {}

  visitName(entry: Entry<any>, entryName: string): void {
    entry.fields.name = entryName
  }

  visitStringField(
    entry: Entry<any>,
    field: Field,
    values: I18nValue<string>
  ): void {
    const value = this.valueForLocale(values, field)
    this.setField(entry, field, value ?? '')
  }

  visitMultipleStringField(
    entry: Entry<any>,
    field: Field,
    values: I18nValue<string[]>
  ): void {
    const value = this.valueForLocale(values, field)
    this.setField(entry, field, value ?? [])
  }

  visitSingleReference(
    entry: Entry<any>,
    field: Field,
    values: I18nValue<Entry<any>>
  ): void {
    const value = this.valueForLocale(values, field)
    if (value == undefined) {
      console.log(
        `${LoggerContentfulVisitor.describeField(
          entry,
          field.id
        )} has no value for locale ${this.locale()}. This might break the CMS model`
      )
    }
    this.setField(entry, field, value)
  }

  visitMultipleReference(
    entry: Entry<any>,
    field: Field,
    values: I18nValue<EntryCollection<any>>
  ): void {
    const value = this.valueForLocale(values, field)
    this.setField(entry, field, value ?? [])
  }

  private setField(entry: Entry<any>, field: Field, value: any): void {
    entry.fields[field.id] = value
  }

  private valueForLocale<T>(value: I18nValue<T>, field: Field): T | undefined {
    if (!field.localized) {
      return Object.values(value)[0]
    }
    if (!value['en'] && !value['es']) {
      console.log('already translated')
      return (value as any) as T
    }
    return value[this.locale()]
  }

  private locale(): Locale {
    return this.context.locale!
  }

  name(): string {
    return 'ignoreFallbackLocale'
  }
}
