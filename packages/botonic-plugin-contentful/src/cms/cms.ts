import * as time from '../time/schedule';
import { CallbackMap, Callback, ContentCallback } from './callback';
import {
  Button,
  Carousel,
  ContentWithKeywords,
  Element,
  Text,
  Url
} from './model';

export enum ModelType {
  CAROUSEL = 'carousel',
  TEXT = 'text',
  BUTTON = 'button',
  URL = 'url',
  PAYLOAD = 'payload',
  SCHEDULE = 'schedule'
}

export interface CMS {
  carousel(id: string, callbacks?: CallbackMap): Promise<Carousel>;
  text(id: string, callbacks?: CallbackMap): Promise<Text>;
  url(id: string): Promise<Url>;
  contentsWithKeywords(): Promise<ContentWithKeywords[]>;
  schedule(id: string): Promise<time.Schedule>;
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

  schedule(id: string): Promise<time.Schedule> {
    return this.cms
      .schedule(id)
      .catch(this.handleError(ModelType.SCHEDULE, id));
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

  schedule(id: string): Promise<time.Schedule> {
    return Promise.resolve(new time.Schedule('Europe/Madrid'));
  }
}
