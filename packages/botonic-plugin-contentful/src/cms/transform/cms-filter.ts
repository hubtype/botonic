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
  DateRangeContent,
  Element,
  Image,
  MessageContent,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  TopContentType,
  Url,
} from '../index'
import { SearchCandidate } from '../../search'
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

  url(id: string, context?: Context): Promise<Url> {
    return this.cms.url(id, context)
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

  contentsWithKeywords(context?: Context): Promise<SearchCandidate[]> {
    return this.cms.contentsWithKeywords(context)
  }

  async topContents(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    const contents = await this.cms.topContents(model, context, filter)
    return this.filterContents(contents, context)
  }

  async contents(
    contentType: ContentType,
    context?: Context | undefined
  ): Promise<Content[]> {
    const contents = await this.cms.contents(contentType, context)
    return this.filterContents(contents, context)
  }

  schedule(id: string): Promise<ScheduleContent> {
    return this.cms.schedule(id)
  }

  dateRange(id: string): Promise<DateRangeContent> {
    return this.cms.dateRange(id)
  }

  asset(id: string): Promise<Asset> {
    return this.cms.asset(id)
  }
}
