import { DEFAULT_CONTEXT, Context } from '../cms/context'
import { SearchResult } from '../search'
import { AssetDelivery } from './asset'
import { DateRangeDelivery } from './date-range'
import { ImageDelivery } from './image'
import { ScheduleDelivery } from './schedule'
import { KeywordsDelivery } from './keywords'
import { FollowUpDelivery } from './follow-up'
import {
  CommonFields,
  Content,
  ContentType,
  DateRangeContent,
  TopContentType,
  ScheduleContent,
  TopContent,
} from '../cms'
import { ButtonDelivery } from './button'
import { DeliveryApi } from './delivery-api'
import { CarouselDelivery } from './carousel'
import { StartUpDelivery } from './startup'
import { TextDelivery } from './text'
import { UrlDelivery } from './url'
import * as cms from '../cms'
import { QueueDelivery } from './queue'
import * as contentful from 'contentful'
import { ContentfulOptions } from '../plugin'
import { CachedDelivery } from './cache'
import { CreateClientParams } from 'contentful'

export default class Contentful implements cms.CMS {
  private readonly _delivery: DeliveryApi
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
    const params: CreateClientParams = {
      space: options.spaceId,
      accessToken: options.accessToken,
      timeout: options.timeoutMs,
    }
    if (options.environment) {
      params.environment = options.environment
    }
    const client = contentful.createClient(params)
    const delivery = new DeliveryApi(
      options.disableCache
        ? client
        : new CachedDelivery(client, options.cacheTtlMs)
    )

    this._delivery = delivery
    this._button = new ButtonDelivery(delivery)
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
    console.log('getting contents for lang', context.locale)
    return this._delivery.topContents(
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
    return this._delivery.contents(
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
    const model = DeliveryApi.getContentModel(entry)
    switch (model) {
      case ContentType.CAROUSEL:
        return this._carousel.fromEntry(entry, context)
      case ContentType.QUEUE:
        return QueueDelivery.fromEntry(entry)
      case ContentType.CHITCHAT:
      case ContentType.TEXT:
        return this._text.fromEntry(entry, context)
      case ContentType.IMAGE:
        return this._image.fromEntry(entry, context)
      case ContentType.URL:
        return this._url.fromEntry(entry, context)
      case ContentType.STARTUP:
        return this._startUp.fromEntry(entry, context)
      default:
        throw new Error(`${model} is not a Content type`)
    }
  }

  async contentFromEntry(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<Content> {
    const model = DeliveryApi.getContentModel(entry)
    switch (model) {
      case ContentType.BUTTON:
        return this._button.fromEntry(entry, context)
      default:
        return this.topContentFromEntry(entry, context)
    }
  }

  async contentsWithKeywords(
    context = DEFAULT_CONTEXT
  ): Promise<SearchResult[]> {
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

export { DeliveryApi } from './delivery-api'
export { CarouselDelivery } from './carousel'
