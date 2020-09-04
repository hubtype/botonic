import { CMS, ContentType, TopContentType } from './cms'
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
import { CmsException } from './exceptions'
import { SearchCandidate } from '../search'
import { MultiError } from 'async-parallel'
import { reduceMultiError } from '../util/async'

export class ErrorReportingCMS implements CMS {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  exceptionWrapper = new ContentfulExceptionWrapper('CMS')
  constructor(readonly cms: CMS) {}

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
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    return this.cms
      .topContents(model, context, filter)
      .catch(this.handleError('topContents'))
  }

  contents(contentType: ContentType, context?: Context): Promise<Content[]> {
    return this.cms
      .contents(contentType, context)
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
  constructor(
    readonly wrappee: string,
    readonly logErrors = true,
    // TODO add logStack in plugin config
    readonly logStack = true
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
    if (this.logErrors) {
      console.error(exception.toString())
      if (this.logStack) {
        if (contentfulError instanceof MultiError) {
          console.error('due to:')
          for (const e of reduceMultiError(contentfulError)) {
            console.error(e.message)
          }
        } else {
          console.error('due to', contentfulError)
        }
      }
    }
    throw exception
  }
}
