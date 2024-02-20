import { MultiError } from 'async-parallel'

import { isError } from '../util/exceptions'
import { ResourceId } from './callback'
import { ResourceType } from './cms'

export class CmsException extends Error {
  /**
   * @param message description of the problem
   * @param reason what caused the exception (normally a low level exception)
   */
  constructor(
    message: string,
    readonly reason?: any,
    readonly resourceId?: ResourceId
  ) {
    super(CmsException.mergeMessages(message, reason, resourceId))
  }

  public messageFromReason(): string | undefined {
    if (!this.reason) {
      return undefined
    }
    if (this.reason instanceof MultiError) {
      return this.reason.list.map(e => e.message).join('\n')
    }
    if (this.reason instanceof Error) {
      return this.reason.message
    }
    return String(this.reason)
  }

  /**
   * Reason's string is merged into message because many tools (eg. jest)
   * only report Error.message and not Error.toString()
   */
  private static mergeMessages(
    message: string,
    reason: any | undefined,
    resourceId: ResourceId | undefined
  ): string {
    // resourceId already reported by ErrorReportingCMS, but not yet
    // for contents & topContents methods
    if (resourceId && !message.includes(resourceId.id)) {
      message += ` on content ${resourceId.toString()}`
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    if (reason) {
      message += `. ${String(reason.message || reason)}`
    }
    return message
  }
}

export class ResourceNotFoundCmsException extends CmsException {
  constructor(
    readonly resourceId?: ResourceId,
    readonly reason?: any | undefined
  ) {
    super('CMS resource not found', reason, resourceId)
  }
}

export class ResourceTypeNotFoundCmsException extends CmsException {
  constructor(
    readonly resourceType: ResourceType,
    readonly reason: any | undefined
  ) {
    super(`CMS resource type '${resourceType}' not found`, reason, undefined)
  }
}

export function ensureError(e: any): Error {
  if (isError(e)) {
    return e
  }
  return new CmsException(String(e), undefined)
}

export class ExceptionUnpacker {
  constructor(
    readonly indent = '    ',
    readonly prependSubErrorIndex = true
  ) {}

  public unpack(e: any): string[] {
    return this.processException(ensureError(e))
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

  private processException(e: Error, index?: number): string[] {
    const multiError = this.getMultiError(e)
    if (multiError) {
      const msgLists = multiError.list.map((e1, i) =>
        this.processException(e1, i + 1)
      )
      const flat = Array.prototype.concat(...msgLists)
      return flat
    } else {
      const indexPre = index ? [`${this.indent}${index}:`] : []
      return indexPre.concat([this.indent + e.message])
    }
  }
}
