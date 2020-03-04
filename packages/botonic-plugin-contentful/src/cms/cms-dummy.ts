import { SearchResult } from '../search/search-result'
import { Callback } from './callback'
import { CMS, ContentType, TopContentType } from './cms'
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
  StartUp,
  CommonFields,
  ScheduleContent,
  DateRangeContent,
  TopContent,
  Content,
} from './contents'
import * as time from '../time'
import { Context, DEFAULT_CONTEXT } from './context'

/**
 * Useful for mocking CMS, as ts-mockito does not allow mocking interfaces
 */
export class DummyCMS implements CMS {
  static IMG = '../assets/img_home_bg.png'
  /**
   *
   * @param buttonCallbacks models which contain buttons will return one per each specified callback
   */
  constructor(readonly buttonCallbacks: Callback[]) {}

  async carousel(id: string, {} = DEFAULT_CONTEXT): Promise<Carousel> {
    const elements = this.buttonCallbacks.map(callback =>
      this.element(Math.random().toString(), callback)
    )
    return Promise.resolve(new Carousel(new CommonFields(id, id), elements))
  }

  async text(id: string, {} = DEFAULT_CONTEXT): Promise<Text> {
    return Promise.resolve(
      new Text(
        new CommonFields(id, id, { keywords: ['kw1', 'kw2'], shortText: id }),
        'Dummy text for ' + id,
        this.buttons()
      )
    )
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<Chitchat> {
    return this.text(id, context)
  }

  async startUp(id: string, {} = DEFAULT_CONTEXT): Promise<StartUp> {
    return Promise.resolve(
      new StartUp(
        new CommonFields(id, id),
        DummyCMS.IMG,
        'Dummy text for ' + id,
        this.buttons()
      )
    )
  }

  static buttonFromCallback(callback: Callback): Button {
    const id = callback.payload || callback.url!
    return new Button(id, id, 'button text for ' + id, callback)
  }

  private element(id: string, callback: Callback): Element {
    return new Element(
      id,
      [DummyCMS.buttonFromCallback(callback)],
      'Title for ' + id,
      'subtitle',
      DummyCMS.IMG
    )
  }

  url(id: string, {} = DEFAULT_CONTEXT): Promise<Url> {
    return Promise.resolve(
      new Url(
        new CommonFields(id, id, { shortText: 'button text for' + id }),
        `http://url.${id}`
      )
    )
  }

  image(id: string, {} = DEFAULT_CONTEXT): Promise<Image> {
    return Promise.resolve(new Image(new CommonFields(id, id), DummyCMS.IMG))
  }

  queue(id: string, {} = DEFAULT_CONTEXT): Promise<Queue> {
    return Promise.resolve(new Queue(new CommonFields(id, id), id))
  }

  topContents(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    return Promise.resolve([])
  }

  contentsWithKeywords({} = DEFAULT_CONTEXT): Promise<SearchResult[]> {
    const contents = this.buttonCallbacks.map((cb, id) => {
      const button = DummyCMS.buttonFromCallback(cb)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new SearchResult(
        cb.asContentId(),
        new CommonFields(String(id), button.name, {
          shortText: button.text,
          keywords: [
            'keyword for ' + (button.callback.payload || button.callback.url!),
          ],
        })
      )
    })
    return Promise.resolve(contents)
  }

  schedule(id: string): Promise<ScheduleContent> {
    const schedule = new time.Schedule('Europe/Madrid')
    return Promise.resolve(
      new ScheduleContent(new CommonFields(id, 'name'), schedule)
    )
  }

  asset(id: string): Promise<Asset> {
    return Promise.resolve(new Asset(`name for ${id}`, `http://url.${id}`))
  }

  dateRange(id: string): Promise<DateRangeContent> {
    const now = new Date()
    const dateRange = new time.DateRange('daterange name', now, now)
    return Promise.resolve(
      new DateRangeContent(new CommonFields(id, dateRange.name), dateRange)
    )
  }

  private buttons(): Button[] {
    return this.buttonCallbacks.map(DummyCMS.buttonFromCallback)
  }

  contents(contentType: ContentType, context?: Context): Promise<Content[]> {
    return Promise.resolve([])
  }
}
