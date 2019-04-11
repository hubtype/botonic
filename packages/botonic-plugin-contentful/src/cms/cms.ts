import { RichMessage, Carousel, Button } from "./model";
import { isString } from "util";
import { instanceOf } from "prop-types";

export class Callback {
  constructor(readonly payload?: string, readonly url?: string) {

  }

  static ofPayload(payload: string): Callback {
    return new Callback(payload, undefined);
  }
  static ofUrl(url: string): Callback {
    return new Callback(undefined, url);
  }
}

/**
 * Map the id of a UI element such a button to a callback
 */
export class CallbackMap {
  private callbacks: Map<string, Callback> = new Map();
  private forAllIds?: Callback;

  static forAllIds(callback: Callback): CallbackMap {
    let map = new CallbackMap();
    map.forAllIds = callback;
    return map;
  }

  addCallback(id: string, callback: Callback): CallbackMap {
    if (this.forAllIds) {
      throw new Error('Cannot add callback when created with forAllIds');
    } 
    this.callbacks[id] = callback;
    return this;
  }

  getCallback(id: string): Callback {
    if (this.forAllIds) {
      return this.forAllIds;
    }
    return this.callbacks[id];
  }
}

export interface CMS {
  richMessage(id: string, callbacks: CallbackMap): Promise<RichMessage>;
  carousel(id: string, callbacks: CallbackMap): Promise<Carousel>;
}

export class DummyCMS implements CMS {
  async carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    return Promise.resolve(new Carousel()
      .addElement(await this.richMessage(id, callbacks))
    );
  }

  async richMessage(id: string, callbacks: CallbackMap): Promise<RichMessage> {
    let msg = new RichMessage("Title", "subtitle", "../assets/img_home_bg.png");
    msg.addButton(new Button("press me", Callback.ofPayload('payload')));

    return Promise.resolve(msg);
  }
}
