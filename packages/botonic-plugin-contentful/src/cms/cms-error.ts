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
import { SearchCandidate } from '../search'
import { MultiError } from 'async-parallel'
import { reduceMultiError } from '../util/async'

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
      .catch(this.handleDeliveryError(ContentType.CAROUSEL, context, id))
      .then(ErrorReportingCMS.validate)
  }

  text(id: string, context?: Context): Promise<Text> {
    return this.cms
      .text(id, context)
      .catch(this.handleDeliveryError(ContentType.TEXT, context, id))
      .then(ErrorReportingCMS.validate)
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    return this.cms
      .text(id, context)
      .catch(this.handleDeliveryError(ContentType.CHITCHAT, context, id))
      .then(ErrorReportingCMS.validate)
  }

  startUp(id: string, context?: Context): Promise<StartUp> {
    return this.cms
      .startUp(id, context)
      .catch(this.handleDeliveryError(ContentType.STARTUP, context, id))
      .then(ErrorReportingCMS.validate)
  }

  url(id: string, context?: Context): Promise<Url> {
    return this.cms
      .url(id, context)
      .catch(this.handleDeliveryError(ContentType.URL, context, id))
      .then(ErrorReportingCMS.validate)
  }

  image(id: string, context?: Context): Promise<Image> {
    return this.cms
      .image(id, context)
      .catch(this.handleDeliveryError(ContentType.IMAGE, context, id))
      .then(ErrorReportingCMS.validate)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    return this.cms
      .queue(id, context)
      .catch(this.handleDeliveryError(ContentType.QUEUE, context, id))
      .then(ErrorReportingCMS.validate)
  }

  button(id: string, context?: Context): Promise<Button> {
    return this.cms
      .button(id, context)
      .catch(this.handleDeliveryError(ContentType.BUTTON, context, id))
      .then(ErrorReportingCMS.validate)
  }

  element(id: string, context?: Context): Promise<Element> {
    return this.cms
      .element(id, context)
      .catch(this.handleDeliveryError(ContentType.ELEMENT, context, id))
      .then(ErrorReportingCMS.validate)
  }

  contentsWithKeywords(context?: Context): Promise<SearchCandidate[]> {
    return this.cms
      .contentsWithKeywords(context)
      .catch(this.handleError('contentsWithKeywords'))
  }

  topContents(
    model: TopContentType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean,
    paging?: PagingOptions
  ): Promise<TopContent[]> {
    return this.cms
      .topContents(model, context, filter, paging)
      .catch(this.handleError('topContents'))
  }

  content(id: string, context = DEFAULT_CONTEXT): Promise<Content> {
    return this.cms
      .content(id, context)
      .catch(this.handleDeliveryError('content' as ContentType, context, id))
  }

  contents(
    contentType: ContentType,
    context?: Context,
    paging?: PagingOptions
  ): Promise<Content[]> {
    return this.cms
      .contents(contentType, context, paging)
      .catch(this.handleError('contents'))
  }

  assets(context?: Context): Promise<Asset[]> {
    return this.cms.assets(context).catch(this.handleError('assets'))
  }

  schedule(id: string, context?: Context): Promise<ScheduleContent> {
    return this.cms
      .schedule(id, context)
      .catch(this.handleDeliveryError(ContentType.SCHEDULE, context, id))
  }

  dateRange(id: string, context?: Context): Promise<DateRangeContent> {
    return this.cms
      .dateRange(id, context)
      .catch(this.handleDeliveryError(ContentType.DATE_RANGE, context, id))
  }

  asset(id: string, context?: Context): Promise<Asset> {
    return this.cms
      .asset(id, context)
      .catch(this.handleError('asset', context, id))
  }

  private handleDeliveryError(
    contentType: ContentType,
    context: Context | undefined,
    id: string
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(
        reason,
        contentType,
        undefined,
        context,
        id
      )
    }
  }

  private handleError(
    method: string,
    context?: Context,
    id?: string
  ): (reason: any) => never {
    return (reason: any) => {
      throw this.exceptionWrapper.wrap(reason, method, undefined, context, id)
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
    contentType?: ContentType,
    context?: Context,
    contentId?: string
  ): CmsException {
    let content = ''
    if (contentType) {
      content += ` on '${contentType}'`
    }
    if (context?.locale) {
      content += ` with locale '${context.locale}'`
    }
    if (contentId) {
      content += ` with id '${contentId}'`
    }
    const msg = `Error calling ${this.wrappee}.${method}${content}.`
    const exception = new CmsException(msg, contentfulError)
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
