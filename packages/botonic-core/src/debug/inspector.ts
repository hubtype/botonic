// @ts-nocheck
export class RouteInspector {
  routeMatched(route, routeKey, routeValue, input) {}
  routeNotMatched(route, routeKey, routeValue, inputValue) {}
}

export class FocusRouteInspector extends RouteInspector {
  focusRoutePaths
  focusOnMatches
  constructor() {
    super()
    this.focusRoutePaths = null
    this.focusOnMatches = false
  }

  focusOnlyOnRoutes(focusRoutePaths) {
    this.focusRoutePaths = focusRoutePaths
    return this
  }

  focusOnlyOnMatches() {
    this.focusOnMatches = true
    return this
  }

  _isOnFocus(route) {
    if (this.focusRoutePaths == null) {
      return true
    }
    return this.focusRoutePaths.includes(route.path)
  }
}

// @ts-nocheck
export class LogRouteInspector extends FocusRouteInspector {
  routeMatched(route, routeKey, routeValue, inputValue) {
    if (!this._isOnFocus(route)) {
      return
    }
    this._log(
      `Route ${this._routeName(route)} selected ` +
        `because Input.${routeKey} (${inputValue}) matched '${routeValue}'`
    )
  }

  routeNotMatched(route, routeKey, routeValue, inputValue) {
    if (!this._isOnFocus(route) || this.focusOnMatches) {
      return
    }
    this._log(
      `Route ${this._routeName(route)} not selected ` +
        `because Input.${routeKey} (${inputValue}) did not match '${routeValue}'`
    )
  }

  _routeName(obj) {
    let name = obj.path || '<<no path defined>>'
    if (obj.action) {
      name = `'${name}' (to action '${obj.action.name}')`
    }
    if (obj.redirect) {
      name = `'${name}' (with redirect to '${obj.redirect}')`
    }

    return name
  }

  _log(message, ...optionalParams) {
    console.log(message, ...optionalParams)
  }
}

export class Inspector {
  routeInspector
  constructor(routeInspector = undefined) {
    this.routeInspector = routeInspector || new RouteInspector()
  }

  getRouteInspector() {
    return this.routeInspector
  }
}
