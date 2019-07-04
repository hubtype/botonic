import { SearchResult } from '../search/search-result';
import { Callback } from './callback';
import { CMS, Context, ModelType } from './cms';
import {
  Asset,
  Button,
  Carousel,
  Chitchat,
  Element,
  Image,
  Text,
  Url,
  Queue,
  Content
} from './contents';
import * as time from '../time';

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

  async carousel(id: string, {  }: Context = new Context()): Promise<Carousel> {
    let elements = this.buttonCallbacks.map(callback =>
      this.element(Math.random().toString(), callback)
    );
    return Promise.resolve(new Carousel(id, elements));
  }

  async text(id: string, {  }: Context = new Context()): Promise<Text> {
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

  queue(id: string): Promise<Queue> {
    return Promise.resolve(new Queue(id, id));
  }

  contentsWithKeywords(): Promise<SearchResult[]> {
    let contents = this.buttonCallbacks.map(cb => {
      let button = DummyCMS.buttonFromCallback(cb);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new SearchResult(cb, button.name, button.text, [
        'keyword for ' + (button.callback.payload || button.callback.url!)
      ]);
    });
    return Promise.resolve(contents);
  }

  schedule(id: string): Promise<time.Schedule> {
    return Promise.resolve(new time.Schedule('Europe/Madrid'));
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    return this.text(id, context);
  }

  asset(id: string): Promise<Asset> {
    return Promise.resolve(new Asset(`name for ${id}`, `http://url.${id}`));
  }

  contents(model: ModelType): Promise<Content[]> {
    return Promise.resolve([]);
  }

  dateRange(id: string): Promise<time.DateRange> {
    let now = new Date();
    return Promise.resolve(new time.DateRange('daterange name', now, now));
  }
}
