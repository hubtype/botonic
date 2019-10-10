import { SearchResult } from '../search/search-result';
import { Callback } from './callback';
import { CMS, ModelType } from './cms';
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
  Content,
  StartUp,
  CommonFields
} from './contents';
import * as time from '../time';
import { Context, DEFAULT_CONTEXT } from './context';

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

  async carousel(id: string, {} = DEFAULT_CONTEXT): Promise<Carousel> {
    const elements = this.buttonCallbacks.map(callback =>
      this.element(Math.random().toString(), callback)
    );
    return Promise.resolve(new Carousel(new CommonFields(id), elements));
  }

  async text(id: string, {} = DEFAULT_CONTEXT): Promise<Text> {
    return Promise.resolve(
      new Text(
        new CommonFields(id, { keywords: ['kw1', 'kw2'], shortText: id }),
        'Dummy text for ' + id,
        this.buttons()
      )
    );
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<Chitchat> {
    return this.text(id, context);
  }

  async startUp(id: string, {} = DEFAULT_CONTEXT): Promise<StartUp> {
    return Promise.resolve(
      new StartUp(
        new CommonFields(id),
        DummyCMS.IMG,
        'Dummy text for ' + id,
        this.buttons()
      )
    );
  }

  static buttonFromCallback(callback: Callback): Button {
    const id = callback.payload || callback.url!;
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

  url(id: string, {} = DEFAULT_CONTEXT): Promise<Url> {
    return Promise.resolve(
      new Url(
        new CommonFields(id, { shortText: 'button text for' + id }),
        `http://url.${id}`
      )
    );
  }

  image(id: string, {} = DEFAULT_CONTEXT): Promise<Image> {
    return Promise.resolve(new Image(id, DummyCMS.IMG));
  }

  queue(id: string, {} = DEFAULT_CONTEXT): Promise<Queue> {
    return Promise.resolve(new Queue(new CommonFields(id), id));
  }

  contents(
    model: ModelType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean
  ): Promise<Content[]> {
    return Promise.resolve([]);
  }

  contentsWithKeywords({} = DEFAULT_CONTEXT): Promise<SearchResult[]> {
    const contents = this.buttonCallbacks.map(cb => {
      const button = DummyCMS.buttonFromCallback(cb);
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

  asset(id: string): Promise<Asset> {
    return Promise.resolve(new Asset(`name for ${id}`, `http://url.${id}`));
  }

  dateRange(id: string): Promise<time.DateRange> {
    const now = new Date();
    return Promise.resolve(new time.DateRange('daterange name', now, now));
  }

  private buttons(): Button[] {
    return this.buttonCallbacks.map(DummyCMS.buttonFromCallback);
  }
}
