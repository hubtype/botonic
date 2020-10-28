import { BotonicContentType, ContentId, ContentType } from '../../cms'
import { ContentFieldType, ManageCms, ManageContext } from '../../manage-cms'
import {
  CONTENT_FIELDS,
  FIELDS_PER_CONTENT_TYPE,
} from '../../manage-cms/fields'
import { isOfType } from '../../util/enums'
import { Record, RecordFixer, recordId } from './csv-import'

export class ContentToImport {
  readonly toDelete: boolean
  constructor(
    readonly contentId: ContentId,
    readonly name: string,
    readonly fields: { [field: string]: any }
  ) {
    if (
      Object.keys(fields).length === 1 &&
      fields[ContentFieldType.SHORT_TEXT]
    ) {
      this.toDelete = true
    } else {
      this.toDelete = false
      for (const field of FIELDS_PER_CONTENT_TYPE[this.contentId.model]) {
        if (!fields[field]) {
          console.error(`Missing row for ${this.contentId.toString()}`)
        }
      }
    }
  }
}

export class ImportContentUpdater {
  constructor(readonly cms: ManageCms, readonly context: ManageContext) {}

  async update(content: ContentToImport): Promise<void> {
    await this.cms.updateFields(this.context, content.contentId, content.fields)
  }
}

/**
 * Reduce all the records read from a csv into ContentToImport's
 * and delegates to ContentUpdater.
 * It also checks consistency of all records of a given content
 */
export class ImportRecordReducer {
  pending: Record[] = []

  constructor(readonly importer: ImportContentUpdater) {}

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
    let diffField: string | undefined = undefined

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
    const fields: { [contentFieldType: string]: any } = {}
    for (const r of this.pending) {
      fields[r.Field] = this.value(r)
    }

    const contentImport = new ContentToImport(
      ContentId.create(last.Model, last.Id),
      last.Code,
      fields
    )
    await this.importer.update(contentImport)
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
