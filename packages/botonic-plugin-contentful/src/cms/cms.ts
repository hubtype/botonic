import { RichMessage, Carousel } from "./model";

export class Callback {
  payload: string;

  url: string;
}
export interface CMS {
  richMessage(id: string, payload: string): Promise<RichMessage>;
  carousel(id: string, callbacks: Callback[]): Promise<Carousel>;
}

export class DummyCMS implements CMS {
  async carousel(id: string, callbacks: Callback[]): Promise<Carousel> {
    return Promise.resolve({
      elements: [await this.richMessage(id, "payload")]
    });
  }

  async richMessage(id: string, payload: string): Promise<RichMessage> {
    // return this.client.getAsset(id);
    let msg = {
      title: "Title",
      subtitle: "Text",
      imgURL: "../assets/img_home_bg.png",
      button: { text: "press me", payload: "my_payload" }
    };
    return Promise.resolve(msg);
  }
}
