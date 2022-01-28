import { createClient } from 'contentful-management'
// eslint-disable-next-line node/no-missing-import
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
// eslint-disable-next-line node/no-missing-import
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import { Stream } from 'stream'

import { AssetId, AssetInfo, ContentId, ContentType } from '../../cms'
import { ContentFieldType } from '../../manage-cms/fields'
import { ManageCms } from '../../manage-cms/manage-cms'
import { ManageContext } from '../../manage-cms/manage-context'
import * as nlp from '../../nlp'
import { ContentfulOptions } from '../../plugin'
import { ManageContentfulAsset } from './manage-asset'
import { ManageContentfulEntry } from './manage-entry'

export class ManageContentful implements ManageCms {
  readonly manage: ClientAPI
  private environment: Promise<Environment>
  private readonly manageAsset: ManageContentfulAsset
  private readonly manageEntry: ManageContentfulEntry

  constructor(readonly options: ContentfulOptions) {
    this.manage = this.createClient()
    this.environment = this.getEnvironment()
    this.manageAsset = new ManageContentfulAsset(
      options,
      this.manage,
      this.environment
    )
    this.manageEntry = new ManageContentfulEntry(
      options,
      this.manage,
      this.environment
    )
  }

  private createClient() {
    return createClient({
      accessToken: this.options.accessToken,
      timeout: this.options.timeoutMs,
    })
  }

  private async getEnvironment(): Promise<Environment> {
    const space = await this.manage.getSpace(this.options.spaceId)
    if (!this.options.environment) {
      throw new Error('Please specify environment in ContentfulOptions')
    }
    return await space.getEnvironment(this.options.environment)
  }

  async deleteContent(
    context: ManageContext,
    contentId: ContentId
  ): Promise<void> {
    return this.manageEntry.deleteContent(context, contentId)
  }

  async createContent(
    context: ManageContext,
    model: ContentType,
    id: string
  ): Promise<void> {
    return this.manageEntry.createContent(context, model, id)
  }

  async updateFields(
    context: ManageContext,
    contentId: ContentId,
    fields: { [contentFieldType: string]: any },
    defaultLocale?: string,
    copyOnDefaultLocale?: boolean
  ): Promise<{ [contentFieldType: string]: any }> {
    return this.manageEntry.updateFields(
      context,
      contentId,
      fields,
      defaultLocale,
      copyOnDefaultLocale
    )
  }

  async copyField(
    context: ManageContext,
    contentId: ContentId,
    fieldType: ContentFieldType,
    fromLocale: nlp.Locale,
    onlyIfTargetEmpty: boolean
  ): Promise<void> {
    return this.manageEntry.copyField(
      context,
      contentId,
      fieldType,
      fromLocale,
      onlyIfTargetEmpty
    )
  }

  async removeAssetFile(
    context: ManageContext,
    assetId: AssetId
  ): Promise<void> {
    return this.manageAsset.removeAssetFile(context, assetId)
  }

  async copyAssetFile(
    context: ManageContext,
    assetId: AssetId,
    fromLocale: nlp.Locale
  ): Promise<void> {
    return this.manageAsset.copyAssetFile(context, assetId, fromLocale)
  }

  async createAsset(
    context: ManageContext,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<{ id: string; url?: string }> {
    return this.manageAsset.createAsset(context, file, info)
  }

  async removeAsset(context: ManageContext, assetId: AssetId): Promise<void> {
    return this.manageAsset.removeAsset(context, assetId)
  }
}
