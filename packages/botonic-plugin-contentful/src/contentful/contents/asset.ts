import * as cms from '../../cms'
import { ContentfulEntryUtils, DeliveryApi } from '../delivery-api'
import { Asset } from 'contentful'

export class AssetDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async asset(id: string, context: cms.Context): Promise<cms.Asset> {
    const asset = await this.delivery.getAsset(id, context)
    return this.fromEntry(asset)
  }

  private fromEntry(asset: Asset) {
    return new cms.Asset(
      asset.sys.id,
      asset.fields.title,
      ContentfulEntryUtils.urlFromAsset(asset),
      asset.fields.file.contentType,
      asset.fields.file.details
    )
  }

  async assets(context: cms.Context): Promise<cms.Asset[]> {
    const assets = await this.delivery.getAssets(context)
    return assets.items.map(a => this.fromEntry(a))
  }
}
