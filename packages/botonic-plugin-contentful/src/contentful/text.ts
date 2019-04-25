import * as cms from '../cms/cms';
import * as model from '../cms/model';
import * as contentful from 'contentful';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './deliveryApi';

export class TextDelivery {
  constructor(
    readonly delivery: DeliveryApi,
    readonly button: ButtonDelivery
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
    let followup: Promise<model.Model | undefined> = Promise.resolve(undefined);
    if (fields.followup) {
      followup = this.textFromField(fields.followup, callbacks);
    }
    let promises: Promise<model.Model | undefined>[] = [followup];
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
}

export interface TextFields {
  name: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any it's just a reference
  buttons: contentful.Entry<any>[];
  followup?: contentful.Entry<TextFields>;
}
