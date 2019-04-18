import * as contentful from 'contentful';
import * as cms from '../cms/cms';
import * as model from '../cms/model';
import { Delivery } from './delivery';

export class Carousel {
  constructor(readonly delivery: Delivery) {}

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

  async button(id: string, callbacks: cms.CallbackMap): Promise<model.Button> {
    return (this.delivery.getEntry(id) as Promise<
      contentful.Entry<ButtonFields>
    >).then(entry => {
      let callback = entry.fields.carousel
        ? Carousel.callbackToOpenCarousel(entry.fields.carousel.sys.id)
        : callbacks.getCallback(id);
      console.log(callback.payload);
      return new model.Button(entry.fields.text, callback);
    });
  }

  private static callbackToOpenCarousel(newCarouselId: string): cms.Callback {
    let payload =
      cms.Callback.Constants.CAROUSEL_PREFIX +
      cms.Callback.Constants.PAYLOAD_SEPARATOR +
      newCarouselId;
    return cms.Callback.ofPayload(payload);
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
