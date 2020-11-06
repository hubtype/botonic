import { ResourceId } from './callback'
import { MultiError } from 'async-parallel'

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
    super(CmsException.mergeMessages(message, reason))
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
    reason: any | undefined
  ): string {
    if (!reason) {
      return message
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${message} Due to: ${reason.message || String(reason)}`
  }
}
