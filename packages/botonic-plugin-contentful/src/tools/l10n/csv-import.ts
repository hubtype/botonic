import { ManageCms } from '../../manage-cms/manage-cms'
import * as cms from '../../cms'
import * as fs from 'fs'
import parser from 'csv-parse'
import { BotonicContentType, CmsException, ContentType } from '../../cms'
import { isOfType } from '../../util/enums'
import { CONTENT_FIELDS, ContentFieldType } from '../../manage-cms/fields'
import { ManageContext } from '../../manage-cms/manage-context'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface CsvImportOptions {}

// type CsvLine = string[]
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
      if (header.skipFirst(record)) {
        continue
      }
      if (this.options.nameFilter && !this.options.nameFilter(record.Code)) {
        continue
      }
      console.log(
        `Importing '${record.Model}' field '${
          record.Code.trim() || record.Id
        }.${record.Field}'`
      )
      await this.importer.consume(record)
    }
  }
}

export class StringFieldImporter {
  constructor(readonly cms: ManageCms, readonly context: ManageContext) {}

  async consume(record: Record): Promise<void> {
    if (!isOfType(record.Model, BotonicContentType)) {
      console.error(`Bad model ${record.Model}`)
      return
    }
    const field = CONTENT_FIELDS.get(record.Field)
    if (!field) {
      console.error(`Bad field ${record.Field}`)
      return
    }
    const id = new cms.ContentId(record.Model, record.Id)

    await this.cms.updateField(
      this.context,
      id,
      field.fieldType,
      this.value(record)
    )
  }

  value(record: Record): any {
    const field = CONTENT_FIELDS.get(record.Field)
    if (!field) {
      throw new CmsException(`Invalid field name ${record.Field}`)
    }
    return field.parse(record.to)
  }
}
