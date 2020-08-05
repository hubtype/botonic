import * as cms from '../cms'
import {
  CommonFields,
  Content,
  ContentType,
  Context,
  DateRangeContent,
  DEFAULT_CONTEXT,
  ScheduleContent,
  TopContent,
  TopContentType,
} from '../cms'
import {
  AdaptorDeliveryApi,
  ContentfulEntryUtils,
  createContentfulClientApi,
  DeliveryApi,
} from './delivery-api'
import { CarouselDelivery } from './contents/carousel'
import { TextDelivery } from './contents/text'
import { StartUpDelivery } from './contents/startup'
import { UrlDelivery } from './contents/url'
import { KeywordsDelivery } from './search/keywords'
import { ScheduleDelivery } from './contents/schedule'
import { DateRangeDelivery } from './contents/date-range'
import { ImageDelivery } from './contents/image'
import { AssetDelivery } from './contents/asset'
import { QueueDelivery } from './contents/queue'
import { ButtonDelivery } from './contents/button'
import { ContentfulOptions } from '../plugin'
import { CachedClientApi } from './delivery/cache'
import { IgnoreFallbackDecorator } from './ignore-fallback-decorator'
import { FollowUpDelivery } from './contents/follow-up'
import * as contentful from 'contentful'
import { SearchCandidate } from '../search'
import { ContentsDelivery } from './contents/contents'

export class Contentful implements cms.CMS {
  private readonly _delivery: DeliveryApi
  private readonly _contents: ContentsDelivery
  private readonly _carousel: CarouselDelivery
  private readonly _text: TextDelivery
  private readonly _startUp: StartUpDelivery
  private readonly _url: UrlDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _schedule: ScheduleDelivery
  private readonly _dateRange: DateRangeDelivery
  private readonly _image: ImageDelivery
  private readonly _asset: AssetDelivery
  private readonly _queue: QueueDelivery
  private readonly _button: ButtonDelivery

  /**
   *
   * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
   * for API rate limits
   *
   *  https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
   */
  constructor(options: ContentfulOptions) {
    const client = createContentfulClientApi(options)
    const deliveryApi = new AdaptorDeliveryApi(
      options.disableCache
        ? client
        : new CachedClientApi(client, options.cacheTtlMs),
      options
    )
    const delivery = new IgnoreFallbackDecorator(deliveryApi)
    this._contents = new ContentsDelivery(delivery)

    this._delivery = delivery
    this._button = new ButtonDelivery(delivery, options.resumeErrors || false)
    this._carousel = new CarouselDelivery(delivery, this._button)
    this._text = new TextDelivery(delivery, this._button)
    this._startUp = new StartUpDelivery(delivery, this._button)
    this._url = new UrlDelivery(delivery)
    this._image = new ImageDelivery(delivery)
    this._asset = new AssetDelivery(delivery)
    this._queue = new QueueDelivery(delivery)
    const followUp = new FollowUpDelivery(
      this._delivery,
      this._carousel,
      this._text,
      this._image,
      this._startUp
    )
    ;[
      this._text,
      this._url,
      this._carousel,
      this._image,
      this._startUp,
    ].forEach(d => d.setFollowUp(followUp))
    this._keywords = new KeywordsDelivery(delivery)
    this._schedule = new ScheduleDelivery(delivery)
    this._dateRange = new DateRangeDelivery(delivery)
  }

  button(id: string, context: Context = DEFAULT_CONTEXT): Promise<cms.Button> {
    return this._button.button(id, context)
  }

  element(
    id: string,
    context: Context = DEFAULT_CONTEXT
  ): Promise<cms.Element> {
    return this._carousel.element(id, context)
  }

  async carousel(id: string, context = DEFAULT_CONTEXT): Promise<cms.Carousel> {
    return this._carousel.carousel(id, context)
  }

  async text(id: string, context = DEFAULT_CONTEXT): Promise<cms.Text> {
    return this._text.text(id, context)
  }

  async startUp(id: string, context = DEFAULT_CONTEXT): Promise<cms.StartUp> {
    return this._startUp.startUp(id, context)
  }

  async url(id: string, context = DEFAULT_CONTEXT): Promise<cms.Url> {
    return this._url.url(id, context)
  }

  async queue(id: string, context = DEFAULT_CONTEXT): Promise<cms.Queue> {
    return this._queue.queue(id, context)
  }

  image(id: string, context = DEFAULT_CONTEXT): Promise<cms.Image> {
    return this._image.image(id, context)
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<cms.Chitchat> {
    return this._text.text(id, context)
  }

  topContents(
    model: TopContentType,
    context = DEFAULT_CONTEXT,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    return this._contents.topContents(
      model,
      context,
      (entry: contentful.Entry<any>, ctxt: Context) =>
        this.topContentFromEntry(entry, ctxt),
      filter
    )
  }

  contents(
    contentType: ContentType,
    context = DEFAULT_CONTEXT
  ): Promise<Content[]> {
    return this._contents.contents(
      contentType,
      context,
      (entry: contentful.Entry<any>, ctxt: Context) =>
        this.contentFromEntry(entry, ctxt)
    )
  }

  async topContentFromEntry(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<TopContent> {
    const model = ContentfulEntryUtils.getContentModel(entry)
    try {
      switch (model) {
        case ContentType.CAROUSEL:
          return await this._carousel.fromEntry(entry, context)
        case ContentType.QUEUE:
          return QueueDelivery.fromEntry(entry)
        case ContentType.CHITCHAT:
        case ContentType.TEXT:
          return await this._text.fromEntry(entry, context)
        case ContentType.IMAGE:
          return await this._image.fromEntry(entry, context)
        case ContentType.URL:
          return await this._url.fromEntry(entry, context)
        case ContentType.STARTUP:
          return await this._startUp.fromEntry(entry, context)
        case ContentType.SCHEDULE:
          return ScheduleDelivery.fromEntry(entry)
        case ContentType.DATE_RANGE:
          return DateRangeDelivery.fromEntry(entry)
        default:
          throw new Error(`${model} is not a Content type`)
      }
    } catch (e) {
      console.error(`Error creating ${model} with id: ${entry.sys.id}`)
      throw e
    }
  }

  // TODO move all delivery instances to a class
  async contentFromEntry(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<Content> {
    const model = ContentfulEntryUtils.getContentModel(entry)
    switch (model) {
      case ContentType.BUTTON:
        return this._button.fromEntry(entry, context)
      case ContentType.ELEMENT:
        return this._carousel.elementFromEntry(entry, context)
      default:
        return this.topContentFromEntry(entry, context)
    }
  }

  async contentsWithKeywords(
    context = DEFAULT_CONTEXT
  ): Promise<SearchCandidate[]> {
    return this._keywords.contentsWithKeywords(context)
  }

  async schedule(id: string): Promise<ScheduleContent> {
    return this._schedule.schedule(id)
  }

  asset(id: string): Promise<cms.Asset> {
    return this._asset.asset(id)
  }

  dateRange(id: string): Promise<DateRangeContent> {
    return this._dateRange.dateRange(id)
  }
}
