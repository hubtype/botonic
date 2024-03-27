import * as cf from 'contentful'

import { Context, ContextWithLocale } from '../cms'
import { Locale } from '../nlp'
import { ButtonDelivery } from './contents/button'
import { DeliveryApi } from './delivery-api'

export type I18nValue<T> = { [locale: string]: T }

export class VisitedField<V> {
  constructor(
    readonly entry: cf.Entry<any>,
    readonly locale: Locale,
    readonly field: cf.Field,
    readonly value: I18nValue<V>
  ) {}
}
export interface ContentfulVisitor {
  name(): string

  visitEntry<T>(entry: cf.Entry<T>): cf.Entry<T>

  visitStringField(field: VisitedField<string>): I18nValue<string>

  visitOtherField(vf: VisitedField<any>): I18nValue<any>

  visitMultipleStringField(field: VisitedField<string[]>): I18nValue<string[]>

  visitSingleReference(
    field: VisitedField<cf.Entry<any>>
  ): I18nValue<cf.Entry<any>>

  visitMultipleReference<T>(
    field: VisitedField<cf.EntryCollection<T>>
  ): I18nValue<cf.EntryCollection<T>>
}

export class LoggerContentfulVisitor implements ContentfulVisitor {
  constructor(private readonly visitor: ContentfulVisitor) {}
  name(): string {
    return this.visitor.name()
  }

  visitEntry<T>(entry: cf.Entry<T>): cf.Entry<T> {
    this.log('visitEntry', entry)
    return this.visitor.visitEntry(entry)
  }

  visitStringField(field: VisitedField<string>): I18nValue<string> {
    this.log('visitStringField', field.entry, field.field)
    return this.visitor.visitStringField(field)
  }

  visitMultipleStringField(field: VisitedField<string[]>): I18nValue<string[]> {
    this.log('visitMultipleStringField', field.entry, field.field)
    return this.visitor.visitMultipleStringField(field)
  }

  visitOtherField(field: VisitedField<any>): I18nValue<any> {
    this.log('visitOtherField', field.entry, field.field)
    return this.visitor.visitOtherField(field)
  }

  visitSingleReference<T>(
    field: VisitedField<cf.Entry<T>>
  ): I18nValue<cf.Entry<T>> {
    this.log('visitSingleReference', field.entry, field.field)
    return this.visitor.visitSingleReference(field)
  }

  visitMultipleReference<T>(
    field: VisitedField<cf.EntryCollection<T>>
  ): I18nValue<cf.EntryCollection<T>> {
    this.log('visitMultipleReference', field.entry, field.field)
    return this.visitor.visitMultipleReference(field)
  }

  log(method: string, entry: cf.Entry<any>, field?: cf.Field): void {
    const on = field
      ? LoggerContentfulVisitor.describeField(entry, field.id)
      : LoggerContentfulVisitor.describeEntry(entry)
    console.log(`Visiting '${this.visitor.name()}.${method}' on ${on}`)
  }

  static describeEntry(entry: cf.Entry<any>): string {
    if (!entry.sys.contentType) {
      return `entry with id ${entry.sys.id}`
    }
    return `entry of type ${entry.sys.contentType.sys.id} (id:${entry.sys.id})`
  }

  static describeField(entry: cf.Entry<any>, name: string): string {
    // cannot stringify field values because they may contain circular references
    return `field '${name}' of ${LoggerContentfulVisitor.describeEntry(entry)}`
  }
}

/**
 * Traverser a contentful Entry which has been requested for all locales.
 * Limitations. It does not fetch entries from references which have not yet been delivered.
 * ATTENTION Due to the complexity of traversing links with potential circular references, it stops recursion on button
 * callbacks. This causes some entries to get wrong values.
 */
export class I18nEntryTraverser {
  private visited = new Set<string>()
  constructor(
    private readonly api: DeliveryApi,
    readonly visitor: ContentfulVisitor
  ) {}

  async traverse<T>(
    entry: cf.Entry<T>,
    context: Context
  ): Promise<cf.Entry<T>> {
    //in the future we might extending to traverse all locales
    console.assert(context.locale)
    console.assert(context.ignoreFallbackLocale)
    const promise = this.traverseCore(entry, context as ContextWithLocale)
    this.visited.add(entry.sys.id)
    return promise
  }

  async traverseCore<T>(
    entry: cf.Entry<T>,
    context: ContextWithLocale
  ): Promise<cf.Entry<T>> {
    entry = { ...entry, fields: { ...entry.fields } }
    const fields = entry.fields as unknown as {
      [fieldName: string]: I18nValue<any>
    }
    if (!entry.sys.contentType) {
      // it's a file or a dangling reference
      return entry
    }
    const contentType = await this.api.getContentType(
      entry.sys.contentType.sys.id
    )
    for (const fieldId in fields) {
      const field = contentType.fields.find(f => f.id == fieldId)!
      const i18nValue = { ...fields[fieldId] } as I18nValue<any>
      const locale = field.localized
        ? context.locale!
        : Object.keys(i18nValue)[0]
      const vf = new VisitedField(entry, locale, field, i18nValue)
      fields[fieldId] = await this.traverseField(context, vf)
    }
    entry = this.visitor.visitEntry(entry)
    return entry
  }

  async traverseField(
    context: ContextWithLocale,
    vf: VisitedField<any>
  ): Promise<I18nValue<any>> {
    let val = vf.value[vf.locale]

    const visitOrTraverse = async (val: cf.Entry<any>) => {
      if (this.visited.has(val.sys.id) && val.sys.id >= vf.entry.sys.id) {
        // break deadlock if contents have cyclic dependencies
        return val
      }
      return this.traverse(val, context)
    }
    if (vf.field.type === 'Symbol' || vf.field.type === 'Text') {
      return this.visitor.visitStringField(vf)
    } else if (vf.field.type == 'Link') {
      if (val) {
        val = this.stopRecursionOnButtonCallbacks(vf.field, val)
        vf.value[vf.locale] = visitOrTraverse(val)
      }
      return this.visitor.visitSingleReference(vf)
    } else if (this.isArrayOfType(vf.field, 'Link')) {
      if (val) {
        val = await Promise.all(
          (val as cf.Entry<any>[]).map(v => visitOrTraverse(v))
        )
        vf.value[vf.locale] = val
      }
      return this.visitor.visitMultipleReference(vf)
    } else if (this.isArrayOfType(vf.field, 'Symbol')) {
      return this.visitor.visitMultipleStringField(vf)
    } else {
      return this.visitor.visitOtherField(vf)
    }
  }

  isArrayOfType(field: cf.Field, itemType: cf.FieldType): boolean {
    return field.type == 'Array' && field.items?.type == itemType
  }

  /**
   * When a content has a button with another content reference, we just need the referred content id
   * to create the content. Hence, we stop traversing.
   */
  private stopRecursionOnButtonCallbacks(
    field: cf.Field,
    val: cf.Entry<any>
  ): cf.Entry<any> {
    if (field.id !== 'target') {
      return val
    }
    if (
      !val.fields ||
      val.fields.payload ||
      val.sys.contentType?.sys.id == ButtonDelivery.BUTTON_CONTENT_TYPE
    ) {
      return val
    }
    return { ...val, fields: {} }
  }
}
