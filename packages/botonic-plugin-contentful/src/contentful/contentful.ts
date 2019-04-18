import * as contentful from 'contentful';
import { Carousel, Element, Button } from '../cms/model';
import { Callback, CMS, CallbackMap } from '../cms/cms';

export class Contentful implements CMS {
  private client: contentful.ContentfulClientApi;

  /**
   *
   * @param timeoutMs does not work at least when there's no network
   * during the first connection
   *
   * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
   * for API rate limits
   */
  constructor(spaceId: string, accessToken: string, timeoutMs: number = 30000) {
    this.client = contentful.createClient({
      space: spaceId,
      accessToken: accessToken,
      timeout: timeoutMs
    });
  }

  /**
   * @todo support multiple buttons
   *
   */
  async element(id: string, callbacks: CallbackMap): Promise<Element> {
    let entry: contentful.Entry<ElementFields> = await this.client.getEntry(id);
    return this.elementFromEntryFields(entry.sys.id, entry.fields, callbacks);
  }

  async elementFromEntryFields(
    id: string,
    fields: ElementFields,
    callbacks: CallbackMap
  ): Promise<Element> {
    let element = new Element(
      fields.title || undefined,
      fields.subtitle || undefined,
      (fields.pic && 'https:' + fields.pic.fields.file.url) || undefined
    );
    element.addButton(await this.button(fields.button.sys.id, callbacks));
    return element;
  }

  async carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    let entry: contentful.Entry<CarouselFields> = await this.client.getEntry(
      id
    );
    let elements = entry.fields.elements.map(async entry => {
      return this.elementFromEntryFields(entry.sys.id, entry.fields, callbacks);
    });
    return new Carousel(await Promise.all(elements));
  }

  async button(id: string, callbacks: CallbackMap): Promise<Button> {
    return (this.client.getEntry(id) as Promise<
      contentful.Entry<ButtonFields>
    >).then(entry => {
      let callback = entry.fields.carousel
        ? Callback.ofPayload(entry.fields.carousel.sys.id)
        : callbacks.getCallback(id);
      return new Button(entry.fields.text, callback);
    });
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
