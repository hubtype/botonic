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
import { reachableFrom } from '../cms/visitors/message-visitors'
import { ensureError } from '../util/exceptions'

export class ContentsValidator {
  constructor(
    readonly cms: CMS,
    readonly report = new DefaultContentsValidatorReports(),
    readonly onlyValidateReachable = true
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
    const messageContentsToValidate = this.onlyValidateReachable
      ? await this.reachableContents(messageContents, context)
      : messageContents
    for (const c of messageContentsToValidate) {
      this.validate(c)
    }
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
    return reachable
  }

  protected validate(content: TopContent) {
    const res = content.validate()
    if (res) {
      this.report.validationError(content.contentId, res)
    }
  }
}

export interface ContentsValidatorReports {
  deliveryError(resourceId: ResourceId, exception: Error): void
  validationError(resourceId: ResourceId, error: string): void
}

type ResourceError = {
  resourceId: ResourceId
  msg: string
  critical: boolean
}

export class DefaultContentsValidatorReports
  implements ContentsValidatorReports {
  errors: ResourceError[] = []

  constructor(readonly logErrors = true) {}

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

  private processError(
    resourceId: ResourceId,
    msg: string,
    critical: boolean
  ): void {
    if (this.logErrors) {
      if (!msg.includes(resourceId.id)) {
        msg = `${resourceId.toString()}: msg`
      }
      console.log(msg)
    }
    this.errors.push({ resourceId, msg, critical })
  }
}
