import { CarouselFields } from './carousel';
import { DeliveryWithFollowUp } from './followUp';
import { TextFields } from './text';
import * as cms from '../cms';
import * as contentful from 'contentful';
import { DeliveryApi } from './deliveryApi';

export class UrlDelivery extends DeliveryWithFollowUp {
  constructor(protected readonly delivery: DeliveryApi) {
    super(delivery);
  }

  async url(id: string): Promise<cms.Url> {
    let entry: contentful.Entry<UrlFields> = await this.delivery.getEntry(id);
    let followUp = this.followUp!.fromFields(
      entry.fields.followup!,
      new cms.CallbackMap()
    );
    return new cms.Url(entry.fields.url, await followUp);
  }
}

export interface UrlFields {
  url: string;
  followup?: contentful.Entry<TextFields | CarouselFields>;
}
