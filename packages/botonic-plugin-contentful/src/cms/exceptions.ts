export class CmsException extends Error {
  /**
   * @param msg description of the problem
   * @param reason what caused the exception (normally a low level exception)
   */
  constructor(msg: string, readonly reason?: any) {
    super(msg)
  }
}
