import * as contentful from 'contentful';
import { Button } from './button';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { Delivery } from './delivery';

export class Carousel {
  constructor(readonly delivery: Delivery, readonly button: Button) {}

  async carousel(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<model.Carousel> {
    let entry: contentful.Entry<CarouselFields> = await this.delivery.getEntry(
      id
    );
    let elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntry(entry, callbacks);
    });
    return new model.Carousel(await Promise.all(elements));
  }

  /**
   * @todo support multiple buttons
   */
  private async elementFromEntry(
    entry: contentful.Entry<ElementFields>,
    callbacks: cms.CallbackMap
  ): Promise<model.Element> {
    let fields = entry.fields;
    let element = new model.Element(
      fields.title || undefined,
      fields.subtitle || undefined,
      (fields.pic && 'https:' + fields.pic.fields.file.url) || undefined
    );
    element.addButton(
      await this.button.fromReference(fields.button, callbacks)
    );
    return element;
  }
}

interface ElementFields {
  title: string;
  subtitle: string;
  pic?: contentful.Asset;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any it's just a reference
  button: contentful.Entry<any>;
}

export interface CarouselFields {
  name: string;
  elements: contentful.Entry<ElementFields>[];
}
