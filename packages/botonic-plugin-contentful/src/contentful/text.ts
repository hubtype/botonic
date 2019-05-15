import * as contentful from 'contentful';
import * as cms from '../cms/cms';
import { ButtonStyle } from '../cms/cms';
import * as model from '../cms/model';
import { ButtonDelivery } from './button';
import { CarouselFields } from './carousel';
import { DeliveryApi } from './deliveryApi';
import { DeliveryWithFollowUp } from './followUp';

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
        followUp,
        fields.buttonsStyle == 'QuickReplies'
          ? ButtonStyle.QUICK_REPLY
          : ButtonStyle.BUTTON
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
  buttonsStyle?: string;
}
