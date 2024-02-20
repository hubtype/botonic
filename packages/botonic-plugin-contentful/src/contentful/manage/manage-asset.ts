// eslint-disable-next-line node/no-missing-import
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
// eslint-disable-next-line node/no-missing-import
import {
  Asset,
  AssetFileProp,
} from 'contentful-management/dist/typings/entities/asset'
// eslint-disable-next-line node/no-missing-import
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import { Stream } from 'stream'

import { AssetId, AssetInfo, CmsException } from '../../cms'
import { ManageContext } from '../../manage-cms/manage-context'
import * as nlp from '../../nlp'
import { ContentfulOptions } from '../../plugin'

export class ManageContentfulAsset {
  constructor(
    readonly options: ContentfulOptions,
    readonly manage: ClientAPI,
    readonly environment: Promise<Environment>
  ) {}

  async removeAssetFile(
    context: ManageContext,
    assetId: AssetId
  ): Promise<void> {
    const environment = await this.environment
    const asset = await environment.getAsset(assetId.id)
    delete asset.fields.file[context.locale]
    await this.writeAsset({ ...context, allowOverwrites: true }, asset)
  }

  async copyAssetFile(
    context: ManageContext,
    assetId: AssetId,
    fromLocale: nlp.Locale
  ): Promise<void> {
    const environment = await this.environment
    const oldAsset = await environment.getAsset(assetId.id)
    if (!context.allowOverwrites && oldAsset.fields.file[context.locale]) {
      throw new Error(
        `Cannot overwrite asset '${assetId.toString()}' because it's not empty and ManageContext.allowOverwrites is false`
      )
    }
    const fromFile = oldAsset.fields.file[fromLocale]
    if (!fromFile) {
      throw Error(
        `Asset '${assetId.toString()}' has no file for locale ${fromLocale}`
      )
    }
    oldAsset.fields.file[context.locale] = fromFile
    // we could use this.deliver.contentFromEntry & IgnoreFallbackDecorator to convert
    // the multilocale fields returned by update()
    await this.writeAsset(context, oldAsset)
  }

  async removeAsset(_context: ManageContext, assetId: AssetId): Promise<void> {
    const environment = await this.environment
    try {
      const asset = await environment.getAsset(assetId.id)
      if (asset.isPublished()) await asset.unpublish()
      await asset.delete()
    } catch (e) {
      throw new CmsException('ERROR while deleting asset', e, assetId)
    }
  }

  async createAsset(
    context: ManageContext,
    file: string | ArrayBuffer | Stream,
    info: AssetInfo
  ): Promise<{ id: string; url?: string }> {
    const environment = await this.environment
    const data: Omit<AssetFileProp, 'sys'> = {
      fields: {
        title: {
          [context.locale]: info.name,
        },
        description: {},
        file: {
          [context.locale]: {
            contentType: info.type || '',
            fileName: info.fileName || '',
            file,
          },
        },
      },
    }
    if (info.description) {
      data.fields.description[context.locale] = info.description
    }
    const asset = await environment.createAssetFromFiles(data)
    const processedAsset = await asset.processForLocale(context.locale)
    const publishedAsset = await processedAsset.publish()
    return {
      id: publishedAsset.sys.id,
      url: publishedAsset.fields.file[context.locale].url,
    }
  }

  private async writeAsset(
    context: ManageContext,
    asset: Asset
  ): Promise<void> {
    if (context.dryRun) {
      console.log('Not updating due to dryRun mode')
      return
    }
    const updated = await asset.update()
    if (!context.preview) {
      await updated.publish()
    }
  }
}
