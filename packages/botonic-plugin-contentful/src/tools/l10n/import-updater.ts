import {
  BotonicContentType,
  CMS,
  ContentId,
  ContentType,
  MessageContent,
  MessageContentType,
  TopContentId,
} from '../../cms'
import { CmsInfo } from '../../cms/cms-info'
import { ExceptionUnpacker } from '../../cms/exceptions'
import { allContents } from '../../cms/visitors/message-visitors'
import { ContentFieldType, ManageCms, ManageContext } from '../../manage-cms'
import { ContentDeleter } from '../../manage-cms/content-deleter'
import {
  CONTENT_FIELDS,
  ContentFieldValueType,
  getFieldsForContentType,
} from '../../manage-cms/fields'
import { FieldsValues } from '../../manage-cms/manage-cms'
import { andArrays } from '../../util/arrays'
import { isOfType } from '../../util/enums'
import { Stringable } from '../../util/objects'
import { Record, RecordFixer, recordId } from './csv-import'
import { EXPORTABLE_CONTENT_TYPES } from './fields'

export class ContentToImport implements Stringable {
  constructor(
    readonly contentId: ContentId,
    readonly name: string,
    readonly fields: FieldsValues
  ) {}

  toString(): string {
    const fields = Object.keys(this.fields)
      .map(k => `${k}:${String(this.fields[k])}`)
      .join('/')
    return [this.contentId, this.name, fields].join('/')
  }
}

/**
 * Reduce all the records read from a csv into ContentToImport's
 * and delegates to ContentUpdater.
 * It also checks consistency of all records of a given content
 */
export class ImportRecordReducer {
  pending: Record[] = []

  constructor(
    readonly importer: ImportContentUpdater,
    readonly options: { resumeErrors?: boolean }
  ) {}

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
    const last = this.last()
    if (last) {
      if (last.Id == record.Id) {
        if (!this.checkLast(record, last)) {
          return
        }
      } else {
        await this.flush()
      }
    }
    this.pending.push(record)
  }

  checkLast(record: Record, last: Record): boolean {
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
    try {
      await this.importer.update(contentImport)
    } catch (e) {
      if (this.options.resumeErrors) {
        const msgs = new ExceptionUnpacker().unpack(e).join('\n')
        console.error(
          `Skipping after error when importing ${contentImport.contentId.toString()}:\n${msgs}`
        )
      } else {
        throw e
      }
    }
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
 * - If ContentToImport only has shortText and its value is empty,
 * it'll assume that the content needs to be removed for this locale.
 * Its fields will be deleted and all buttons which target it will be removed.
 * - Otherwise, the specified fields will be overwritten
 */
export class ImportContentUpdater {
  private defaultLocaleContents: MessageContent[] | undefined
  constructor(
    readonly manageCms: ManageCms,
    readonly cms: CMS,
    readonly info: CmsInfo,
    readonly context: ManageContext,
    readonly deleter: ContentDeleter
  ) {}

  async update(content: ContentToImport): Promise<void> {
    if (this.mustBeDeleted(content)) {
      await this.deleter.deleteContent(
        content.contentId as TopContentId,
        content.name
      )
    } else {
      await this.updateFields(content)
    }
  }

  private async updateFields(content: ContentToImport) {
    const newVal = await this.manageCms.updateFields(
      this.context,
      content.contentId,
      content.fields
    )
    await this.warnMissingFields(content, newVal)
  }

  async contentTypes(): Promise<ContentType[]> {
    return andArrays(EXPORTABLE_CONTENT_TYPES, await this.info.contentTypes())
  }

  async warnMissingFields(
    content: ContentToImport,
    _newVals: FieldsValues
  ): Promise<void> {
    if (!this.defaultLocaleContents) {
      this.defaultLocaleContents = await allContents<MessageContent>(
        this.cms,
        {},
        await this.contentTypes()
      )
    }

    for (const field of getFieldsForContentType(content.contentId.model)) {
      const f = CONTENT_FIELDS.get(field)!
      if (
        ![
          ContentFieldValueType.STRING,
          ContentFieldValueType.STRING_ARRAY,
        ].includes(f.valueType)
      ) {
        continue
      }
      const defaultLocaleContent = this.defaultLocaleContents.find(
        c => c.id == content.contentId.id
      )!
      if (
        !content.fields[field] &&
        defaultLocaleContent &&
        f.isNotEmptyAt(defaultLocaleContent)
      ) {
        console.warn(
          `Missing field '${field}' for ${content.contentId.toString()} (${
            content.name
          })`
        )
      }
    }
  }

  mustBeDeleted(content: ContentToImport): boolean {
    return (
      isOfType(content.contentId.model, MessageContentType) &&
      Object.keys(content.fields).length === 1 &&
      ContentFieldType.SHORT_TEXT in content.fields &&
      content.fields[ContentFieldType.SHORT_TEXT].trim() === ''
    )
  }
}
