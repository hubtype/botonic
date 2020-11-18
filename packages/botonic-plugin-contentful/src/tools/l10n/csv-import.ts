import parser from 'csv-parse'
import * as fs from 'fs'

import { CmsException, ContentType } from '../../cms'
import {
  CONTENT_FIELDS,
  ContentField,
  ContentFieldType,
  ContentFieldValueType,
} from '../../manage-cms/fields'
import { replaceAll, trim } from '../../nlp/util/strings'
import { ReadCsvOptions } from './import-csv-from-translators'
import { ImportRecordReducer } from './import-updater'

export const PARSE_OPTIONS: parser.Options = {
  escape: '"',
  delimiter: ';',
  quote: '"',
  columns: ['Model', 'Code', 'Id', 'Field', 'from', 'to'],
  relaxColumnCountMore: true,
  bom: true,
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
  return `'${record.Id}/${record.Code}'`
}

export interface CsvImportOptions {
  readonly nameFilter?: (contentName: string) => boolean
}

export class CsvImport {
  constructor(
    private readonly importer: ImportRecordReducer,
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

  async import(options: ReadCsvOptions): Promise<void> {
    const parse = new parser.Parser(PARSE_OPTIONS)
    const reader = fs.createReadStream(options.fname).pipe(parse)

    const header = new CsvImport.HeaderSkipper()
    const records: Record[] = []
    for await (const record of reader as AsyncIterable<Record>) {
      if (header.skipFirst(record)) {
        this.extraColumnsMustBeEmpty(record)
        continue
      }
      records.push(record)
    }
    this.sortRecords(records)
    await this.importRecords(options, records)
  }

  private sortRecords(records: Record[]) {
    records.sort((r1, r2) => {
      const comp = r1.Model.localeCompare(r2.Model)
      if (comp !== 0) return comp
      return r1.Code.localeCompare(r2.Code)
    })
  }

  private async importRecords(
    options: ReadCsvOptions,
    records: Record[]
  ): Promise<void> {
    for (const record of records) {
      const recordId = `'${record.Model}' field '${
        record.Code.trim() || record.Id
      }.${record.Field}'`
      if (options.ignoreContentIds?.includes(record.Id)) {
        console.info(`Skipping ${recordId}`)
        continue
      }
      if (
        record.from &&
        !record.to &&
        record.Field != ContentFieldType.SHORT_TEXT //see ImportContentUpdater.mustBeDeleted
      ) {
        console.warn(`Missing translation for ${recordId}`)
        console.warn(
          'To remove the content for a locale, remove the keywords and any link to it'
        )
      }
      if (this.options.nameFilter && !this.options.nameFilter(record.Code)) {
        continue
      }
      console.log(`Importing ${recordId}`)
      await this.importer.consume(record)
    }
    await this.importer.flush()
  }

  extraColumnsMustBeEmpty(record: Record): void {
    const cols = PARSE_OPTIONS.columns as string[]
    if (Object.keys(record).length == cols.length) {
      return
    }
    for (let i = cols.length; i < Object.keys(record).length; i++) {
      if (Object.values(i)) {
        throw new CmsException('Too many columns')
      }
    }
  }
}

export class RecordFixer {
  readonly field: ContentField
  constructor(readonly record: Record) {
    this.field = CONTENT_FIELDS.get(record.Field)!
  }

  fix(): void {
    this.fixCapitals()
    this.fixExcelNewLine()
    if (this.field.valueType == ContentFieldValueType.STRING_ARRAY) {
      this.checkKeywordLen()
      this.removeLastEmptyItem()
    }
  }

  fixCapitals(): void {
    const firstChar = this.record.Model[0]
    if (firstChar === firstChar.toLowerCase()) {
      return
    }
    this.record.Model = this.record.Model.toLowerCase() as ContentType
  }

  fixTrimmingQuotes(): void {
    //it's typical to forget a " at the first character of the value
    this.record.to = trim(this.record.to, '" ')
  }

  fixExcelNewLine(): void {
    //https://bugs.documentfoundation.org/show_bug.cgi?id=118470
    this.record.to = replaceAll(this.record.to, '_x000D_', '')
  }

  private fixStringArraySeparators(stringArray: string): string {
    for (const c of ',.?') {
      if (stringArray.indexOf(c) >= 0) {
        this.complain(`... Replacing '${c}' with ;`)
        stringArray = replaceAll(stringArray, c, ';')
      }
    }
    return stringArray
  }

  checkKeywordLen(): void {
    if (this.field.fieldType == ContentFieldType.KEYWORDS) {
      const fromLen: number = this.field.parse(this.record.from).length
      const toLen: number = this.field.parse(this.record.to).length
      if (toLen != fromLen || fromLen == 1) {
        this.complain(
          `'From' has ${fromLen} keywords:\n${this.record.from}\n ` +
            `but 'to' has ${toLen}:\n${this.record.to}`
        )
        this.record.to = this.fixStringArraySeparators(this.record.to)
      }
    }
  }

  private removeLastEmptyItem() {
    const emptyLastItem = /; *$/
    if (emptyLastItem.exec(this.record.to)) {
      this.complain('Removing final empty keyword')
      this.record.to = this.record.to.replace(emptyLastItem, '')
    }
  }

  complain(msg: string) {
    console.error(`Problem in ${this.record.Id} / ${this.record.Code}: ${msg}`)
  }
}
