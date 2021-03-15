import { RouteInspector } from './debug'
import { Input, Params, Route, RouteMatcher, Session } from './index'
export interface RouteParams {
  route: Route
  params?: Params
}

export class Router {
  constructor(routes: Route[], routeInspector?: RouteInspector)

  processInput(input: Input, session: Session, lastRoutePath?: string)

  getOnFinishParams(input: Input): string | undefined

  matchRoute(
    route: Route,
    prop: string,
    matcher: RouteMatcher,
    input: Input,
    session: Session,
    lastRoutePath?: string
  )

  getRouteByPath(path: string | null, routeList?: Route[]): Route | null
}
