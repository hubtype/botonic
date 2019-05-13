import * as contentful from 'contentful';
import { ModelType, DeliveryApi } from '.';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { UrlFields } from './url';
import { CarouselFields } from './carousel';
import { TextFields } from './text';

export class ButtonDelivery {
  constructor(private readonly delivery: DeliveryApi) {}

  public fromReference(
    reference: contentful.Entry<any>,
    callbacks: cms.CallbackMap
  ): Promise<model.Button> {
    return this.fromId(reference.sys.id, callbacks);
  }

  private async fromId(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<model.Button> {
    let entry = await this.delivery.getEntry(id);
    let entryType = DeliveryApi.getContentModel(entry);
    switch (entryType as string) {
      case cms.ModelType.TEXT:
        return this.fromText(entry);
      case cms.ModelType.BUTTON:
        let buttonEntry = entry as contentful.Entry<ButtonFields>;
        let callback = buttonEntry.fields.target
          ? await this.getTargetCallback(buttonEntry.fields.target)
          : callbacks.getCallback(id);
        return new model.Button(
          buttonEntry.fields.name,
          buttonEntry.fields.text,
          callback
        );
      default:
        throw new Error(`Unexpected type ${entryType}`);
    }
  }

  private async fromText(entry: contentful.Entry<any>): Promise<model.Button> {
    let textEntry = entry as contentful.Entry<TextFields>;
    let text = textEntry.fields.shortText;
    if (!text) {
      text = textEntry.fields.name;
      console.error(`Text ${text} without short text`);
    }
    return new model.Button(
      textEntry.fields.name,
      textEntry.fields.shortText,
      cms.Callback.ofModel(cms.ModelType.TEXT, textEntry.sys.id)
    );
  }

  private async getTargetCallback(target: ButtonTarget): Promise<cms.Callback> {
    let model = DeliveryApi.getContentModel(target) as string;
    switch (model) {
      case ModelType.CAROUSEL:
      case ModelType.TEXT:
        return cms.Callback.ofModel(model, target.sys.id);
      case ModelType.URL: {
        let urlFields = target as contentful.Entry<UrlFields>;
        return cms.Callback.ofUrl(urlFields.fields.url);
      }
      default:
        throw new Error('Unexpected type :' + model);
    }
  }
}

type ButtonTarget = contentful.Entry<CarouselFields | TextFields | UrlFields>;

export interface ButtonFields {
  name: string;
  text: string;
  target?: ButtonTarget;
}
