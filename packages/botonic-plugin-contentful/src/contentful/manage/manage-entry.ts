// eslint-disable-next-line node/no-missing-import
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
// eslint-disable-next-line node/no-missing-import
import { Entry } from 'contentful-management/dist/typings/entities/entry'
// eslint-disable-next-line node/no-missing-import
import { Environment } from 'contentful-management/dist/typings/entities/environment'

import { ButtonStyle, CmsException, ContentId, ContentType } from '../../cms'
import { ResourceNotFoundCmsException } from '../../cms/exceptions'
import {
  CONTENT_FIELDS,
  ContentField,
  ContentFieldType,
} from '../../manage-cms/fields'
import { ManageContext } from '../../manage-cms/manage-context'
import * as nlp from '../../nlp'
import { ContentfulOptions } from '../../plugin'
import { isOfType } from '../../util/enums'
import { BUTTON, EntryLink, LinkType, QUICK_REPLY } from './contentful-api'

export class ManageContentfulEntry {
  constructor(
    readonly options: ContentfulOptions,
    readonly manage: ClientAPI,
    readonly environment: Promise<Environment>
  ) {}

  async updateFields(
    context: ManageContext,
    contentId: ContentId,
    fields: { [contentFieldType: string]: any }
  ): Promise<{ [contentFieldType: string]: any }> {
    const environment = await this.environment
    const oldEntry = await this.getEntry(environment, contentId)
    let needUpdate = false
    for (const key of Object.keys(fields)) {
      if (!isOfType(key, ContentFieldType)) {
        throw new CmsException(`'${key}' is not a valid content field type`)
      }
      const field = this.checkOverwrite(context, oldEntry, key, false)
      if (oldEntry.fields[field.cmsName][context.locale] === fields[key]) {
        continue
      }
      needUpdate = true
      fields[key] = this.convertValueType(key, fields[key])
      oldEntry.fields[field.cmsName][context.locale] = fields[key]
    }
    if (!needUpdate) {
      return oldEntry.fields
    }
    // we could use this.deliver.contentFromEntry & IgnoreFallbackDecorator to convert
    // the multilocale fields returned by update()
    await this.writeEntry(context, oldEntry)
    return oldEntry.fields
  }

  async createContent(
    _context: ManageContext,
    model: ContentType,
    id: string
  ): Promise<void> {
    const environment = await this.environment
    try {
      await environment.createEntryWithId(model, id, {
        fields: {},
      })
    } catch (e) {
      throw new CmsException(`ERROR while creating content with id: '${id}'`, e)
    }
  }

  async deleteContent(
    _context: ManageContext,
    contentId: ContentId
  ): Promise<void> {
    const environment = await this.environment
    try {
      const oldEntry = await this.getEntry(environment, contentId)
      if (oldEntry.isPublished()) await oldEntry.unpublish()
      await oldEntry.delete()
    } catch (e) {
      throw new CmsException('ERROR while deleting content', e)
    }
  }

  private checkOverwrite(
    context: ManageContext,
    entry: Entry,
    fieldType: ContentFieldType,
    failIfMissing: boolean
  ): ContentField {
    if (entry.isArchived()) {
      throw new CmsException(`Cannot update an archived entry`)
    }
    const field = CONTENT_FIELDS.get(fieldType)
    if (!field) {
      throw new CmsException(`Invalid field type '${fieldType}'`)
    }
    if (!context.locale) {
      // paranoic check
      throw new Error('Context.locale must be defined')
    }
    if (!(field.cmsName in entry.fields)) {
      if (!failIfMissing) {
        entry.fields[field.cmsName] = {}
        return field
      }
      const fields = Object.keys(entry.fields)
      throw new CmsException(
        `Field '${field.cmsName}' not found in entry of type '${
          entry.sys.contentType.sys.id
        }. It only has ${JSON.stringify(fields)}'`
      )
    }
    if (!context.allowOverwrites) {
      const value = entry.fields[field.cmsName][context.locale]
      if (value) {
        const error = `Cannot overwrite field '${field.cmsName}' of entry '${entry.sys.id}'`
        const detail = `(has value '${String(
          value
        )}') because ManageContext.allowOverwrites is false`
        throw new CmsException(error + detail)
      }
    }
    return field
  }

  async copyField(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void> {
    const environment = await this.environment
    const oldEntry = await environment.getEntry(contentId.id)
    const field = this.checkOverwrite(context, oldEntry, fieldType, false)

    const fieldEntry = oldEntry.fields[field.cmsName]
    if (fieldEntry === undefined) {
      return
    }
    // TODO shouldn't this check be done before checkOverwrite?
    if (onlyIfTargetEmpty && context.locale in fieldEntry) {
      return
    }
    fieldEntry[context.locale] = fieldEntry[fromLocale]
    await this.writeEntry(context, oldEntry)
  }

  private async writeEntry(
    context: ManageContext,
    entry: Entry
  ): Promise<void> {
    if (context.dryRun) {
      console.log('Not updating due to dryRun mode')
      return
    }
    const updated = await entry.update()
    if (!context.preview) {
      await updated.publish()
    }
  }

  async getEntry(
    environment: Environment,
    contentId: ContentId
  ): Promise<Entry> {
    try {
      return await environment.getEntry(contentId.id)
    } catch (e) {
      throw new ResourceNotFoundCmsException(contentId, e)
    }
  }

  private convertValueType(key: ContentFieldType, field: any): any {
    const valueType = CONTENT_FIELDS.get(key)?.valueType
    if (valueType === typeof field) return field
    if (key === ContentFieldType.BUTTONS_STYLE) {
      if (field === undefined) return null
      return field === ButtonStyle.QUICK_REPLY ? QUICK_REPLY : BUTTON
    }
    if (field === undefined) return field
    if (
      key === ContentFieldType.FOLLOW_UP ||
      key === ContentFieldType.TARGET ||
      key === ContentFieldType.HANDOFF_QUEUE ||
      key === ContentFieldType.ON_FINISH
    ) {
      return this.getEntryLink(field, 'Entry')
    }
    if (key === ContentFieldType.IMAGE || key === ContentFieldType.PIC) {
      return this.getEntryLink(field, 'Asset')
    }
    if (key === ContentFieldType.BUTTONS || key === ContentFieldType.ELEMENTS) {
      const fieldLinks = field.map((id: string) =>
        this.getEntryLink(id, 'Entry')
      )
      return fieldLinks
    }
    return field
  }

  private getEntryLink(id: string, linkType: LinkType) {
    return { sys: { ...new EntryLink(id, linkType) } }
  }
}
