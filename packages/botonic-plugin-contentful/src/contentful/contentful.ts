import { ContentfulClientApi, createClient, Entry } from "contentful";
import { CMS, Callback, CallbackMap } from "../cms/cms";
import { Carousel, RichMessage, Button } from "../cms/model";

interface ContentfulRichMessage {
  title: string;
  subtitle: string;
  pic: string;
  button: string;
}

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
    let entry : Entry<Map<string, string>> = await this.client.getEntry(id);

    let msg = new RichMessage(
      entry.fields["title"] || null,
      entry.fields["subtitle"] || null,
      entry.fields["pic"] || null
    );
    msg.addButton(new Button(entry.fields["button"], callbacks.getCallback(id)));

    return Promise.resolve(msg);
  }
  carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    throw new Error("Method not implemented.");
  }


}
