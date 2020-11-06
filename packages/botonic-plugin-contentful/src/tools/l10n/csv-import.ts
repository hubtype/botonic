import parser from 'csv-parse'
import * as fs from 'fs'

import * as cms from '../../cms'
import { CMS, ContentId, ContentType } from '../../cms'
import { BotonicContentType } from '../../cms/cms'
import {
  CONTENT_FIELDS,
  ContentField,
  ContentFieldType,
  ContentFieldValueType,
  FIELDS_PER_CONTENT_TYPE,
} from '../../manage-cms/fields'
import { ManageCms } from '../../manage-cms/manage-cms'
import { ManageContext } from '../../manage-cms/manage-context'
import { replaceAll, trim } from '../../nlp/util/strings'
import { isOfType } from '../../util/enums'

export const PARSE_OPTIONS: parser.Options = {
  escape: '"',
  delimiter: ';',
  quote: '"',
  columns: ['Model', 'Code', 'Id', 'Field', 'from', 'to'],
}

export interface Record {
  Model: ContentType
  Code: string
  Id: string
  Field: ContentFieldType
  from: string
  to: string
}

export function recordId(record: Record): string {
  return `${record.Id}/${record.Code}`
}

export class ContentToImport {
  readonly toDelete: boolean
  constructor(
    readonly model: ContentType,
    readonly code: string,
    readonly id: string,
    readonly fields: { [field: string]: Record }
  ) {
    if (
      Object.keys(fields).length === 1 &&
      fields[ContentFieldType.SHORT_TEXT]
    ) {
      this.toDelete = true
    } else {
      this.toDelete = false
      for (const field of FIELDS_PER_CONTENT_TYPE[this.model]) {
        if (!fields[field]) {
          console.error(`Missing row for ${this.contentId()}`)
        }
      }
    }
  }

  contentId(): string {
    return `${this.model} ${this.id}/${this.code}`
  }
}

export interface FieldToImport {
  Field: ContentFieldType
  from: string
  to: string
}

export interface CsvImportOptions {
  readonly nameFilter?: (contentName: string) => boolean
}

export class CsvImport {
  constructor(
    private readonly importer: StringFieldImporter,
    private readonly options: CsvImportOptions = {}
  ) {}

  static HeaderSkipper = class {
    first = true

    skipFirst(record: Record): boolean {
      if (this.first) {
        this.first = false
        if ((record.Model as string) == 'Model') {
          console.log('Skipping header')
          return true
        }
        console.error('No header found. Parsing fist line as a normal line')
      }
      return false
    }
  }

  async import(fname: string): Promise<void> {
    const parse = new parser.Parser(PARSE_OPTIONS)
    const reader = fs.createReadStream(fname).pipe(parse)

    const header = new CsvImport.HeaderSkipper()
    for await (const record of reader as AsyncIterable<Record>) {
      const recordId = `'${record.Model}' field '${
        record.Code.trim() || record.Id
      }.${record.Field}'`
      if (header.skipFirst(record)) {
        continue
      }
      if (record.from && !record.to) {
        console.warn(`Missing translation for ${recordId}`)
        console.warn(
          'To remove the content for a locale, remove the keywords and any link to it'
        )
        continue
      }
      if (this.options.nameFilter && !this.options.nameFilter(record.Code)) {
        continue
      }
      console.log(`Importing ${recordId}`)
      await this.importer.consume(record)
    }
    await this.importer.flush()
  }
}

export class RecordFixer {
  readonly field: ContentField
  constructor(readonly record: Record) {
    this.field = CONTENT_FIELDS.get(record.Field)!
  }

  fix(): void {
    this.fixExcelNewLine()
    if (this.field.valueType == ContentFieldValueType.STRING_ARRAY) {
      this.checkKeywordLen()
    }
  }

  fixTrimmingQuotes(): void {
    //it's typical to forget a " at the first character of the value
    this.record.to = trim(this.record.to, '" ')
  }

  fixExcelNewLine(): void {
    //https://bugs.documentfoundation.org/show_bug.cgi?id=118470
    this.record.to = replaceAll(this.record.to, '_x000D_', '')
  }

  checkKeywordLen(): void {
    if (this.field.valueType == ContentFieldValueType.STRING_ARRAY) {
      const fromLen: number = this.field.parse(this.record.from).length
      const toLen: number = this.field.parse(this.record.to).length
      if (toLen != fromLen) {
        this.complain(
          `'From' has ${fromLen} keywords:\n${this.record.from}\n ` +
            `but 'to' has ${toLen}:\n${this.record.to}`
        )
      }
    }
  }
  complain(msg: string) {
    console.error(`Problem in ${this.record.Id} / ${this.record.Code}: ${msg}`)
  }
}

export class StringFieldImporter {
  pending: Record[] = []
  constructor(readonly cms: ManageCms, readonly context: ManageContext) {}

  async consume(record: Record): Promise<void> {
    if (!isOfType(record.Model, ContentType)) {
      console.error(
        `Bad model '${String(record.Model)}'. Should be one of ${String(
          Object.values(BotonicContentType)
        )}`
      )
      return
    }

    const field = CONTENT_FIELDS.get(record.Field)
    if (!field) {
      console.error(`Bad field '${record.Field}'`)
      return
    }
    if (!this.checkLast(record)) {
      return
    }
    const last = this.last()
    if (last) {
      if (last.Id != record.Id) {
        await this.flush()
      }
    }
    this.pending.push(record)
  }

  checkLast(record: Record): boolean {
    const last = this.last()
    if (!last) return true
    let diffField = undefined

    if (last.Model != record.Model) {
      diffField = 'model'
    }
    if (last.Code != record.Code) {
      diffField = 'code'
    }
    if (diffField) {
      console.error(
        `Records ${recordId(record)} & ${recordId(
          last
        )} with same id have different ${diffField}`
      )
      return false
    }
    return true
  }

  async flush(): Promise<void> {
    const last = this.last()
    if (!last) return
    const id = new cms.ContentId(last.Model, last.Id)
    const fields: { [contentFieldType: string]: any } = {}
    for (const r of this.pending) {
      fields[r.Field] = this.value(r)
    }

    await this.cms.updateFields(this.context, id, fields)
    this.pending = []
  }

  private last(): Record | undefined {
    if (!this.pending.length) return undefined

    return this.pending[this.pending.length - 1]
  }

  private value(record: Record): any {
    const field = CONTENT_FIELDS.get(record.Field)!
    const fixer = new RecordFixer(record)
    fixer.fix()
    return field.parse(record.to)
  }
}

/**
 * TODO duplicate non-text fields which don't have fallback
 * instead of harcoding them.
 * Does not duplicate CommonFields.followup
 * Only duplicates if target field is empty
 */
export class ReferenceFieldDuplicator {
  constructor(
    readonly cms: CMS,
    readonly manageCms: ManageCms,
    readonly manageContext: ManageContext
  ) {}

  async duplicateReferenceFields(): Promise<void> {
    const defaultLocale = await this.manageCms.getDefaultLocale()
    const fields = {
      [ContentType.TEXT]: [ContentFieldType.BUTTONS],
      [ContentType.STARTUP]: [ContentFieldType.BUTTONS],
      [ContentType.ELEMENT]: [ContentFieldType.IMAGE],
    }
    for (const contentType of Object.keys(fields)) {
      console.log(`***Duplicating reference field of type '${contentType}'`)
      for (const fieldType of (fields as any)[contentType]) {
        console.log(` **Duplicating '${contentType}' fields`)
        await this.duplicate(
          defaultLocale,
          contentType as ContentType,
          fieldType as ContentFieldType
        )
      }
    }
    this.warning()
  }

  async duplicateAssetFiles() {
    const defaultLocale = await this.manageCms.getDefaultLocale()
    console.log(`***Duplicating assets`)
    const assets = await this.cms.assets({ locale: defaultLocale })
    console.log(` **Duplicating ${assets.length} assets`)
    for (const a of assets) {
      await this.manageCms.copyAssetFile(
        this.manageContext,
        a.id,
        defaultLocale
      )
    }
    this.warning()
  }

  private warning() {
    if (this.manageContext.preview) {
      console.warn('Remember to publish the entries from contentful.com')
    }
  }

  private async duplicate(
    defaultLocale: string,
    contentType: cms.ContentType,
    fields: ContentFieldType
  ) {
    const contents = await this.cms.contents(contentType, {
      ...this.manageContext,
      locale: defaultLocale,
    })
    for (const content of contents) {
      //console.log(`  *Duplicating ${content.id} (${content.name})`)
      await this.manageCms.copyField(
        this.manageContext,
        new ContentId(contentType, content.id),
        fields,
        defaultLocale,
        true
      )
    }
  }
}
