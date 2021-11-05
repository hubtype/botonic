export class LocalDispatchers {
  localDispatchers

  constructor(dispatchers) {
    this.localDispatchers = dispatchers
  }
  async run(handlerName, params) {
    await this.localDispatchers[handlerName](params)
  }
}
