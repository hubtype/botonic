import * as cms from './cms';
import { Button, Carousel, Element, Model, Text, Url } from './model';
import escapeStringRegexp = require('escape-string-regexp');

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  BUTTON = 'button',
  URL = 'url'
}

export class Callback {
  private static PAYLOAD_SEPARATOR = '$';

  /**
   * @param payload may contain the reference of a {@link Model}. See {@link ofModel}
   * @param url for hardcoded URLs (otherwise, use a {@link Url})
   */
  constructor(readonly payload?: string, readonly url?: string) {}

  static ofPayload(payload: string): Callback {
    return new Callback(payload, undefined);
  }

  static ofUrl(url: string): Callback {
    return new Callback(undefined, url);
  }

  /**
   * Create Callback to open a model configured through CMS
   */
  static ofModel(model: ModelType, contentId: string): Callback {
    return Callback.ofPayload(model + Callback.PAYLOAD_SEPARATOR + contentId);
  }

  static regexForModelType(modelType: ModelType): RegExp {
    return new RegExp(
      escapeStringRegexp(modelType + Callback.PAYLOAD_SEPARATOR)
    );
  }

  deliverPayloadModel(cms: CMS, callbacks?: CallbackMap): Promise<Model> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let [type, id] = this.payload!.split(Callback.PAYLOAD_SEPARATOR);
    switch (type as ModelType) {
      case ModelType.CAROUSEL:
        return cms.carousel(id, callbacks);
      case ModelType.TEXT:
        return cms.text(id, callbacks);
      case ModelType.URL:
        return cms.url(id);
      default:
        throw new Error(
          `Type ${type} not supported for callback with id ${id}`
        );
    }
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
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: cms.CallbackMap): Promise<Text>;
  url(id: string): Promise<Url>;
  textsWithKeywordsAsButtons(): Promise<cms.ButtonsWithKeywords[]>;
}

export class ErrorReportingCMS implements CMS {
  constructor(readonly cms: CMS) {}

  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel> {
    return this.cms
      .carousel(id, callbacks)
      .catch(this.handleError(ModelType.CAROUSEL, id));
  }

  text(id: string, callbacks?: CallbackMap): Promise<Text> {
    return this.cms
      .text(id, callbacks)
      .catch(this.handleError(ModelType.TEXT, id));
  }

  url(id: string): Promise<Url> {
    return this.cms.url(id).catch(this.handleError(ModelType.URL, id));
  }

  textsWithKeywordsAsButtons(): Promise<cms.ButtonsWithKeywords[]> {
    return this.cms
      .textsWithKeywordsAsButtons()
      .catch(this.handleError('textsWithKeywords'));
  }

  private handleError(modelType: string, id?: string): (reason: any) => never {
    return (reason: any) => {
      let withId = id ? ` with id '${id}'` : '';
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${modelType}${withId}: ${reason}`);
      throw reason;
    };
  }
}

/**
 * Useful for mocking it, as ts-mockito does not allow mocking interfaces
 */
export class DummyCMS implements CMS {
  constructor(readonly buttonCallbacks: Callback[]) {}

  async carousel(
    id: string,
    callbacks: CallbackMap = new CallbackMap()
  ): Promise<Carousel> {
    let elements = this.buttonCallbacks.map(callback =>
      this.element(Math.random().toString(), callback)
    );
    return Promise.resolve(new Carousel(id, elements));
  }

  async text(
    id: string,
    callbacks: CallbackMap = new CallbackMap()
  ): Promise<Text> {
    return Promise.resolve(
      new Text(id, 'Dummy text for ' + id, this.buttons(), id, ['kw1', 'kw2'])
    );
  }

  private buttons(): Button[] {
    return this.buttonCallbacks.map(
      callback =>
        new Button(callback.payload || callback.url!, 'press me', callback)
    );
  }

  private element(id: string, callback: Callback): Element {
    return new Element(
      [new Button(callback.payload || callback.url!, 'press me', callback)],
      'Title for ' + id,
      'subtitle',
      '../assets/img_home_bg.png'
    );
  }

  url(id: string): Promise<Url> {
    return Promise.resolve(new Url(`http://url.${id}`));
  }

  textsWithKeywordsAsButtons(): Promise<cms.ButtonsWithKeywords[]> {
    // return Promise.resolve(new cms.ButtonsWithKeywords())
    throw new Error('not implemented yet');
  }
}

export class ButtonsWithKeywords {
  constructor(readonly button: Button, readonly keywords: string[]) {}
}
