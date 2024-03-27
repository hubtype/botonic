export class TrackException extends Error {
  /**
   * @param msg description of the problem
   * @param reason what caused the exception (eg. a low level exception)
   */
  constructor(
    msg: string,
    readonly reason?: any
  ) {
    super(msg)
  }
}
