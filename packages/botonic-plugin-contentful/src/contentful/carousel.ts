import { Entry } from 'contentful';
import * as contentful from 'contentful';
import * as cms from '../cms';
import { Delivery } from './delivery';

export class Carousel {
  constructor(readonly delivery: Delivery) {}

  async carousel(
    id: string,
    callbacks: cms.CallbackMap
  ): Promise<cms.Carousel> {
    let entry: contentful.Entry<CarouselFields> = await this.delivery.getEntry(
      id
    );
    let elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntry(entry, callbacks);
    });
    return new cms.Carousel(await Promise.all(elements));
  }

  async button(id: string, callbacks: cms.CallbackMap): Promise<cms.Button> {
    return (this.delivery.getEntry(id) as Promise<
      contentful.Entry<ButtonFields>
    >).then(entry => {
      let callback = entry.fields.carousel
        ? cms.Callback.ofPayload(entry.fields.carousel.sys.id)
        : callbacks.getCallback(id);
      return new cms.Button(entry.fields.text, callback);
    });
  }

  /**
   * @todo support multiple buttons
   */
  private async elementFromEntry(
    entry: Entry<ElementFields>,
    callbacks: cms.CallbackMap
  ): Promise<cms.Element> {
    let fields = entry.fields;
    let element = new cms.Element(
      fields.title || undefined,
      fields.subtitle || undefined,
      (fields.pic && 'https:' + fields.pic.fields.file.url) || undefined
    );
    element.addButton(await this.button(fields.button.sys.id, callbacks));
    return element;
  }
}

interface ButtonFields {
  text: string;
  carousel?: contentful.Entry<ElementFields>;
}

interface ElementFields {
  title: string;
  subtitle: string;
  pic?: contentful.Asset;
  button: contentful.Entry<ButtonFields>;
}

interface CarouselFields {
  name: string;
  elements: contentful.Entry<ElementFields>[];
}
