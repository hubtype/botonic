import { ContentfulClientApi, createClient } from "contentful";
import { CMS, Callback } from "../cms/cms";

export class Contentful implements CMS {
  carousel(id: string, callbacks: Callback[]): Promise<Carousel> {
    throw new Error("Method not implemented.");
  }
  client: ContentfulClientApi;

  login(spaceId: string, accessToken: string): void {
    // this.client = createClient({
    //   space: '92w5st1ik4od', // MASSIMO
    //   accessToken:
    //     '531e998080a22a1da8cca3d3642a4628f0c19053e0a5244815c9a10b5b3781c4'
    // });

    this.client = createClient({
      space: "u5utof016sy1", // SantCugat
      accessToken:
        "09ad9c1ef3f1fb3b4c4e330d13dff04f1666fcd1b4cde5ee607f3ca993ef574d"
    });
  }

  async richMessage(id: string, payload: string): Promise<RichMessage> {
    let entry = await this.client.getEntry(id);

    let msg: RichMessage = {
      title: entry.fields["title"] || null,
      subtitle: entry.fields["subtitle"] || null,
      imgURL: entry.fields["pic"] || null
    };
    if (entry.fields["button"]) {
      msg.button = { text: entry.fields["button"], payload: payload };
    }
    return Promise.resolve(msg);
  }
}
