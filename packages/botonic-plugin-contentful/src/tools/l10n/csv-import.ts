import parser from 'csv-parse'
import * as fs from 'fs'

import { ContentType } from '../../cms'
import {
  CONTENT_FIELDS,
  ContentField,
  ContentFieldType,
  ContentFieldValueType,
} from '../../manage-cms/fields'
import { replaceAll, trim } from '../../nlp/util/strings'
import { ImportRecordReducer } from './import-updater'

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
