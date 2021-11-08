export class LocalDispatchers {
  localDispatchers

  constructor(dispatchers) {
    this.localDispatchers = dispatchers
  }
  async dispatch(handlerName, params) {
    await this.localDispatchers[handlerName](params)
  }
}
