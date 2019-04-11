import { ContentfulClientApi, createClient } from "contentful";
import { CMS, Callback, CallbackMap } from "../cms/cms";
import { Carousel, RichMessage, Button } from "../cms/model";

interface ContentfulRichMessage {
  title: string;
  subtitle: string;
  pic: string;
  button: string;
}

export class Contentful implements CMS {
  carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    throw new Error("Method not implemented.");
  }

  client: ContentfulClientApi;

  login(spaceId: string, accessToken: string) {
    this.client = createClient({
      space: "u5utof016sy1", // SantCugat
      accessToken:
        "09ad9c1ef3f1fb3b4c4e330d13dff04f1666fcd1b4cde5ee607f3ca993ef574d"
    });
  }

  /**
   * @todo support multiple buttons
   */
  async richMessage(id: string, callbacks: CallbackMap): Promise<RichMessage> {
    let entry = await this.client.getEntry(id);
    
    let msg = new RichMessage(
      entry.fields["title"] || null,
      entry.fields["subtitle"] || null,
      entry.fields["pic"] || null
    );
    msg.addButton(new Button(entry.fields["button"], callbacks.getCallback(id)));
    
    return Promise.resolve(msg);
  }

}
