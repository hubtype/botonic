import { Entry } from 'contentful';
import { ModelType } from '../cms/cms';
import { CarouselDelivery, CarouselFields } from './carousel';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import * as contentful from 'contentful';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './deliveryApi';

export class TextDelivery {
  constructor(
    readonly delivery: DeliveryApi,
    readonly button: ButtonDelivery,
    readonly carousel: CarouselDelivery
  ) {}

  async text(id: string, callbacks: cms.CallbackMap): Promise<model.Text> {
    let entry: contentful.Entry<TextFields> = await this.delivery.getEntry(id);
    return this.textFromField(entry, callbacks);
  }

  async textFromField(
    entry: contentful.Entry<TextFields>,
    callbacks: cms.CallbackMap
  ): Promise<model.Text> {
    let fields = entry.fields;
    let buttons = fields.buttons || [];
    let followup = this.followUpFromField(fields.followup, callbacks);
    let promises = [followup];
    promises.push(
      ...buttons.map(reference =>
        this.button.fromReference(reference, callbacks)
      )
    );

    return Promise.all(promises).then(followUpAndButtons => {
      let followUp = followUpAndButtons.shift() as (model.Text | undefined);
      let buttons = followUpAndButtons as model.Button[];
      return new model.Text(fields.text, buttons, followUp);
    });
  }

  private followUpFromField(
    followUp: Entry<TextFields | CarouselFields> | undefined,
    callbacks: cms.CallbackMap
  ): Promise<model.Model | undefined> {
    if (!followUp) {
      return Promise.resolve(undefined);
    }
    switch (DeliveryApi.getContentModel(followUp)) {
      case ModelType.CAROUSEL:
        // here followUp already has its fields set, but not yet its element fields
        return this.carousel.carousel(followUp.sys.id, callbacks);
      case ModelType.TEXT:
        return this.textFromField(followUp as Entry<TextFields>, callbacks);
      default:
        throw new Error(`Unexpected followup type ${followUp.sys.type}`);
    }
  }
}

export interface TextFields {
  name: string;
  text: string;
  buttons: contentful.Entry<any>[];
  followup?: contentful.Entry<TextFields | CarouselFields>;
}
