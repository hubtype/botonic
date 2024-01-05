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
      this.validate(c)
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
            this.validate(content)
          }
        }
      } catch (e) {
        this.processException(model, e)
      }
    }
    return messageContents
  }

  private processException(model: ContentType, e: any): void {
    const resourceId = e instanceof CmsException && e.resourceId

    const multiError = this.getMultiError(e)
    if (multiError && !resourceId) {
      for (const e1 of multiError.list) {
        this.processException(model, e1)
      }
    } else {
      this.report.deliveryError(
        resourceId || new ContentId(model, '??'),
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

  protected validate(content: TopContent) {
    const res = content.validate()
    if (res) {
      this.report.validationError(content.contentId, res)
    } else {
      this.report.successfulValidation(content.contentId)
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
  deliveryError(resourceId: ResourceId, exception: Error): void
  validationError(resourceId: ResourceId, error: string): void
  successfulValidation(resourceId: ResourceId): void
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

  successfulValidation(resourceId: ResourceId): void {
    this.successContents.push(resourceId)
  }

  deliveryError(resourceId: ResourceId, exception: Error) {
    let msg = exception.message
    if (exception instanceof CmsException) {
      msg += exception.messageFromReason()
    }
    this.processError(resourceId, msg, true)
  }

  validationError(resourceId: ResourceId, error: string) {
    this.processError(resourceId, error, false)
  }

  protected processError(
    resourceId: ResourceId,
    msg: string,
    critical: boolean
  ): void {
    if (this.logErrors) {
      if (!msg.includes(resourceId.id)) {
        msg = `${resourceId.toString()}: ${msg}`
      }
      console.log(msg)
    }
    this.errors.push({ resourceId, msg, critical })
  }
}
