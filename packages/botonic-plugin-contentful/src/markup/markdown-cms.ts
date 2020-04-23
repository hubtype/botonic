import {
  Asset,
  Button,
  Carousel,
  CMS,
  CommonFields,
  Content,
  ContentType,
  Context,
  DateRangeContent,
  Element,
  Image,
  MARKUP_WHATSAPP,
  MessageContent,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  TopContentType,
  Url,
} from '../cms'
import { SearchResult } from '../search'
import { RecursiveMessageContentFilter } from '../cms/message-content-filters'

export class MarkdownCMS implements CMS {
  constructor(
    readonly cms: CMS,
    readonly filter: RecursiveMessageContentFilter
  ) {}

  private async filterContent<T extends MessageContent>(
    content: T,
    context?: Context
  ): Promise<T> {
    // TODO move to RecursiveMessageContentFilter
    if (!context || context.markup !== MARKUP_WHATSAPP) {
      return Promise.resolve(content)
    }
    const converted = (await this.filter.filterContent(content)) as T
    return converted
  }

  private filterContents<T extends Content>(
    contents: T[],
    context?: Context
  ): Promise<T[]> {
    return Promise.all(
      contents.map(c => {
        if (c instanceof MessageContent) {
          return this.filterContent(c, context)
        }
        return c
      })
    )
  }
  async carousel(id: string, context?: Context): Promise<Carousel> {
    const content = await this.cms.carousel(id, context)
    return this.filterContent(content, context)
  }

  async text(id: string, context?: Context): Promise<Text> {
    const content = await this.cms.text(id, context)
    return this.filterContent(content, context)
  }

  async chitchat(id: string, context?: Context): Promise<Text> {
    const content = await this.cms.text(id, context)
    return this.filterContent(content, context)
  }

  async startUp(id: string, context?: Context): Promise<StartUp> {
    const content = await this.cms.startUp(id, context)
    return this.filterContent(content, context)
  }

  async image(id: string, context?: Context): Promise<Image> {
    const content = await this.cms.image(id, context)
    return this.filterContent(content, context)
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

  contentsWithKeywords(context?: Context): Promise<SearchResult[]> {
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
