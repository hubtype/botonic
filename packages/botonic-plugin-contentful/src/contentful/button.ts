import * as contentful from 'contentful';
import { ModelType, DeliveryApi } from '.';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { UrlFields } from './url';
import { CarouselFields } from './carousel';
import { TextFields } from './text';

export class ButtonDelivery {
  constructor(readonly delivery: DeliveryApi) {}

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
    let entry = await (this.delivery.getEntry(id) as Promise<
      contentful.Entry<ButtonFields>
    >);
    let callback = entry.fields.target
      ? await this.getTargetCallback(entry.fields.target)
      : callbacks.getCallback(id);
    return new model.Button(entry.fields.name, entry.fields.text, callback);
  }

  private async getTargetCallback(target: ButtonTarget): Promise<cms.Callback> {
    let model = DeliveryApi.getContentModel(target);
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
