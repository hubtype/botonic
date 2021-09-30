import { ContentfulOptions } from '../plugin'
import { SearchCandidate } from '../search'
import {
  CMS,
  ContentType,
  CustomContentType,
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
  Payload,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  Url,
} from './contents'
import { Context } from './context'

export class LogCMS implements CMS {
  constructor(
    readonly cms: CMS,
    options: ContentfulOptions,
    private readonly logger: (doing: string) => void = console.log
  ) {
    this.logger('Creating Contentful with options: ' + JSON.stringify(options))
  }

  carousel(id: string, context?: Context): Promise<Carousel> {
    this.logContentDelivery(ContentType.CAROUSEL, id, context)
    return this.cms.carousel(id, context)
  }

  document(id: string, context?: Context): Promise<Document> {
    this.logContentDelivery(ContentType.DOCUMENT, id, context)
    return this.cms.document(id, context)
  }

  text(id: string, context?: Context): Promise<Text> {
    this.logContentDelivery(ContentType.TEXT, id, context)
    return this.cms.text(id, context)
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    this.logContentDelivery(ContentType.CHITCHAT, id, context)
    return this.cms.text(id, context)
  }

  startUp(id: string, context?: Context): Promise<StartUp> {
    this.logContentDelivery(ContentType.STARTUP, id, context)
    return this.cms.startUp(id, context)
  }

  url(id: string, context?: Context): Promise<Url> {
    this.logContentDelivery(ContentType.URL, id, context)
    return this.cms.url(id, context)
  }

  payload(id: string, context?: Context): Promise<Payload> {
    this.logContentDelivery(ContentType.PAYLOAD, id, context)
    return this.cms.payload(id, context)
  }

  image(id: string, context?: Context): Promise<Image> {
    this.logContentDelivery(ContentType.IMAGE, id, context)
    return this.cms.image(id, context)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    this.logContentDelivery(ContentType.QUEUE, id, context)
    return this.cms.queue(id, context)
  }

  button(id: string, context?: Context): Promise<Button> {
    this.logContentDelivery(ContentType.BUTTON, id, context)
    return this.cms.button(id, context)
  }

  element(id: string, context?: Context): Promise<Element> {
    this.logContentDelivery(ContentType.ELEMENT, id, context)
    return this.cms.element(id, context)
  }

  handoff(id: string, context?: Context): Promise<Handoff> {
    this.logContentDelivery(ContentType.HANDOFF, id, context)
    return this.cms.handoff(id, context)
  }

  custom(id: string, context?: Context): Promise<Custom> {
    this.logContentDelivery(CustomContentType.CUSTOM, id, context)
    return this.cms.custom(id, context)
  }

  content(id: string, context?: Context): Promise<Content> {
    this.logContentDelivery('content' as ContentType, id, context)
    return this.cms.content(id, context)
  }

  contentsWithKeywords(
    context?: Context,
    paging?: PagingOptions
  ): Promise<SearchCandidate[]> {
    this.logger('contentsWithKeywords')
    return this.cms.contentsWithKeywords(context, paging)
  }

  topContents<T extends TopContent>(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<T[]> {
    this.logger(`topContents of model ${model}`)
    return this.cms.topContents(model, context, filter, paging)
  }

  contents<T extends Content>(
    contentType: ContentType,
    context?: Context,
    paging?: PagingOptions
  ): Promise<T[]> {
    this.logger(`contents of model ${contentType}`)
    return this.cms.contents(contentType, context, paging)
  }

  assets(context?: Context): Promise<Asset[]> {
    this.logger(`assets`)
    return this.cms.assets(context)
  }

  schedule(id: string, context?: Context): Promise<ScheduleContent> {
    this.logContentDelivery(ContentType.SCHEDULE, id, context)
    return this.cms.schedule(id, context)
  }

  dateRange(id: string, context?: Context): Promise<DateRangeContent> {
    this.logContentDelivery(ContentType.DATE_RANGE, id, context)
    return this.cms.dateRange(id, context)
  }

  asset(id: string, context?: Context): Promise<Asset> {
    this.logger(`Delivery asset with id ${id}`)
    return this.cms.asset(id, context)
  }

  private logContentDelivery(
    contentType: ContentType,
    id: string,
    context?: Context
  ): void {
    this.logger(
      `Delivery ${contentType} model with id '${id}' and locale '${String(
        context?.locale
      )}'`
    )
  }
}
