import * as cms from '../cms/cms';
import * as model from '../cms/model';
import * as contentful from 'contentful';
import { Button } from './button';
import { Delivery } from './delivery';

export class Text {
  constructor(readonly delivery: Delivery, readonly button: Button) {}

  async text(id: string, callbacks: cms.CallbackMap): Promise<model.Text> {
    let entry: contentful.Entry<TextFields> = await this.delivery.getEntry(id);
    let fields = entry.fields;
    let buttonsPromises = entry.fields.buttons.map(reference =>
      this.button.fromReference(reference, callbacks)
    );
    return Promise.all(buttonsPromises).then(
      buttons => new model.Text(fields.text, buttons)
    );
  }
}

export interface TextFields {
  name: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any it's just a reference
  buttons: contentful.Entry<any>[];
}
