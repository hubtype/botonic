export class RouteInspector {
  routeMatched(route, routeKey, routeValue, input) {}
}

export class LogRouteInspector extends RouteInspector {
  routeMatched(route, routeKey, routeValue, inputValue) {
    this._log(
      `route '${this._className(route.action)}' selected ` +
        `because input's ${routeKey} (${inputValue}) matched ${routeValue}`
    )
  }

  _className(obj) {
    return obj.constructor.name
  }

  _log(message, ...optionalParams) {
    console.log(message, ...optionalParams)
  }
}
