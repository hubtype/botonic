import { SearchCandidate } from '../search/search-result'
import * as time from '../time'
import { Callback, ContentCallback } from './callback'
import {
  CMS,
  ContentType,
  DEFAULT_REFERENCES_TO_INCLUDE,
  PagingOptions,
  TopContentType,
} from './cms'
import {
  Asset,
  Button,
  Carousel,
  Chitchat,
  CommonFields,
  Content,
  Custom,
  DateRangeContent,
  Document,
  Element,
  Handoff,
  Image,
  Input,
  Payload,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  Url,
  Video,
} from './contents'
import { Context, DEFAULT_CONTEXT } from './context'

/**
 * Useful for mocking CMS, as ts-mockito does not allow mocking interfaces
 */
export class DummyCMS implements CMS {
  static readonly IMG = 'this_image_does_not_exist.png'
  static readonly VIDEO = 'this_video_does_not_exist.mp4'
  static PDF = 'this_doc_does_not_exist.pdf'
  /**
   *
   * @param buttonCallbacks models which contain buttons will return one per each specified callback
   */
  constructor(readonly buttonCallbacks: ContentCallback[]) {}

  button(_id: string, _context?: Context | undefined): Promise<Button> {
    throw new Error('Method not implemented.')
  }

  element(_id: string, _context?: Context | undefined): Promise<Element> {
    throw new Error('Method not implemented.')
  }

  async carousel(id: string, {} = DEFAULT_CONTEXT): Promise<Carousel> {
    const elements = this.buttonCallbacks.map((callback, i) =>
      this.createElement(String(i), callback)
    )
    return Promise.resolve(new Carousel(new CommonFields(id, id), elements))
  }

  async document(id: string, {} = DEFAULT_CONTEXT): Promise<Document> {
    return Promise.resolve(new Document(new CommonFields(id, id), DummyCMS.PDF))
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

  async handoff(id: string, {} = DEFAULT_CONTEXT): Promise<Handoff> {
    const queue = new Queue(new CommonFields(id, id), id)
    const message = new Text(new CommonFields(id, id), id, [])
    const failMessage = new Text(new CommonFields(id, id), id, [])
    return Promise.resolve(
      new Handoff(
        new CommonFields(id, id),
        this.buttonCallbacks[0],
        message,
        failMessage,
        queue
      )
    )
  }

  async input(id: string, {} = DEFAULT_CONTEXT): Promise<Input> {
    return Promise.resolve(
      new Input(
        new CommonFields(id, id),
        'Dummy message',
        [],
        this.buttonCallbacks[0]
      )
    )
  }

  async custom(id: string, {} = DEFAULT_CONTEXT): Promise<Custom> {
    return Promise.resolve(new Custom(id, id, {}))
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

  private createElement(id: string, callback: Callback): Element {
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

  payload(id: string, {} = DEFAULT_CONTEXT): Promise<Payload> {
    return Promise.resolve(
      new Payload(new CommonFields(id, id), 'Dummy payload for ' + id)
    )
  }

  image(id: string, {} = DEFAULT_CONTEXT): Promise<Image> {
    return Promise.resolve(new Image(new CommonFields(id, id), DummyCMS.IMG))
  }

  video(id: string, {} = DEFAULT_CONTEXT): Promise<Video> {
    return Promise.resolve(new Video(new CommonFields(id, id), DummyCMS.VIDEO))
  }

  queue(id: string, {} = DEFAULT_CONTEXT): Promise<Queue> {
    return Promise.resolve(new Queue(new CommonFields(id, id), id))
  }

  topContents<T extends TopContent>(
    _model: TopContentType,
    _context?: Context,
    _filter?: (cf: CommonFields) => boolean,
    _paging?: PagingOptions
  ): Promise<T[]> {
    return Promise.resolve([])
  }

  contentsWithKeywords(
    {} = DEFAULT_CONTEXT,
    _paging?: PagingOptions
  ): Promise<SearchCandidate[]> {
    const contents = this.buttonCallbacks.map((cb, id) => {
      const button = DummyCMS.buttonFromCallback(cb)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new SearchCandidate(
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

  schedule(id: string, _context?: Context): Promise<ScheduleContent> {
    const schedule = new time.Schedule('Europe/Madrid')
    return Promise.resolve(
      new ScheduleContent(new CommonFields(id, 'name'), schedule)
    )
  }

  asset(id: string, _context?: Context): Promise<Asset> {
    return Promise.resolve(
      new Asset(id, `http://url.${id}`, {
        name: `${id} title`,
        fileName: `${id} fileName`,
        description: `${id} description`,
        type: `${id} type`,
      })
    )
  }

  dateRange(id: string, _context?: Context): Promise<DateRangeContent> {
    const now = new Date()
    const dateRange = new time.DateRange('daterange name', now, now)
    return Promise.resolve(
      new DateRangeContent(new CommonFields(id, dateRange.name), dateRange)
    )
  }

  private buttons(): Button[] {
    return this.buttonCallbacks.map(DummyCMS.buttonFromCallback)
  }

  content(
    id: string,
    context = DEFAULT_CONTEXT,
    _referencesToInclude = DEFAULT_REFERENCES_TO_INCLUDE
  ): Promise<Content> {
    return this.text(id, context)
  }

  contents<T extends Content>(
    _contentType: ContentType,
    _context?: Context,
    _paging?: PagingOptions
  ): Promise<T[]> {
    return Promise.resolve([])
  }

  assets(_context?: Context): Promise<Asset[]> {
    return Promise.resolve([])
  }
}
