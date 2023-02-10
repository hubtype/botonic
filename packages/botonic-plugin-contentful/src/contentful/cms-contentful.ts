import * as contentful from 'contentful'

import * as cms from '../cms'
import {
  Asset,
  CommonFields,
  Content,
  ContentType,
  Context,
  DateRangeContent,
  DEFAULT_CONTEXT,
  PagingOptions,
  ScheduleContent,
  TopContent,
  TopContentType,
} from '../cms'
import { ContentfulOptions, DEFAULT_FALLBACK_CACHE_LIMIT_KB } from '../plugin'
import { SearchCandidate } from '../search'
import { AssetDelivery } from './contents/asset'
import { ButtonDelivery } from './contents/button'
import { CarouselDelivery } from './contents/carousel'
import { ContentsDelivery } from './contents/contents'
import { CustomDelivery } from './contents/custom'
import { DateRangeDelivery } from './contents/date-range'
import { DocumentDelivery } from './contents/document'
import { HandoffDelivery } from './contents/handoff'
import { ImageDelivery } from './contents/image'
import { InputDelivery } from './contents/input'
import { PayloadDelivery } from './contents/payload'
import { QueueDelivery } from './contents/queue'
import { ReferenceDelivery } from './contents/reference'
import { ScheduleDelivery } from './contents/schedule'
import { StartUpDelivery } from './contents/startup'
import { TextDelivery } from './contents/text'
import { UrlDelivery } from './contents/url'
import { VideoDelivery } from './contents/video'
import { CachedClientApi } from './delivery/cache'
import { ClientApiErrorReporter, ReducedClientApi } from './delivery/client-api'
import { FallbackCachedClientApi } from './delivery/fallback-cache'
import { AdaptorDeliveryApi, DeliveryApi } from './delivery-api'
import {
  ContentfulEntryUtils,
  createContentfulClientApi,
} from './delivery-utils'
import { IgnoreFallbackDecorator } from './ignore-fallback-decorator'
import { KeywordsDelivery } from './search/keywords'

export class Contentful implements cms.CMS {
  private readonly _delivery: DeliveryApi
  private readonly _contents: ContentsDelivery
  private readonly _carousel: CarouselDelivery
  private readonly _document: DocumentDelivery
  private readonly _text: TextDelivery
  private readonly _startUp: StartUpDelivery
  private readonly _url: UrlDelivery
  private readonly _payload: PayloadDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _schedule: ScheduleDelivery
  private readonly _dateRange: DateRangeDelivery
  private readonly _image: ImageDelivery
  private readonly _video: VideoDelivery
  private readonly _handoff: HandoffDelivery
  private readonly _input: InputDelivery
  private readonly _custom: CustomDelivery
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
    const logger = options.logger ?? console.error
    const reporter: ClientApiErrorReporter = (
      msg: string,
      func: string,
      args,
      error: any
    ) => {
      logger(`${msg}. '${func}(${String(args)})' threw '${String(error)}'`)
      return Promise.resolve()
    }
    let client: ReducedClientApi = createContentfulClientApi(options)
    if (!options.disableFallbackCache) {
      client = new FallbackCachedClientApi(
        client,
        options.fallbackCacheLimitKB ?? DEFAULT_FALLBACK_CACHE_LIMIT_KB,
        reporter,
        logger
      )
    }
    if (!options.disableCache) {
      client = new CachedClientApi(client, options.cacheTtlMs, reporter)
    }
    const deliveryApi = new AdaptorDeliveryApi(client, options)
    const resumeErrors = options.resumeErrors || false
    const delivery = new IgnoreFallbackDecorator(deliveryApi)
    this._contents = new ContentsDelivery(delivery, resumeErrors)

    this._delivery = delivery
    this._button = new ButtonDelivery(delivery, resumeErrors)
    this._carousel = new CarouselDelivery(delivery, this._button, resumeErrors)
    this._document = new DocumentDelivery(delivery, resumeErrors)
    this._text = new TextDelivery(delivery, this._button, resumeErrors)
    this._startUp = new StartUpDelivery(delivery, this._button, resumeErrors)
    this._url = new UrlDelivery(delivery, resumeErrors)
    this._payload = new PayloadDelivery(delivery, resumeErrors)
    this._image = new ImageDelivery(delivery, resumeErrors)
    this._video = new VideoDelivery(delivery, resumeErrors)
    this._asset = new AssetDelivery(delivery, resumeErrors)
    this._schedule = new ScheduleDelivery(delivery, resumeErrors)
    this._queue = new QueueDelivery(delivery, this._schedule, resumeErrors)
    this._handoff = new HandoffDelivery(
      delivery,
      this._queue,
      this._text,
      resumeErrors
    )
    this._input = new InputDelivery(delivery, resumeErrors)
    this._custom = new CustomDelivery(delivery, resumeErrors)
    this._dateRange = new DateRangeDelivery(delivery, resumeErrors)
    const followUp = new ReferenceDelivery(
      this._delivery,
      this._carousel,
      this._text,
      this._image,
      this._startUp,
      this._video,
      this._document,
      this._url,
      this._handoff,
      this._queue,
      this._schedule,
      this._input,
      this._payload,
      this._dateRange
    )
    ;[
      this._carousel,
      this._text,
      this._image,
      this._startUp,
      this._video,
      this._document,
      this._url,
      this._handoff,
      this._queue,
      this._schedule,
      this._input,
      this._payload,
      this._dateRange,
    ].forEach(d => d.setReference(followUp))
    this._keywords = new KeywordsDelivery(delivery)
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

  document(id: string, context = DEFAULT_CONTEXT): Promise<cms.Document> {
    return this._document.document(id, context)
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

  async payload(id: string, context = DEFAULT_CONTEXT): Promise<cms.Payload> {
    return this._payload.payload(id, context)
  }

  async queue(id: string, context = DEFAULT_CONTEXT): Promise<cms.Queue> {
    return this._queue.queue(id, context)
  }

  image(id: string, context = DEFAULT_CONTEXT): Promise<cms.Image> {
    return this._image.image(id, context)
  }

  video(id: string, context = DEFAULT_CONTEXT): Promise<cms.Video> {
    return this._video.video(id, context)
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<cms.Chitchat> {
    return this._text.text(id, context)
  }

  async handoff(id: string, context = DEFAULT_CONTEXT): Promise<cms.Handoff> {
    return this._handoff.handoff(id, context)
  }

  async input(id: string, context = DEFAULT_CONTEXT): Promise<cms.Input> {
    return this._input.input(id, context)
  }

  async custom(id: string, context = DEFAULT_CONTEXT): Promise<cms.Custom> {
    return this._custom.custom(id, context)
  }

  topContents<T extends TopContent>(
    model: TopContentType,
    context = DEFAULT_CONTEXT,
    filter?: (cf: CommonFields) => boolean,
    paging = new PagingOptions()
  ): Promise<T[]> {
    return this._contents.topContents(
      model,
      context,
      (entry, ctxt) => this.topContentFromEntry(entry, ctxt),
      filter,
      paging
    )
  }

  async content(id: string, context = DEFAULT_CONTEXT): Promise<Content> {
    const REFERENCES_TO_INCLUDE = 6
    const entry = await this._delivery.getEntry(id, context, {
      include: REFERENCES_TO_INCLUDE,
    })
    return this.contentFromEntry(entry, context)
  }

  contents<T extends Content>(
    contentType: ContentType,
    context = DEFAULT_CONTEXT,
    paging = new PagingOptions()
  ): Promise<T[]> {
    return this._contents.contents(
      contentType,
      context,
      (entry, ctxt) => this.contentFromEntry(entry, ctxt),
      paging
    )
  }

  async topContentFromEntry<T extends TopContent>(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<T> {
    const model = ContentfulEntryUtils.getContentModel(entry)
    const retype = (c: TopContent) => c as T
    switch (model) {
      case ContentType.CAROUSEL:
        return retype(await this._carousel.fromEntry(entry, context))
      case ContentType.DOCUMENT:
        return retype(await this._document.fromEntry(entry, context))
      case ContentType.QUEUE:
        return retype(await this._queue.fromEntry(entry, context))
      case ContentType.CHITCHAT:
      case ContentType.TEXT:
        return retype(await this._text.fromEntry(entry, context))
      case ContentType.IMAGE:
        return retype(await this._image.fromEntry(entry, context))
      case ContentType.VIDEO:
        return retype(await this._video.fromEntry(entry, context))
      case ContentType.HANDOFF:
        return retype(await this._handoff.fromEntry(entry, context))
      case ContentType.INPUT:
        return retype(await this._input.fromEntry(entry, context))
      case ContentType.URL:
        return retype(await this._url.fromEntry(entry, context))
      case ContentType.PAYLOAD:
        return retype(await this._payload.fromEntry(entry, context))
      case ContentType.STARTUP:
        return retype(await this._startUp.fromEntry(entry, context))
      case ContentType.SCHEDULE:
        return retype(await this._schedule.fromEntry(entry, context))
      case ContentType.DATE_RANGE:
        return retype(await this._dateRange.fromEntry(entry, context))
      default:
        throw new Error(`${model} is not a Content type`)
    }
    // no need to wrap in an CMSException with the content id because asyncMap
    // already does it
  }

  // TODO move all delivery instances to a class
  async contentFromEntry<T extends Content>(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<T> {
    const model = ContentfulEntryUtils.getContentModel(entry)
    const retype = (c: Content) => c as T
    switch (model) {
      case ContentType.BUTTON:
        return retype(this._button.fromEntry(entry, context))
      case ContentType.ELEMENT:
        return retype(await this._carousel.elementFromEntry(entry, context))
      default:
        return retype(await this.topContentFromEntry(entry, context))
    }
  }

  async contentsWithKeywords(
    context = DEFAULT_CONTEXT,
    paging = new PagingOptions()
  ): Promise<SearchCandidate[]> {
    return this._keywords.contentsWithKeywords(context, paging)
  }

  async schedule(id: string, context: Context): Promise<ScheduleContent> {
    return this._schedule.schedule(id, context)
  }

  asset(id: string, context = DEFAULT_CONTEXT): Promise<cms.Asset> {
    return this._asset.asset(id, context)
  }

  assets(context = DEFAULT_CONTEXT): Promise<Asset[]> {
    return this._asset.assets(context)
  }

  dateRange(id: string, context: Context): Promise<DateRangeContent> {
    return this._dateRange.dateRange(id, context)
  }
}
