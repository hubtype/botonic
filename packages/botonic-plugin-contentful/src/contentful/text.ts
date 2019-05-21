import { DeliveryWithFollowUp } from './followUp';
import { CarouselFields } from './carousel';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import * as contentful from 'contentful';
import { ButtonDelivery } from './button';
import { DeliveryApi } from './deliveryApi';

export class TextDelivery extends DeliveryWithFollowUp {
  constructor(
    protected delivery: DeliveryApi,
    private readonly button: ButtonDelivery
  ) {
    super(delivery);
  }

  async text(id: string, callbacks: cms.CallbackMap): Promise<model.Text> {
    let entry: contentful.Entry<
      TextFields
    > = await this.delivery.getEntryByIdOrName(id, cms.ModelType.TEXT);
    return this.textFromEntry(entry, callbacks);
  }

  async textFromEntry(
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
      return new model.Text(
        fields.name,
        fields.text,
        buttons,
        fields.shortText,
        fields.keywords,
        followUp
      );
    });
  }
}

export interface TextFields {
  // An ID (eg. PRE_FAQ1)
  name: string;
  // Useful to display in buttons or reports
  shortText: string;
  // Full text
  text: string;
  buttons: contentful.Entry<any>[];
  keywords?: string[];
  followup?: contentful.Entry<TextFields | CarouselFields>;
}
