import { ModelType } from '../cms';
import * as cms from '../cms';
import { Entry } from 'contentful';
import { ContentDelivery } from './content-delivery';
import { TextFields, TextDelivery } from './text';
import { CarouselDelivery, CarouselFields } from './carousel';
import { ImageDelivery, ImageFields } from './image';
import { DeliveryApi } from './delivery-api';

export class DeliveryWithFollowUp extends ContentDelivery {
  followUp: FollowUpDelivery | undefined;

  // cannot be set in constructor because there's a circular dependency Model <-> Followup
  setFollowUp(followUp: FollowUpDelivery) {
    this.followUp = followUp;
  }
}

type FollowUpFields = TextFields | CarouselFields | ImageFields;

export class FollowUpDelivery {
  constructor(
    private readonly carousel: CarouselDelivery,
    private readonly text: TextDelivery
  ) {}

  // TODO we should detect cycles to avoid infinite recursion
  fromFields(
    followUp: Entry<FollowUpFields> | undefined,
    context: cms.Context
  ): Promise<cms.FollowUp | undefined> {
    if (!followUp) {
      return Promise.resolve(undefined);
    }
    switch (DeliveryApi.getContentModel(followUp)) {
      case ModelType.CAROUSEL:
        // here followUp already has its fields set, but not yet its element fields
        return this.carousel.carousel(followUp.sys.id, context);
      case cms.ModelType.TEXT:
        return this.text.fromEntry(followUp as Entry<TextFields>, context);
      case cms.ModelType.IMAGE:
        return Promise.resolve(
          ImageDelivery.fromEntry(followUp as Entry<ImageFields>)
        );
      default:
        throw new Error(`Unexpected followUp type ${followUp.sys.type}`);
    }
  }
}
