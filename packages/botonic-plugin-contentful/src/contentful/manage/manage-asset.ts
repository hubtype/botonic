// eslint-disable-next-line node/no-missing-import
import { ClientAPI } from 'contentful-management/dist/typings/create-contentful-api'
// eslint-disable-next-line node/no-missing-import
import { Asset } from 'contentful-management/dist/typings/entities/asset'
// eslint-disable-next-line node/no-missing-import
import { Environment } from 'contentful-management/dist/typings/entities/environment'

import { AssetId } from '../../cms'
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
