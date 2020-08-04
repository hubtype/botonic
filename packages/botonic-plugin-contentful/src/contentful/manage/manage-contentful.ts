import { ManageCms } from '../../manage-cms/manage-cms'
import * as cms from '../../cms'
import * as nlp from '../../nlp'
import { createClient } from 'contentful-management'
// eslint-disable-next-line node/no-missing-import
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
// eslint-disable-next-line node/no-missing-import
import { Environment } from 'contentful-management/dist/typings/entities/environment'
// eslint-disable-next-line node/no-missing-import
import { Entry } from 'contentful-management/dist/typings/entities/entry'
import { ContentfulOptions } from '../../plugin'
import { ManageContext } from '../../manage-cms/manage-context'
import { CmsException, ContentId } from '../../cms'
import {
  CONTENT_FIELDS,
  ContentField,
  ContentFieldType,
} from '../../manage-cms/fields'

export class ManageContentful implements ManageCms {
  readonly manage: ClientAPI
  environment: Environment | undefined

  constructor(readonly options: ContentfulOptions) {
    this.manage = this.createClient()
  }

  private createClient() {
    return createClient({
      accessToken: this.options.accessToken,
      timeout: this.options.timeoutMs,
    })
  }

  async getDefaultLocale(): Promise<Locale> {
    const space = await this.manage.getSpace(this.options.spaceId)
    const locales = await (await this.getEnvironment()).getLocales()
    for (const locale of locales.items) {
      if (locale.default) {
        return locale.code
      }
    }
    throw new Error(`No default locale found for space ${space.sys.id}`)
  }

  private async getEnvironment(): Promise<Environment> {
    if (!this.environment) {
      const space = await this.manage.getSpace(this.options.spaceId)
      if (!this.options.environment) {
        throw new Error('Please specify environment in ContentfulOptions')
      }
      this.environment = await space.getEnvironment(this.options.environment)
    }
    return this.environment
  }

  async updateField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    value: any
  ): Promise<void> {
    const environment = await this.getEnvironment()
    const oldEntry = await environment.getEntry(contentId.id)
    const field = this.checkOverwrite(context, oldEntry, fieldType)
    oldEntry.fields[field.cmsName][context.locale] = value
    // we could use this.deliver.contentFromEntry & IgnoreFallbackDecorator to convert
    // the multilocale fields returned by update()
    await this.updateEntry(context, oldEntry)
  }

  private checkOverwrite(
    context: ManageContext,
    entry: Entry,
    fieldType: ContentFieldType
  ): ContentField {
    const field = CONTENT_FIELDS.get(fieldType)
    if (!field) {
      throw new CmsException(`Invalid field type ${fieldType}`)
    }
    if (!context.locale) {
      // paranoic check
      throw new Error('Context.locale must be defined')
    }
    if (!(field.cmsName in entry.fields)) {
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
        throw new CmsException(
          `Cannot overwrite field '${field.cmsName}' of entry '${
            entry.sys.id
          }' "+
          "(has value '${String(
            value
          )}') because ManageContext.allowOverwrites is false`
        )
      }
    }
    return field
  }

  async copyField<T extends cms.Content>(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    fromLocale: nlp.Locale
  ): Promise<void> {
    const environment = await this.getEnvironment()
    // TODO fetch both entries in parallel
    const oldEntry = await environment.getEntry(contentId.id)
    const field = this.checkOverwrite(context, oldEntry, fieldType)

    const fieldEntry = oldEntry.fields[field.cmsName]
    fieldEntry[context.locale] = fieldEntry[fromLocale]
    await this.updateEntry(context, oldEntry)
  }

  async updateEntry(context: ManageContext, entry: Entry): Promise<void> {
    if (context.dryRun) {
      console.log('Not updating due to dryRun mode')
      return
    }
    const updated = await entry.update()
    if (!context.preview) {
      await updated.publish()
    }
  }
}
