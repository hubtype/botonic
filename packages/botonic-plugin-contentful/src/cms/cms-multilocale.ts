import { SearchCandidate } from '../search'
import { CMS, ContentType, PagingOptions, TopContentType } from './cms'
import {
  Asset,
  Button,
  Carousel,
  Chitchat,
  CommonFields,
  Content,
  DateRangeContent,
  Element,
  Image,
  Queue,
  ScheduleContent,
  StartUp,
  Text,
  TopContent,
  Url,
} from './contents'
import { Context } from './context'

/**
 * CMS decorator which allows delegating each method call to a different
 * CMS instance depending on the context (eg. locale)
 */
export class MultiContextCms implements CMS {
  constructor(private readonly cmsFromContext: (ctx?: Context) => CMS) {}

  asset(id: string, context?: Context): Promise<Asset> {
    return this.cmsFromContext(context).asset(id, context)
  }

  button(id: string, context?: Context): Promise<Button> {
    return this.cmsFromContext(context).button(id, context)
  }

  carousel(id: string, context?: Context): Promise<Carousel> {
    return this.cmsFromContext(context).carousel(id, context)
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    return this.cmsFromContext(context).chitchat(id, context)
  }

  content(id: string, context?: Context): Promise<Content> {
    return this.cmsFromContext(context).content(id, context)
  }

  contents<T extends Content>(
    contentType: ContentType,
    context?: Context,
    paging?: PagingOptions
  ): Promise<T[]> {
    return this.cmsFromContext(context).contents(contentType, context, paging)
  }

  assets(context?: Context): Promise<Asset[]> {
    return this.cmsFromContext(context).assets(context)
  }

  contentsWithKeywords(context?: Context): Promise<SearchCandidate[]> {
    return this.cmsFromContext(context).contentsWithKeywords(context)
  }

  dateRange(id: string, context?: Context): Promise<DateRangeContent> {
    return this.cmsFromContext(context).dateRange(id, context)
  }

  element(id: string, context?: Context): Promise<Element> {
    return this.cmsFromContext(context).element(id, context)
  }

  image(id: string, context?: Context): Promise<Image> {
    return this.cmsFromContext(context).image(id, context)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    return this.cmsFromContext(context).queue(id, context)
  }

  schedule(id: string, context?: Context): Promise<ScheduleContent> {
    return this.cmsFromContext(context).schedule(id, context)
  }

  startUp(id: string, context?: Context): Promise<StartUp> {
    return this.cmsFromContext(context).startUp(id, context)
  }

  text(id: string, context?: Context): Promise<Text> {
    return this.cmsFromContext(context).text(id, context)
  }

  topContents<T extends TopContent>(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<T[]> {
    return this.cmsFromContext(context).topContents(
      model,
      context,
      filter,
      paging
    )
  }

  url(id: string, context?: Context): Promise<Url> {
    return this.cmsFromContext(context).url(id, context)
  }
}
