import { ContentfulClientApi, createClient, Entry } from 'contentful';
import { CMS, CallbackMap } from '../cms';
import { Carousel, RichMessage, Button } from '../cms';

export class Contentful implements CMS {
  private client: ContentfulClientApi;

  constructor(spaceId: string, accessToken: string) {
    this.client = createClient({
      space: spaceId,
      accessToken: accessToken
    });
  }

  /**
   * @todo support multiple buttons
   */
  async richMessage(id: string, callbacks: CallbackMap): Promise<RichMessage> {
    let entry: Entry<RichMessageModel> = await this.client.getEntry(id);

    let message = new RichMessage(
      entry.fields.title || null,
      entry.fields.subtitle || null,
      entry.fields.pic || null
    );
    message.addButton(
      new Button(entry.fields['button'], callbacks.getCallback(id))
    );

    return Promise.resolve(message);
  }

  carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    throw new Error('Method not implemented.');
  }
}

interface RichMessageModel {
  title: string;
  subtitle: string;
  pic: string;
  button: string;
}
