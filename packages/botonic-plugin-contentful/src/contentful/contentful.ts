import * as contentful from 'contentful';
import { CMS, CallbackMap } from '../cms';
import { Carousel, Element, Button } from '../cms';
import { Callback } from '../cms';

export class Contentful implements CMS {
  private client: contentful.ContentfulClientApi;

  /**
   *
   * @param timeoutMs does not work at least when there's no network
   * during the first connection
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
    let message = new Element(
      entry.fields.title || undefined,
      entry.fields.subtitle || undefined,
      (entry.fields.pic && 'https:' + entry.fields.pic.fields.file.url) ||
        undefined
    );
    let but = entry.fields.button.fields;
    let callback = but.carousel
      ? Callback.ofPayload(but.carousel.sys.id)
      : callbacks.getCallback(id);
    message.addButton(new Button(but.text, callback));

    return Promise.resolve(message);
  }

  carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    throw new Error('Method not implemented.');
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
