import * as cms from './cms';
import {
  Button,
  Carousel,
  ContentWithKeywords,
  Element,
  Model,
  Text,
  Url
} from './model';
import escapeStringRegexp = require('escape-string-regexp');

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload'
}

export enum ButtonStyle {
  BUTTON = 0,
  QUICK_REPLY = 1
}

export class Callback {
  /**
   * @param payload may contain the reference of a {@link Model}. See {@link ofModel}
   * @param url for hardcoded URLs (otherwise, use a {@link Url})
   */
  constructor(readonly payload?: string, readonly url?: string) {}

  static ofPayload(payload: string): Callback {
    if (ContentCallback.payloadReferencesContent(payload)) {
      return ContentCallback.ofPayload(payload);
    } else {
      return new Callback(payload, undefined);
    }
  }

  static ofUrl(url: string): Callback {
    return new Callback(undefined, url);
  }
}

export class ContentCallback extends Callback {
  private static PAYLOAD_SEPARATOR = '$';

  constructor(readonly model: ModelType, readonly id: string) {
    super(model + ContentCallback.PAYLOAD_SEPARATOR + id);
  }

  static payloadReferencesContent(payload: string): boolean {
    return payload.includes(ContentCallback.PAYLOAD_SEPARATOR);
  }

  static ofPayload(payload: string): ContentCallback {
    let [type, id] = payload.split(ContentCallback.PAYLOAD_SEPARATOR);
    if (!id) {
      throw new Error(
        `Callback payload '${payload}' does not content a model reference`
      );
    }
    return new ContentCallback(ContentCallback.checkDeliverableModel(type), id);
  }

  static regexForModel(modelType: ModelType): RegExp {
    return new RegExp(
      escapeStringRegexp(modelType + ContentCallback.PAYLOAD_SEPARATOR)
    );
  }

  private static checkDeliverableModel(modelType: string): cms.ModelType {
    switch (modelType as ModelType) {
      case ModelType.CAROUSEL:
      case ModelType.TEXT:
      case ModelType.URL:
        return modelType as ModelType;
      default:
        throw new Error(
          `${modelType} is not a mode type than can be delivered from CMS`
        );
    }
  }

  deliverPayloadModel(cms: CMS, callbacks?: CallbackMap): Promise<Model> {
    switch (this.model) {
      case ModelType.CAROUSEL:
        return cms.carousel(this.id, callbacks);
      case ModelType.TEXT:
        return cms.text(this.id, callbacks);
      case ModelType.URL:
        return cms.url(this.id);
      default:
        throw new Error(
          `Type '${this.model}' not supported for callback with id '${this.id}'`
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
  contentsWithKeywords(): Promise<ContentWithKeywords[]>;
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

  contentsWithKeywords(): Promise<ContentWithKeywords[]> {
    return this.cms
      .contentsWithKeywords()
      .catch(this.handleError('textsWithKeywords'));
  }

  private handleError(modelType: string, id?: string): (reason: any) => never {
    return (reason: any) => {
      let withId = id ? ` with id '${id}'` : '';
      if (reason.response && reason.response.data) {
        reason =
          reason.response.status + ': ' + JSON.stringify(reason.response.data);
      }
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${modelType}${withId}: ${reason}`);
      throw reason;
    };
  }
}

/**
 * Useful for mocking CMS, as ts-mockito does not allow mocking interfaces
 */
export class DummyCMS implements CMS {
  /**
   *
   * @param buttonCallbacks models which contain buttons will return one per each specified callback
   */
  constructor(readonly buttonCallbacks: Callback[]) {}

  async carousel(
    id: string,
    {  }: CallbackMap = new CallbackMap()
  ): Promise<Carousel> {
    let elements = this.buttonCallbacks.map(callback =>
      this.element(Math.random().toString(), callback)
    );
    return Promise.resolve(new Carousel(id, elements));
  }

  async text(id: string, {  }: CallbackMap = new CallbackMap()): Promise<Text> {
    return Promise.resolve(
      new Text(id, 'Dummy text for ' + id, this.buttons(), id, ['kw1', 'kw2'])
    );
  }

  private buttons(): Button[] {
    return this.buttonCallbacks.map(DummyCMS.buttonFromCallback);
  }

  private static buttonFromCallback(callback: Callback): Button {
    let id = callback.payload || callback.url!;
    return new Button(id, 'button text for ' + id, callback);
  }

  private element(id: string, callback: Callback): Element {
    return new Element(
      [DummyCMS.buttonFromCallback(callback)],
      'Title for ' + id,
      'subtitle',
      '../assets/img_home_bg.png'
    );
  }

  url(id: string): Promise<Url> {
    return Promise.resolve(new Url(`http://url.${id}`));
  }

  contentsWithKeywords(): Promise<ContentWithKeywords[]> {
    let contents = this.buttonCallbacks
      .filter(cb => cb instanceof ContentCallback)
      .map(cb => {
        let button = DummyCMS.buttonFromCallback(cb);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new ContentWithKeywords(
          cb as ContentCallback,
          button.name,
          button.text,
          ['keyword for ' + (button.callback.payload || button.callback.url!)]
        );
      });
    return Promise.resolve(contents);
  }
}
