import {
  BotonicContentType,
  ContentId,
  ContentType,
  MessageContentType,
  TopContentId,
} from '../../cms'
import { ContentFieldType, ManageCms, ManageContext } from '../../manage-cms'
import { ContentDeleter } from '../../manage-cms/content-deleter'
import {
  CONTENT_FIELDS,
  getFieldsForContentType,
} from '../../manage-cms/fields'
import { isOfType } from '../../util/enums'
import { Record, RecordFixer, recordId } from './csv-import'

export class ContentToImport {
  constructor(
    readonly contentId: ContentId,
    readonly name: string,
    readonly fields: { [field: string]: any }
  ) {}
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

/**
 * - If ContentToImport only has shortText, it'll assume that the content
 * needs to be removed for this locale. Its fields will be deleted and all
 * buttons which target it will be removed.
 * - Otherwise, the specified fields will be overwritten
 */
export class ImportContentUpdater {
  constructor(
    readonly manageCms: ManageCms,
    readonly context: ManageContext,
    readonly deleter: ContentDeleter
  ) {}

  async update(content: ContentToImport): Promise<void> {
    if (this.mustBeDeleted(content)) {
      await this.deleter.deleteContent(content.contentId as TopContentId)
    } else {
      await this.updateFields(content)
    }
  }

  async updateFields(content: ContentToImport) {
    for (const field of getFieldsForContentType(content.contentId.model)) {
      if (!content.fields[field]) {
        console.warn(
          `Missing field '${field}' for ${content.contentId.toString()}`
        )
      }
    }

    await this.manageCms.updateFields(
      this.context,
      content.contentId,
      content.fields
    )
  }

  mustBeDeleted(content: ContentToImport): boolean {
    return (
      isOfType(content.contentId.model, MessageContentType) &&
      Object.keys(content.fields).length === 1 &&
      content.fields[ContentFieldType.SHORT_TEXT]
    )
  }
}
