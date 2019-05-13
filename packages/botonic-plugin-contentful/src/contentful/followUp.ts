import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { Entry } from 'contentful';
import { TextFields } from './text';
import { TextDelivery } from './text';
import { CarouselDelivery, CarouselFields } from './carousel';
import { DeliveryApi } from './deliveryApi';

export class DeliveryWithFollowUp {
  followUp: FollowUpDelivery | undefined;

  constructor(protected readonly delivery: DeliveryApi) {}

  // cannot be set in constructor because there's a circular dependency Model <-> Followup
  setFollowUp(followUp: FollowUpDelivery) {
    this.followUp = followUp;
  }
}
export class FollowUpDelivery {
  constructor(
    private readonly carousel: CarouselDelivery,
    private readonly text: TextDelivery
  ) {}

  // TODO we should detect cycles to avoid infinite recursion
  fromFields(
    followUp: Entry<TextFields | CarouselFields> | undefined,
    callbacks: cms.CallbackMap
  ): Promise<model.FollowUp | undefined> {
    if (!followUp) {
      return Promise.resolve(undefined);
    }
    switch (DeliveryApi.getContentModel(followUp)) {
      case cms.ModelType.CAROUSEL:
        // here followUp already has its fields set, but not yet its element fields
        return this.carousel.carousel(followUp.sys.id, callbacks);
      case cms.ModelType.TEXT:
        return this.text.textFromEntry(
          followUp as Entry<TextFields>,
          callbacks
        );
      default:
        throw new Error(`Unexpected followUp type ${followUp.sys.type}`);
    }
  }
}
