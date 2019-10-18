import * as cms from '../cms';
import { ModelType } from '../cms';
import { Entry } from 'contentful';
import { ContentDelivery } from './content-delivery';
import { TextDelivery, TextFields } from './text';
import { CarouselDelivery } from './carousel';
import { ImageDelivery, ImageFields } from './image';
import {
  CommonEntryFields,
  commonFieldsFromEntry,
  DeliveryApi,
  FollowUpFields
} from './delivery-api';
import { StartUpDelivery, StartUpFields } from './startup';

export class DeliveryWithFollowUp extends ContentDelivery {
  followUp: FollowUpDelivery | undefined;

  // cannot be set in constructor because there's a circular dependency Model <-> Followup
  setFollowUp(followUp: FollowUpDelivery) {
    this.followUp = followUp;
  }

  getFollowUp(): FollowUpDelivery {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.followUp!;
  }
}

export class FollowUpDelivery {
  constructor(
    private readonly carousel: CarouselDelivery,
    private readonly text: TextDelivery,
    private readonly image: ImageDelivery,
    private readonly startUp: StartUpDelivery
  ) {}

  // TODO we should detect cycles to avoid infinite recursion
  fromEntry(
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

  async commonFields(entry: Entry<CommonEntryFields>, context: cms.Context) {
    const common = commonFieldsFromEntry(entry);
    if (entry.fields.followup) {
      common.followUp = await this.fromEntry(entry.fields.followup, context);
      return common;
    }
    return common;
  }
}
