import { DeliveryWithFollowUp } from './followUp';
import { CarouselFields } from './carousel';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import * as contentful from 'contentful';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './deliveryApi';

export class TextDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi, readonly button: ButtonDelivery) {
    super(delivery);
  }

  async text(id: string, callbacks: cms.CallbackMap): Promise<model.Text> {
    let entry: contentful.Entry<
      TextFields
    > = await this.delivery.getEntryByIdOrName(id, cms.ModelType.TEXT);
    return this.textFromField(entry, callbacks);
  }

  async textFromField(
    entry: contentful.Entry<TextFields>,
    callbacks: cms.CallbackMap
  ): Promise<model.Text> {
    let fields = entry.fields;
    let buttons = fields.buttons || [];
    let followup: Promise<model.Model | undefined> = this.followUp!.fromFields(
      fields.followup,
      callbacks
    );
    let promises = [followup];
    promises.push(
      ...buttons.map(reference =>
        this.button.fromReference(reference, callbacks)
      )
    );

    return Promise.all(promises).then(followUpAndButtons => {
      let followUp = followUpAndButtons.shift() as (model.Text | undefined);
      let buttons = followUpAndButtons as model.Button[];
      return new model.Text(fields.name, fields.text, buttons, followUp);
    });
  }
}

export interface TextFields {
  name: string;
  text: string;
  buttons: contentful.Entry<any>[];
  followup?: contentful.Entry<TextFields | CarouselFields>;
}
