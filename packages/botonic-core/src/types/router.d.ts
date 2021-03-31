import { Input, Route, RouteMatcher, Routes, Session } from '.'
import { RouteInspector } from './debug'

export declare class Router {
  constructor(routes: Routes, routeInspector?: RouteInspector)
  routes: Routes
  routeInspector: RouteInspector
  processInput(
    input: Input,
    session?: Session,
    lastRoutePath?: string
  ):
    | {
        action: any
        params: {
          [x: number]: any
        }
        retryAction: any
        defaultAction: any
        lastRoutePath: any
      }
    | {
        action: any
        params: any
        lastRoutePath: any
        retryAction?: undefined
        defaultAction?: undefined
      }
    | {
        action: any
        params: any
        retryAction: any
        lastRoutePath: any
        defaultAction?: undefined
      }
  lastRoutePath: string
  getOnFinishParams(input: Input): string
  getRoute(
    input: Input,
    routes: Routes,
    session: Session,
    lastRoutePath: string
  ): {
    route: Route
    params: any
  }
  getRouteByPath(path: string, routeList: Routes): Route
  matchRoute(
    route: Route,
    prop: any,
    matcher: RouteMatcher,
    input: Input,
    session: Session,
    lastRoutePath: string
  ): any
  matchValue(matcher: RouteMatcher, value: any): any
}
