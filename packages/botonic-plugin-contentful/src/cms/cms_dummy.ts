import { Callback, CallbackMap, ContentCallback } from './callback';
import { CMS } from './cms';
import {
  Button,
  Carousel,
  ContentCallbackWithKeywords,
  Element,
  Text,
  Url
} from './contents';
import * as time from '../time/schedule';

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
    return Promise.resolve(
      new Url(id, `http://url.${id}`, 'button text for' + id)
    );
  }

  contentsWithKeywords(): Promise<ContentCallbackWithKeywords[]> {
    let contents = this.buttonCallbacks
      .filter(cb => cb instanceof ContentCallback)
      .map(cb => {
        let button = DummyCMS.buttonFromCallback(cb);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new ContentCallbackWithKeywords(
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
