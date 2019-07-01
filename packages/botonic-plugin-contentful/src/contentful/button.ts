import * as contentful from 'contentful';
import {
  ContentWithKeywordsFields,
  ContentWithNameFields
} from './delivery-api';
import { ModelType, DeliveryApi } from '.';
import * as cms from '../cms';
import { UrlFields } from './url';
import { CarouselFields } from './carousel';
import { TextFields } from './text';

export class ButtonDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  public fromReference(
    reference: contentful.Entry<any>,
    callbacks: cms.CallbackMap
  ): Promise<cms.Button> {
    return this.fromId(reference.sys.id, callbacks);
  }

  private async fromId(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<cms.Button> {
    let entry = await this.delivery.getEntry(id);
    let entryType = DeliveryApi.getContentModel(entry);
    switch (entryType as string) {
      case cms.ModelType.CAROUSEL:
      case cms.ModelType.TEXT:
      case cms.ModelType.URL:
        return ButtonDelivery.fromContent(entry as contentful.Entry<
          ContentWithKeywordsFields
        >);
      case cms.ModelType.BUTTON:
        let buttonEntry = entry as contentful.Entry<ButtonFields>;
        let callback = buttonEntry.fields.target
          ? await this.getTargetCallback(buttonEntry.fields.target)
          : callbacks.getCallback(id);
        return new cms.Button(
          buttonEntry.fields.name,
          buttonEntry.fields.text,
          callback
        );
      default:
        throw new Error(`Unexpected type ${entryType}`);
    }
  }

  private static async fromContent(
    entry: contentful.Entry<ContentWithKeywordsFields>
  ): Promise<cms.Button> {
    let fields = entry.fields;
    let text = fields.shortText;
    if (!text) {
      text = fields.name;
      console.error(`Text ${text} without short text`);
    }
    return new cms.Button(
      fields.name,
      text,
      DeliveryApi.callbackFromEntry(entry)
    );
  }

  private async getTargetCallback(target: ButtonTarget): Promise<cms.Callback> {
    let model = DeliveryApi.getContentModel(target) as string;
    switch (model) {
      case ModelType.CAROUSEL:
      case ModelType.TEXT:
        return new cms.ContentCallback(model, target.sys.id);
      case ModelType.URL: {
        let urlFields = target as contentful.Entry<UrlFields>;
        return cms.Callback.ofUrl(urlFields.fields.url);
      }
      case ModelType.PAYLOAD: {
        let payloadFields = target as contentful.Entry<PayloadFields>;
        return cms.Callback.ofPayload(payloadFields.fields.payload);
      }
      default:
        throw new Error('Unexpected type: ' + model);
    }
  }
}
export interface PayloadFields {
  payload: string;
}

type ButtonTarget = contentful.Entry<
  CarouselFields | TextFields | UrlFields | PayloadFields
>;

export interface ButtonFields extends ContentWithNameFields {
  text: string;
  target?: ButtonTarget;
}
