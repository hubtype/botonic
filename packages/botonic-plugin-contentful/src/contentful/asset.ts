import * as cms from '../cms';
import { DeliveryApi } from './delivery-api';

export class AssetDelivery {
  constructor(protected delivery: DeliveryApi) {}

  async asset(id: string): Promise<cms.Asset> {
    let asset = await this.delivery.getAsset(id);
    return new cms.Asset(
      asset.fields.title,
      DeliveryApi.urlFromAsset(asset),
      asset.fields.file.contentType,
      asset.fields.file.details
    );
  }
}
