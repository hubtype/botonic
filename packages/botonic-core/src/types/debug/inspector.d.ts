/* eslint-disable node/no-missing-import */
import { Input, Route, RouteMatcher } from '..'

export declare class RouteInspector {
  routeMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    input: Input
  ): void
  routeNotMatched(
    route: Route,
    routeKey: string,
    routeValue: RouteMatcher,
    input: Input
  ): void
}

export declare class FocusRouteInspector extends RouteInspector {
  focusRoutePaths: string[] | null
  focusOnMatches: boolean
  focusOnlyOnRoutes(focusRoutePaths: string[]): FocusRouteInspector
  focusOnlyOnMatches(): FocusRouteInspector
  _isOnFocus(route: Route): boolean
}
export declare class LogRouteInspector extends FocusRouteInspector {
  _routeName(obj: Route): string
  _log(message: string, ...optionalParams: string[]): void
}
export declare class Inspector {
  constructor(routeInspector: RouteInspector | undefined)
  routeInspector: RouteInspector | undefined
  getRouteInspector(): RouteInspector
}
