export class CmsException extends Error {
  /**
   * @param message description of the problem
   * @param reason what caused the exception (normally a low level exception)
   */
  constructor(message: string, readonly reason?: any) {
    super(CmsException.mergeMessages(message, reason))
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
    return `${message} due to: ${reason.message || String(reason)}`
  }
}
