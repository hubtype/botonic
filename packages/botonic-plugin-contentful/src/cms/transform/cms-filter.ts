import { SearchCandidate } from '../../search'
import {
  Asset,
  Button,
  Carousel,
  Chitchat,
  CMS,
  CmsException,
  CommonFields,
  Content,
  ContentType,
  Context,
  Custom,
  DateRangeContent,
  Document,
  Element,
  Handoff,
  Image,
  MessageContent,
  PagingOptions,
  Payload,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  TopContentType,
  Url,
  Video,
} from '../index'
import { RecursiveMessageContentFilter } from './message-content-filters'

/**
 * Decorator which applies a recursive transformation to MessageContent before being delivered by CMS
 */
export class FilteredCMS implements CMS {
  constructor(
    readonly cms: CMS,
    readonly filter: RecursiveMessageContentFilter
  ) {}

  private async filterContent<T extends MessageContent>(
    content: T,
    clazz: any,
    context?: Context
  ): Promise<T> {
    const converted = await this.filter.filterContent(content, context)
    if (clazz && !(converted instanceof clazz)) {
      throw new CmsException(
        "FilteredCMS requires that filters don't change the type of the MessageContent"
      )
    }
    return converted as T
  }

  private filterContents<T extends Content>(
    contents: T[],
    context?: Context
  ): Promise<T[]> {
    return Promise.all(
      contents.map(c => {
        if (c instanceof MessageContent) {
          return this.filterContent(c, undefined, context)
        }
        return c
      })
    )
  }
  async carousel(id: string, context?: Context): Promise<Carousel> {
    const content = await this.cms.carousel(id, context)
    return this.filterContent(content, Carousel, context)
  }

  async document(id: string, context?: Context): Promise<Document> {
    const content = await this.cms.document(id, context)
    return this.filterContent(content, Document, context)
  }

  async text(id: string, context?: Context): Promise<Text> {
    const content = await this.cms.text(id, context)
    return this.filterContent(content, Text, context)
  }

  async chitchat(id: string, context?: Context): Promise<Chitchat> {
    const content = await this.cms.text(id, context)
    return this.filterContent(content, Chitchat, context)
  }

  async startUp(id: string, context?: Context): Promise<StartUp> {
    const content = await this.cms.startUp(id, context)
    return this.filterContent(content, StartUp, context)
  }

  async image(id: string, context?: Context): Promise<Image> {
    const content = await this.cms.image(id, context)
    return this.filterContent(content, Image, context)
  }

  async video(id: string, context?: Context): Promise<Video> {
    const content = await this.cms.video(id, context)
    return this.filterContent(content, Video, context)
  }

  handoff(id: string, context?: Context): Promise<Handoff> {
    return this.cms.handoff(id, context)
  }

  custom(id: string, context?: Context): Promise<Custom> {
    return this.cms.custom(id, context)
  }

  url(id: string, context?: Context): Promise<Url> {
    return this.cms.url(id, context)
  }

  payload(id: string, context?: Context): Promise<Payload> {
    return this.cms.payload(id, context)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    return this.cms.queue(id, context)
  }

  button(id: string, context?: Context): Promise<Button> {
    // TODO convert
    return this.cms.button(id, context)
  }

  element(id: string, context?: Context): Promise<Element> {
    // TODO convert
    return this.cms.element(id, context)
  }

  content(id: string, context?: Context): Promise<Content> {
    return this.cms.content(id, context)
  }

  contentsWithKeywords(
    context?: Context,
    paging?: PagingOptions
  ): Promise<SearchCandidate[]> {
    return this.cms.contentsWithKeywords(context, paging)
  }

  async topContents<T extends TopContent>(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<T[]> {
    const contents = await this.cms.topContents<T>(
      model,
      context,
      filter,
      paging
    )
    return this.filterContents(contents, context)
  }

  async contents<T extends Content>(
    contentType: ContentType,
    context?: Context | undefined,
    paging?: PagingOptions
  ): Promise<T[]> {
    const contents = await this.cms.contents<T>(contentType, context, paging)
    return this.filterContents(contents, context)
  }

  assets(context?: Context): Promise<Asset[]> {
    return this.cms.assets(context)
  }

  schedule(id: string, context?: Context): Promise<ScheduleContent> {
    return this.cms.schedule(id, context)
  }

  dateRange(id: string, context?: Context): Promise<DateRangeContent> {
    return this.cms.dateRange(id, context)
  }

  asset(id: string, context?: Context): Promise<Asset> {
    return this.cms.asset(id, context)
  }
}
