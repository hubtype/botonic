export class TrackException extends Error {
  /**
   * @param msg desciption of the problem
   * @param reason what caused the exception (normally a low level exception)
   */
  constructor(msg: string, readonly reason: any) {
    super(msg)
  }
}
