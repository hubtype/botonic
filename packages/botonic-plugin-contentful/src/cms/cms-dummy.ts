import { Callback, CallbackMap } from './callback';
import { CMS } from './cms';
import {
  Button,
  Carousel,
  CallbackToContentWithKeywords,
  Chitchat,
  Element,
  Image,
  Text,
  Url
} from './contents';
import * as time from '../time/schedule';

/**
 * Useful for mocking CMS, as ts-mockito does not allow mocking interfaces
 */
export class DummyCMS implements CMS {
  static IMG = '../assets/img_home_bg.png';
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

  public static buttonFromCallback(callback: Callback): Button {
    let id = callback.payload || callback.url!;
    return new Button(id, 'button text for ' + id, callback);
  }

  private element(id: string, callback: Callback): Element {
    return new Element(
      [DummyCMS.buttonFromCallback(callback)],
      'Title for ' + id,
      'subtitle',
      DummyCMS.IMG
    );
  }

  url(id: string): Promise<Url> {
    return Promise.resolve(
      new Url(id, `http://url.${id}`, 'button text for' + id)
    );
  }

  image(id: string): Promise<Image> {
    return Promise.resolve(new Image(id, DummyCMS.IMG));
  }

  contentsWithKeywords(): Promise<CallbackToContentWithKeywords[]> {
    let contents = this.buttonCallbacks.map(cb => {
      let button = DummyCMS.buttonFromCallback(cb);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new CallbackToContentWithKeywords(cb, {
        name: button.name,
        shortText: button.text,
        keywords: [
          'keyword for ' + (button.callback.payload || button.callback.url!)
        ]
      });
    });
    return Promise.resolve(contents);
  }

  schedule(id: string): Promise<time.Schedule> {
    return Promise.resolve(new time.Schedule('Europe/Madrid'));
  }

  chitchat(id: string, callbacks?: CallbackMap): Promise<Chitchat> {
    return this.text(id, callbacks);
  }
}
