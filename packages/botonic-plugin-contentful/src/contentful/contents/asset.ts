import { Asset } from 'contentful'

import * as cms from '../../cms'
import { ResourceDelivery } from '../content-delivery'

export class AssetDelivery extends ResourceDelivery {
  async asset(id: string, context: cms.Context): Promise<cms.Asset> {
    const asset = await this.delivery.getAsset(id, context)
    return this.fromEntry(asset)
  }

  private fromEntry(asset: Asset) {
    const url = this.urlFromAssetRequired(asset)
    return new cms.Asset(
      asset.sys.id,
      asset.fields.title,
      url,
      asset.fields.file.contentType,
      asset.fields.file.details
    )
  }

  async assets(context: cms.Context): Promise<cms.Asset[]> {
    const assets = await this.delivery.getAssets(context)
    return assets.items.map(a => this.fromEntry(a))
  }
}
