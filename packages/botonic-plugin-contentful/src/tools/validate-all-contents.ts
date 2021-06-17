import { MultiError } from 'async-parallel'

import {
  CMS,
  CmsException,
  ContentId,
  ContentType,
  Context,
  MessageContent,
  ResourceId,
  TOP_CONTENT_TYPES,
  TopContent,
} from '../cms'
import { ensureError } from '../cms/exceptions'
import { reachableFrom } from '../cms/visitors/message-visitors'

export class ContentsValidator {
  /**
   *
   * @param onlyValidateReachable only validate searchable contents (with keywords) or
   * which are linked from other contents
   * @param initialContentIds contents to be validated even if they're not
   * reachable
   */
  constructor(
    readonly cms: CMS,
    readonly report = new DefaultContentsValidatorReports(),
    readonly onlyValidateReachable = true,
    readonly initialContentIds: string[] = []
  ) {}

  /**
   * Deliver all TopContent's to validate that they won't fail in production.
   * A content delivery might fail if:
   * - It has a link to a deleted content
   * - There are infinite loops
   * - There's a bug on the CMS plugin
   * - An URL has empty URL empty
   */
  async validateAllTopContents(context: Context): Promise<void> {
    const messageContents = await this.cacheMessageContents(context)
    const messageContentsToValidate = this.onlyValidateReachable
      ? await this.reachableContents(messageContents, context)
      : messageContents
    for (const c of messageContentsToValidate) {
      this.validate(c, context)
    }
  }

  private async cacheMessageContents(context: Context) {
    const messageContents: MessageContent[] = []
    // TODO also validate non TopContent contents
    for (const model of TOP_CONTENT_TYPES) {
      try {
        // TODO use async to improve concurrency
        const modelContents = await this.cms.topContents(model, context)
        for (const content of modelContents) {
          if (content instanceof MessageContent) {
            messageContents.push(content)
          } else {
            this.validate(content, context)
          }
        }
      } catch (e) {
        this.processException(model, context, e)
      }
    }
    return messageContents
  }

  private processException(model: ContentType, context: Context, e: any): void {
    const resourceId = e instanceof CmsException && e.resourceId

    const multiError = this.getMultiError(e)
    if (multiError && !resourceId) {
      for (const e1 of multiError.list) {
        this.processException(model, context, e1)
      }
    } else {
      this.report.deliveryError(
        resourceId || new ContentId(model, '??'),
        context,
        ensureError(e)
      )
    }
  }
  private getMultiError(e: any): MultiError | undefined {
    if (e instanceof MultiError) {
      return e
    }
    if (e instanceof CmsException && e.reason instanceof MultiError) {
      return e.reason
    }
    return undefined
  }

  protected async reachableContents(
    allContents: MessageContent[],
    context: Context
  ): Promise<Iterable<MessageContent>> {
    const reachable = await reachableFrom(this.cms, allContents, context)
    allContents.filter(c => c.isSearchable()).forEach(c => reachable.add(c))
    this.addInitialContents(allContents, reachable)
    return reachable
  }

  protected validate(content: TopContent, context: Context) {
    const res = content.validate()
    if (res) {
      this.report.validationError(content.contentId, context, res)
    } else {
      this.report.successfulValidation(content.contentId, context)
    }
  }

  private addInitialContents(
    allContents: MessageContent[],
    reachable: Set<MessageContent>
  ) {
    if (this.initialContentIds.length == 0) {
      return
    }
    for (const c of allContents) {
      if (this.initialContentIds.includes(c.id)) {
        reachable.add(c)
      }
    }
  }
}

export interface ContentsValidatorReports {
  deliveryError(
    resourceId: ResourceId,
    context: Context,
    exception: Error
  ): void
  validationError(resourceId: ResourceId, context: Context, error: string): void
  successfulValidation(resourceId: ResourceId, context: Context): void
}

type ResourceError = {
  resourceId: ResourceId
  msg: string
  critical: boolean
}

export class DefaultContentsValidatorReports
  implements ContentsValidatorReports {
  errors: ResourceError[] = []
  successContents: ResourceId[] = []

  constructor(readonly logErrors = true) {}

  successfulValidation(resourceId: ResourceId, context: Context): void {
    this.successContents.push(resourceId)
  }

  deliveryError(resourceId: ResourceId, context: Context, exception: Error) {
    let msg = exception.message
    if (exception instanceof CmsException) {
      msg += exception.messageFromReason()
    }
    this.processError(resourceId, context, msg, true)
  }

  validationError(resourceId: ResourceId, context: Context, error: string) {
    this.processError(resourceId, context, error, false)
  }

  protected processError(
    resourceId: ResourceId,
    context: Context,
    msg: string,
    critical: boolean
  ): void {
    if (this.logErrors) {
      if (!msg.includes(resourceId.id)) {
        const onLocale = msg.includes('on locale')
          ? ''
          : ` on locale '${context.locale}`
        msg = `${resourceId.toString()}${onLocale}': ${msg}`
      }
      console.log(msg)
    }
    this.errors.push({ resourceId, msg, critical })
  }
}
