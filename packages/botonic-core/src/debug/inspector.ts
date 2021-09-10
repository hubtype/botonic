import { Route, RouteMatcher } from '../models'
export class RouteInspector {
  routeMatched(
    _route: Route,
    _routeKey: string,
    _routeValue: RouteMatcher,
    _input: any
  ): void {}
  routeNotMatched(
    _route: Route,
    _routeKey: string,
    _routeValue: RouteMatcher,
    _input: any
  ): void {}
}

export class FocusRouteInspector extends RouteInspector {
  focusRoutePaths: string[] | null
  focusOnMatches: boolean
  constructor() {
    super()
    this.focusRoutePaths = null
    this.focusOnMatches = false
  }

  focusOnlyOnRoutes(focusRoutePaths: string[]): this {
    this.focusRoutePaths = focusRoutePaths
    return this
  }

  focusOnlyOnMatches(): this {
    this.focusOnMatches = true
    return this
  }

  _isOnFocus(route: Route): boolean {
    if (this.focusRoutePaths === null) {
      return true
    }
    // @ts-ignore
    return this.focusRoutePaths.includes(route.path)
  }
}

export class LogRouteInspector extends FocusRouteInspector {
  routeMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    inputValue: string
  ): void {
    if (!this._isOnFocus(route)) {
      return
    }
    this._log(
      `Route ${this._routeName(route)} selected ` +
        `because Input.${routeKey} (${inputValue}) matched '${routeValue}'`
    )
  }

  // @ts-ignore
  routeNotMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    inputValue: string
  ): void {
    if (!this._isOnFocus(route) || this.focusOnMatches) {
      return
    }
    this._log(
      `Route ${this._routeName(route)} not selected ` +
        `because Input.${routeKey} (${inputValue}) did not match '${routeValue}'`
    )
  }

  _routeName(obj: Route): string {
    let name = obj.path || '<<no path defined>>'
    if (obj.action) {
      name = `'${name}' (to action '${obj.action.name}')`
    }
    if (obj.redirect) {
      name = `'${name}' (with redirect to '${obj.redirect}')`
    }
    return name as string
  }

  _log(message: string, ...optionalParams: string[]): void {
    console.log(message, ...optionalParams)
  }
}

export class Inspector {
  routeInspector: RouteInspector
  constructor(routeInspector: RouteInspector | undefined = undefined) {
    this.routeInspector = routeInspector || new RouteInspector()
  }

  getRouteInspector(): RouteInspector {
    return this.routeInspector
  }
}
