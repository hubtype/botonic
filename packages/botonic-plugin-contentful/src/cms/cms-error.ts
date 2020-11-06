import { MultiError } from 'async-parallel'

import { SearchCandidate } from '../search'
import { reduceMultiError } from '../util/async'
import { AssetId, ContentId, ResourceId } from './callback'
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
import { Context, DEFAULT_CONTEXT } from './context'
import { CmsException } from './exceptions'

/**
 * It validates the individually delivered contents, but not those fetched
 * through contents/topContents
 */
export class ErrorReportingCMS implements CMS {
  private exceptionWrapper: ContentfulExceptionWrapper

  constructor(readonly cms: CMS, readonly logger?: (msg: string) => void) {
    this.exceptionWrapper = new ContentfulExceptionWrapper('CMS', logger)
  }

  private static validate<C extends Content>(content: C): C {
    const v = content.validate()
    if (v) {
      console.error(v)
    }
    return content
  }

  carousel(id: string, context?: Context): Promise<Carousel> {
    return this.cms
      .carousel(id, context)
      .catch(this.handleContentError(ContentType.CAROUSEL, id, context))
      .then(ErrorReportingCMS.validate)
  }

  text(id: string, context?: Context): Promise<Text> {
    return this.cms
      .text(id, context)
      .catch(this.handleContentError(ContentType.TEXT, id, context))
      .then(ErrorReportingCMS.validate)
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    return this.cms
      .text(id, context)
      .catch(this.handleContentError(ContentType.CHITCHAT, id, context))
      .then(ErrorReportingCMS.validate)
  }

  startUp(id: string, context?: Context): Promise<StartUp> {
    return this.cms
      .startUp(id, context)
      .catch(this.handleContentError(ContentType.STARTUP, id, context))
      .then(ErrorReportingCMS.validate)
  }

  url(id: string, context?: Context): Promise<Url> {
    return this.cms
      .url(id, context)
      .catch(this.handleContentError(ContentType.URL, id, context))
      .then(ErrorReportingCMS.validate)
  }

  image(id: string, context?: Context): Promise<Image> {
    return this.cms
      .image(id, context)
      .catch(this.handleContentError(ContentType.IMAGE, id, context))
      .then(ErrorReportingCMS.validate)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    return this.cms
      .queue(id, context)
      .catch(this.handleContentError(ContentType.QUEUE, id, context))
      .then(ErrorReportingCMS.validate)
  }

  button(id: string, context?: Context): Promise<Button> {
    return this.cms
      .button(id, context)
      .catch(this.handleContentError(ContentType.BUTTON, id, context))
      .then(ErrorReportingCMS.validate)
  }

  element(id: string, context?: Context): Promise<Element> {
    return this.cms
      .element(id, context)
      .catch(this.handleContentError(ContentType.ELEMENT, id, context))
      .then(ErrorReportingCMS.validate)
  }

  contentsWithKeywords(context?: Context): Promise<SearchCandidate[]> {
    return this.cms
      .contentsWithKeywords(context)
      .catch(this.handleError('contentsWithKeywords', context))
  }

  topContents<T extends TopContent>(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<T[]> {
    return this.cms
      .topContents<T>(model, context, filter, paging)
      .catch(this.handleError('topContents', context))
  }

  content(id: string, context = DEFAULT_CONTEXT): Promise<Content> {
    return this.cms
      .content(id, context)
      .catch(this.handleContentError('content' as ContentType, id, context))
  }

  contents<T extends Content>(
    contentType: ContentType,
    context?: Context,
    paging?: PagingOptions
  ): Promise<T[]> {
    return this.cms
      .contents<T>(contentType, context, paging)
      .catch(this.handleError('contents', context))
  }

  assets(context?: Context): Promise<Asset[]> {
    return this.cms.assets(context).catch(this.handleError('assets', context))
  }

  schedule(id: string, context?: Context): Promise<ScheduleContent> {
    return this.cms
      .schedule(id, context)
      .catch(this.handleContentError(ContentType.SCHEDULE, id, context))
  }

  dateRange(id: string, context?: Context): Promise<DateRangeContent> {
    return this.cms
      .dateRange(id, context)
      .catch(this.handleContentError(ContentType.DATE_RANGE, id, context))
  }

  asset(id: string, context?: Context): Promise<Asset> {
    return this.cms
      .asset(id, context)
      .catch(this.handleResourceError(new AssetId(id, undefined), context))
  }

  private handleContentError(
    contentType: ContentType,
    id: string,
    context: Context | undefined
  ): (reason: any) => never {
    return this.handleResourceError(new ContentId(contentType, id), context)
  }

  private handleResourceError(
    resourceId: ResourceId,
    context: Context | undefined
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(
        reason,
        resourceId.resourceType,
        resourceId,
        context
      )
    }
  }

  private handleError(
    method: string,
    context: Context | undefined
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(reason, method, undefined, context)
    }
  }
}

export class ContentfulExceptionWrapper {
  // TODO add logStack in plugin config
  readonly logStack = true
  constructor(
    readonly wrappee: string,
    readonly logger = (msg: string) => {
      console.error(msg)
    }
  ) {}

  wrap(
    contentfulError: any,
    method: string,
    resourceId?: ResourceId,
    context?: Context
  ): CmsException {
    let content = ''
    if (context?.locale) {
      content += ` with locale '${context.locale}'`
    }
    if (resourceId) {
      content += ` on '${resourceId.resourceType}' with id '${resourceId.id}'`
    }
    const msg = `Error calling ${this.wrappee}.${method}${content}.`
    const exception = new CmsException(msg, contentfulError, resourceId)
    const err = this.processError(contentfulError)
    this.logger(`${msg} Due to ${err}`)

    throw exception
  }

  processError(contentfulError: Error): string {
    let err = ''
    if (contentfulError instanceof MultiError) {
      err += ' Due to:'
      for (const e of reduceMultiError(contentfulError)) {
        err += this.processError(e)
      }
    } else if (this.logStack && contentfulError.stack) {
      err += contentfulError.stack.split('\n').slice(0, 5).join('\n')
    } else {
      err += `Due to '${contentfulError.message}'`
    }
    return err
  }
}
