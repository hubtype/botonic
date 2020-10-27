import * as cms from '../../cms'
import { BotonicContentType, ContentType } from '../../cms'
import { ManageCms, ManageContext } from '../../manage-cms'
import { CONTENT_FIELDS } from '../../manage-cms/fields'
import { isOfType } from '../../util/enums'
import { Record, RecordFixer, recordId } from './csv-import'

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
