export class CmsException extends Error {
  /**
   * @param msg description of the problem
   * @param reason what caused the exception (normally a low level exception)
   */
  constructor(message: string, readonly reason?: any) {
    super(message)
  }

  toString(): string {
    if (!this.reason) {
      return this.message
    }
    const reason = this.reason.message || String(this.reason)
    return `${this.message} due to: ${reason}`
  }
}
