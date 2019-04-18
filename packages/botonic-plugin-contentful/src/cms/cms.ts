import { Element, Carousel, Button } from './model';

export class Callback {
  constructor(readonly payload?: string, readonly url?: string) {}

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
  private forAllIds?: Callback;

  private callbacks: Map<string, Callback> = new Map();

  static forAllIds(callback: Callback): CallbackMap {
    let map = new CallbackMap();
    map.forAllIds = callback;
    return map;
  }

  addCallback(id: string, callback: Callback): CallbackMap {
    if (this.forAllIds) {
      throw new Error('Cannot add callback when created with forAllIds');
    }

    this.callbacks.set(id, callback);
    return this;
  }

  getCallback(id: string): Callback {
    if (this.forAllIds) {
      return this.forAllIds;
    }

    let callback = this.callbacks.get(id);
    if (!callback) {
      throw new Error(`No callback for id ${id}`);
    }

    return callback;
  }
}

export interface CMS {
  element(id: string, callbacks: CallbackMap): Promise<Element>;

  carousel(id: string, callbacks: CallbackMap): Promise<Carousel>;
}

export class DummyCMS implements CMS {
  async carousel(id: string, callbacks: CallbackMap): Promise<Carousel> {
    return Promise.resolve(new Carousel([await this.element(id, callbacks)]));
  }

  async element(id: string, callbacks: CallbackMap): Promise<Element> {
    let message = new Element(
      'Title for ' + id,
      'subtitle',
      '../assets/img_home_bg.png'
    );
    message.addButton(new Button('press me', callbacks.getCallback(id)));

    return Promise.resolve(message);
  }
}
