import * as contentful from 'contentful';
import { ModelType, Delivery } from '.';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { CarouselFields } from './carousel';
import { TextFields } from './text';

export class Button {
  constructor(readonly delivery: Delivery) {}

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
    return (this.delivery.getEntry(id) as Promise<
      contentful.Entry<ButtonFields>
    >).then(entry => {
      let callback = entry.fields.target
        ? Button.getTargetCallback(entry.fields.target)
        : callbacks.getCallback(id);
      return new model.Button(entry.fields.text, callback);
    });
  }

  private static getTargetCallback(
    target: contentful.Entry<CarouselFields | TextFields>
  ): cms.Callback {
    let model = Delivery.getContentModel(target);
    switch (model) {
      case ModelType.CAROUSEL:
      case ModelType.TEXT:
      case ModelType.URL:
        return cms.Callback.ofModel(model, target.sys.id);
      default:
        throw new Error('Unexpected type :' + model);
    }
  }
}

export interface ButtonFields {
  text: string;
  target?: contentful.Entry<CarouselFields | TextFields>;
}
