import * as cf from 'contentful'

import { Context } from '../cms'
import { DeliveryApi } from './delivery-api'

export type I18nValue<T> = { [locale: string]: T }

export interface ContentfulVisitor {
  name(): string
  visitEntry(entry: cf.Entry<any>): void
  visitName(entry: cf.Entry<any>, entryName: string): void
  visitStringField(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<string>
  ): void
  visitMultipleStringField(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<string[]>
  ): void
  visitSingleReference(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<cf.Entry<any>>
  ): void
  visitMultipleReference(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<cf.EntryCollection<any>>
  ): void
}

export class LoggerContentfulVisitor implements ContentfulVisitor {
  constructor(private readonly visitor: ContentfulVisitor) {}
  name(): string {
    return this.visitor.name()
  }

  visitEntry(entry: cf.Entry<any>): void {
    this.log('visitEntry', entry)
    return this.visitor.visitEntry(entry)
  }

  visitMultipleReference(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<cf.EntryCollection<any>>
  ): void {
    this.log('visitMultipleReference', entry, field)
    return this.visitor.visitMultipleReference(entry, field, value)
  }

  visitMultipleStringField(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<string[]>
  ): void {
    this.log('visitMultipleStringField', entry, field)
    return this.visitor.visitMultipleStringField(entry, field, value)
  }

  visitName(entry: cf.Entry<any>, entryName: string): void {
    this.log('visitName', entry)
    return this.visitor.visitName(entry, entryName)
  }

  visitSingleReference(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<cf.Entry<any>>
  ): void {
    this.log('visitSingleReference', entry, field)
    return this.visitor.visitSingleReference(entry, field, value)
  }

  visitStringField(
    entry: cf.Entry<any>,
    field: cf.Field,
    value: I18nValue<string>
  ): void {
    this.log('visitStringField', entry, field)
    return this.visitor.visitStringField(entry, field, value)
  }

  log(method: string, entry: cf.Entry<any>, field?: cf.Field): void {
    const on = field
      ? LoggerContentfulVisitor.describeField(entry, field.id)
      : LoggerContentfulVisitor.describeEntry(entry)
    console.log(`Visiting '${this.visitor.name()}.${method}' on ${on}`)
  }
  static describeEntry(entry: cf.Entry<any>): string {
    if (!entry.sys) {
      console.error('no sys')
    }
    if (!entry.sys.contentType) {
      return `entry with id ${entry.sys.id}`
    }
    return `entry of type ${entry.sys.contentType.sys.id} (id:${entry.sys.id})`
  }

  static describeField(entry: cf.Entry<any>, name: string): string {
    return `field '${name}' of ${LoggerContentfulVisitor.describeEntry(entry)}`
    // cannot stringify field values because they may contain circular references
    // )} value:\n${JSON.stringify(entry.fields[name])}`
  }
}

/**
 * Traverser a contentful Entry which has been requested for all locales.
 * Limitations. It does not fetch entries from references which have not yet been delivered
 */
export class I18nEntryTraverser {
  constructor(private readonly api: DeliveryApi) {}

  async traverse(
    entry: cf.Entry<any>,
    visitor: ContentfulVisitor,
    context: Context
  ): Promise<void> {
    console.log(`Traversing ${LoggerContentfulVisitor.describeEntry(entry)}`)
    console.assert(context.locale)
    console.assert(context.ignoreFallbackLocale)
    const locale = context.locale!

    const fields = (entry.fields as unknown) as {
      [fieldName: string]: I18nValue<any>
    }
    if (!entry.sys.contentType) {
      console.log('no contentType') // it's a file
      return
    }
    const contentType = await this.api.getContentType(
      entry.sys.contentType.sys.id
    )

    for (const fieldName in fields) {
      const field = contentType.fields.find(f => f.id == fieldName)!
      const i18nValue = () => fields[fieldName]
      // TODO remove when
      if (this.alreadyVisited(i18nValue())) {
        return
      }
      const value = () => {
        if (field.localized) {
          return i18nValue()[locale]
        }
        return this.getSingleValue<string>(i18nValue())
      }
      if (field.name == 'name') {
        visitor.visitName(entry, name)
      }
      // const values = Object.values(i18nValue())
      // if (values.length == 0) {
      //   console.log(
      //     `${LoggerContentfulVisitor.describeField(
      //       entry,
      //       fieldName
      //     )} has no values`
      //   )
      // }
      if (field.type === 'Symbol' || field.type === 'Text') {
        visitor.visitStringField(entry, field, i18nValue())
      } else if (field.type == 'Link') {
        if (value()) {
          await this.traverse(value(), visitor, context)
        }
        visitor.visitSingleReference(entry, field, i18nValue())
      } else if (this.isArrayOfType(field, 'Link')) {
        if (value()) {
          const promises = value().map((item: cf.Entry<any>) =>
            this.traverse(item, visitor, context)
          )
          await Promise.all(promises)
        }
        visitor.visitMultipleReference(entry, field, i18nValue())
      } else if (this.isArrayOfType(field, 'Symbol')) {
        visitor.visitMultipleStringField(entry, field, i18nValue())
      } else {
        console.log(
          `Not traversing ${LoggerContentfulVisitor.describeField(
            entry,
            fieldName
          )}'}`
        )
      }
    }
    visitor.visitEntry(entry)
  }

  isArrayOfType(field: cf.Field, itemType: cf.FieldType): boolean {
    return field.type == 'Array' && field.items?.type == itemType
  }

  private getSingleValue<T>(field: I18nValue<T>): T {
    const values = Object.values(field)
    console.assert(
      values.length == 1,
      `Expecting a single value but got ${values.length}`
    )
    return values[0]
  }

  private alreadyVisited(value: any): boolean {
    return !value['en'] && !value['es']
  }
}
