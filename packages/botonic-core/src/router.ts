import { RouteInspector } from './debug/inspector'
import { Input, Route, Routes, Session } from './models'
import { isFunction } from './utils'

export class NoMatchingRouteError extends Error {
  input: Input
  constructor(input: Input) {
    super(
      `No route found for input '${JSON.stringify(
        input
      )}' and no 404 route defined`
    )
    this.input = input
  }
}

type Nullable<T> = T | null

type Action = () => any

interface ProcessedInput {
  action: Nullable<Action>
  emptyAction: Nullable<Action>
  fallbackAction: Nullable<Action>
  lastRoutePath: Nullable<string>
  params: Params
}

class ProcessedInputBuilder {
  private processedInput: ProcessedInput

  constructor() {
    this.processedInput = {
      action: null,
      emptyAction: null,
      fallbackAction: null,
      lastRoutePath: null,
      params: {},
    }
  }
  withAction(action: Nullable<Action>): this {
    if (action) this.processedInput.action = action
    return this
  }

  withEmptyAction(emptyAction: Nullable<Action>): this {
    if (emptyAction) this.processedInput.emptyAction = emptyAction
    return this
  }

  withFallbackAction(fallbackAction: Nullable<Action>): this {
    if (fallbackAction) this.processedInput.fallbackAction = fallbackAction
    return this
  }

  withLastRoutePath(lastRoutePath: Nullable<string>): this {
    if (lastRoutePath) this.processedInput.lastRoutePath = lastRoutePath
    return this
  }

  withParams(params: Params): this {
    if (Object.keys(params).length > 1) this.processedInput.params = params
    return this
  }

  build(): ProcessedInput {
    return this.processedInput
  }
}

interface Params {
  [key: string]: any
}

type RoutingState = {
  previousRoute: Nullable<Route>
  previousRoutePath: Nullable<string>
  matchedRoute: Nullable<Route>
  matchedRoutePath: Nullable<string>
  params: Params
  isRetry: boolean
}

interface RouteParams {
  route: Route
  params: any
}
type MatchingProp =
  | 'text'
  | 'payload'
  | 'intent'
  | 'type'
  | 'input'
  | 'session'
  | 'request'

type Matcher = string | RegExp | ((args) => boolean)

export class Router {
  routes: Routes
  routeInspector: RouteInspector
  /**
   * @param {Route[]} routes
   * @param routeInspector
   */
  constructor(
    routes: Routes,
    routeInspector: RouteInspector | undefined = undefined
  ) {
    // TODO: Add a routes validator
    // TODO: Test functional routers
    this.routes = routes
    this.routeInspector = routeInspector || new RouteInspector()
  }

  getRoutingStateFromPathPayload(
    session: Session,
    previousRoute: Nullable<Route>,
    previousRoutePath: Nullable<string>,
    pathPayload: string
  ): RoutingState {
    let matchedRoute: Nullable<Route> = null
    const pathParams = this.getPathParamsFromPathPayload(pathPayload)
    const getMatchedRouteByPath = (seekPath: string): RoutingState => {
      matchedRoute = this.getRouteByPath(seekPath)
      if (!matchedRoute) {
        return {
          previousRoute,
          previousRoutePath,
          matchedRoute: null,
          matchedRoutePath: null,
          params: {},
          isRetry: this.isRetry(true, session, previousRoute),
        }
      }
      return {
        previousRoute,
        previousRoutePath,
        matchedRoute: { ...matchedRoute },
        matchedRoutePath: seekPath,
        params: this.pathParamsToParams(pathParams.params),
        isRetry: this.isRetry(false, session, previousRoute),
      }
    }
    /**
     * Given a valid path: 'Flow1/Subflow1' we are in one of the two scenarios below.
     */
    //  1. Received __PATH_PAYLOAD__Subflow2, so we need to first try to concatenate it with Flow1 (lastRoutePath)
    if (previousRoutePath) {
      const matchingResults = getMatchedRouteByPath(
        `${previousRoutePath}/${pathParams.path}`
      )
      if (matchingResults.matchedRoute) return matchingResults
    }
    // 2. Received __PATH_PAYLOAD__Flow1/Subflow1, so we can resolve it directly
    const matchingResults = getMatchedRouteByPath(pathParams.path)
    return matchingResults
  }

  getRoutingStateFromInput(
    previousRoute: Nullable<Route>,
    previousRoutePath: Nullable<string>,
    input: Input,
    session: Session
  ): RoutingState {
    let matchedRoute: Nullable<Route> = null
    let matchedRoutePath: Nullable<string> = null
    let params: Params = {}
    // get route depending of current ChildRoutes
    if (previousRoute && previousRoute.childRoutes) {
      const routeParams = this.getRoute(
        input,
        previousRoute.childRoutes,
        session,
        previousRoutePath
      )
      if (routeParams) {
        matchedRoute = {
          ...routeParams.route,
        }
        params = routeParams.params
        matchedRoutePath = `${previousRoutePath}/${routeParams.route.path}`
      }
    }
    if (matchedRoute) {
      return {
        previousRoute,
        previousRoutePath,
        matchedRoute,
        matchedRoutePath,
        params,
        isRetry: this.isRetry(false, session, previousRoute),
      }
    }
    /**
     * we couldn't find a route in the state of the previousRoute childRoutes,
     * so let's find in the general routes
     */
    const routeParams = this.getRoute(
      input,
      this.routes,
      session,
      previousRoutePath
    )
    if (routeParams && routeParams.route && routeParams.route.path) {
      matchedRoute = {
        ...routeParams.route,
      }
      params = routeParams.params
      matchedRoutePath = routeParams.route.path
    }
    const brokenFlow = !previousRoutePath ? false : true
    return {
      previousRoute,
      previousRoutePath,
      matchedRoute,
      matchedRoutePath,
      params,
      isRetry: this.isRetry(brokenFlow, session, previousRoute),
    }
  }

  pathParamsToParams(pathParams?: string): { [key: string]: any } {
    if (!pathParams) return {}
    try {
      const params = {}
      const searchParams = new URLSearchParams(pathParams)
      for (const [key, value] of searchParams) {
        params[key] = value
      }
      return params
    } catch (e) {
      return {}
    }
  }

  isRetry(
    brokenFlow: boolean,
    session: Session,
    previousRoute: Nullable<Route>
  ): boolean {
    if (!brokenFlow || !previousRoute || !previousRoute.retry) return false
    return session.__retries < previousRoute.retry
  }

  getRoutingState(
    input: Input,
    session: Session,
    lastRoutePath: Nullable<string>
  ): RoutingState {
    const previousRoute = {
      ...this.getRouteByPath(lastRoutePath, this.routes),
    }
    const previousRoutePath = lastRoutePath
    if (this.isPathPayload(input.payload)) {
      return this.getRoutingStateFromPathPayload(
        session,
        previousRoute,
        previousRoutePath,
        input.payload as string
      )
    }
    return this.getRoutingStateFromInput(
      previousRoute,
      previousRoutePath,
      input,
      session
    )
  }

  computeProcessedInput(
    input: Input,
    session: Session,
    routingState: RoutingState
  ): ProcessedInput {
    const {
      previousRoute,
      previousRoutePath,
      matchedRoute,
      matchedRoutePath,
      params,
      isRetry,
    } = routingState
    const processedInput = new ProcessedInputBuilder()
    if (isRetry) {
      session.__retries = session.__retries !== 0 ? session.__retries + 1 : 1
      if (!matchedRoute || (matchedRoute && matchedRoutePath === '404')) {
        return processedInput
          .withAction(previousRoute?.action ?? null)
          .withEmptyAction(this.getEmptyAction(previousRoute?.childRoutes))
          .withFallbackAction(
            matchedRoute?.action ?? this.getNotFoundAction(input)
          )
          .withLastRoutePath(previousRoutePath)
          .withParams(params)
          .build()
      }
      if (matchedRoute.ignoreRetry === true) {
        session.__retries = 0
        return processedInput
          .withAction(matchedRoute.action)
          .withEmptyAction(this.getEmptyAction(matchedRoute.childRoutes))
          .withLastRoutePath(matchedRoutePath)
          .withParams(params)
          .build()
      }
      return processedInput
        .withAction(previousRoute?.action)
        .withEmptyAction(this.getEmptyAction(matchedRoute.childRoutes))
        .withFallbackAction(matchedRoute.action)
        .withLastRoutePath(previousRoutePath)
        .withParams(params)
        .build()
    }

    session.__retries = 0
    if (!matchedRoute || (matchedRoute && matchedRoutePath === '404')) {
      return processedInput
        .withFallbackAction(
          matchedRoute?.action ?? this.getNotFoundAction(input)
        )
        .withLastRoutePath(previousRoutePath)
        .withParams(params)
        .build()
    }

    if (matchedRoute.redirect) {
      const redirectedRoute = this.getRouteByPath(
        matchedRoute.redirect,
        this.routes
      )
      if (!redirectedRoute) {
        return processedInput
          .withFallbackAction(this.getNotFoundAction(input))
          .withLastRoutePath(previousRoutePath)
          .withParams(params)
          .build()
      }
      return processedInput
        .withAction(redirectedRoute.action)
        .withEmptyAction(this.getEmptyAction(redirectedRoute.childRoutes))
        .withLastRoutePath(matchedRoute.redirect)
        .withParams(params)
        .build()
    }

    return processedInput
      .withAction(matchedRoute.action)
      .withEmptyAction(this.getEmptyAction(matchedRoute.childRoutes))
      .withLastRoutePath(matchedRoutePath)
      .withParams(params)
      .build()
  }

  processInput(
    input: Input,
    session: Session,
    lastRoutePath: Nullable<string> = null
  ): ProcessedInput {
    session.__retries = session.__retries ?? 0
    const routingState = this.getRoutingState(input, session, lastRoutePath)
    return this.computeProcessedInput(input, session, routingState)
    // TODO: new return? input, session, lastRoutePath -> actions[{action, params}], lastRoutePath
  }

  getNotFoundAction(input: Input): Nullable<Action> {
    const notFoundActionRoute = this.getRouteByPath('404', this.routes)
    if (!notFoundActionRoute) throw new NoMatchingRouteError(input)
    return notFoundActionRoute.action
  }

  getEmptyAction(childRoutes?: Route[]): Nullable<Action> {
    if (!childRoutes) return null
    const emptyActionRoute = childRoutes.find(r => r.path === '')
    if (!emptyActionRoute) return null
    return emptyActionRoute.action
  }

  isPathPayload(payload?: string): boolean {
    if (!payload) return false
    const isPathPayload = /^__PATH_PAYLOAD__(.*)/.exec(payload)
    return Boolean(isPathPayload)
  }

  getPathParamsFromPathPayload(payload?: string): any {
    const defaultPathParams = {
      path: null,
      params: undefined,
    }
    if (!payload) return defaultPathParams
    if (!this.isPathPayload(payload)) return defaultPathParams

    try {
      const pathWithParams = payload.split('__PATH_PAYLOAD__')[1]
      if (!pathWithParams) {
        throw '__PATH_PAYLOAD__ is empty'
      }
      const [path, params] = pathWithParams.split('?')
      return { path: path ?? null, params }
    } catch (e) {
      console.error('Error getting path and params from input.payload:', e)
      return defaultPathParams
    }
  }

  /**
   * @return {null|RouteParams}
   */
  getRoute(
    input: Input | Partial<Input>,
    routes: Routes,
    session: Session,
    lastRoutePath: Nullable<string>
  ): RouteParams | null {
    const computedRoutes = isFunction(routes)
      ? // @ts-ignore
        routes({ input, session, lastRoutePath })
      : routes
    /* Find the route that matches the given input, if it match with some of the entries,
      return the whole Route of the entry with optional params captured if matcher was a regex */
    /** @type {{ [key: string]: string }}*/
    let params = {}
    const route = computedRoutes.find(r =>
      Object.entries(r)
        .filter(
          ([key, _]) =>
            key !== 'action' && key !== 'childRoutes' && key !== 'path'
        )
        .some(([key, value]) => {
          const match = this.matchRoute(
            r,
            key as MatchingProp,
            value as Matcher,
            input as Input,
            session,
            lastRoutePath
          )
          try {
            if (match !== null && typeof match !== 'boolean' && match.groups) {
              // Strip '[Object: null prototype]' from groups result: https://stackoverflow.com/a/62945609/6237608
              params = { ...match.groups }
            }
          } catch (e) {}
          return Boolean(match)
        })
    )
    if (route) {
      return { route, params }
    }
    return null
  }

  getRouteByPath(
    path: Nullable<string>,
    routeList: Routes | null = null
  ): Nullable<Route> {
    if (!path) return null
    let route: Nullable<Route> = null
    routeList = routeList || this.routes
    const [currentPath, ...childPath] = path.split('/')
    if (Array.isArray(routeList)) {
      for (const r of routeList) {
        //iterate over all routeList
        if (r.path == currentPath) {
          route = r
          if (r.childRoutes && r.childRoutes.length && childPath.length > 0) {
            //evaluate childroute over next actions
            route = this.getRouteByPath(childPath.join('/'), r.childRoutes)
            if (route) return route
          } else if (childPath.length === 0) return route //last action and found route
        }
      }
    }
    return null
  }

  /**
   * @return {Params|boolean}
   */
  matchRoute(
    route: Route,
    prop: MatchingProp,
    matcher: Matcher,
    input: Input,
    session: Session,
    lastRoutePath: Nullable<string>
  ): any {
    /*
        prop: ('text' | 'payload' | 'intent' | 'type' | 'input' | 'session' | 'request' ...)
        matcher: (string: exact match | regex: regular expression match | function: return true)
        input: user input object, ex: {type: 'text', data: 'Hi'}
      */
    /** @type {any} */
    let value: any = null
    if (Object.keys(input).indexOf(prop) > -1) value = input[prop]
    else if (prop === 'input') value = input
    else if (prop === 'session') value = session
    else if (prop === 'request') value = { input, session, lastRoutePath }
    const matched = this.matchValue(matcher, value)
    if (matched) {
      this.routeInspector.routeMatched(route, prop, matcher, value)
    } else {
      this.routeInspector.routeNotMatched(route, prop, matcher, value)
    }
    return matched
  }

  matchValue(matcher: Matcher, value: any): boolean | RegExpExecArray | null {
    if (typeof matcher === 'string') return value === matcher
    if (matcher instanceof RegExp) {
      if (value === undefined || value === null) return false
      return matcher.exec(value)
    }
    if (typeof matcher === 'function') return matcher(value)
    return false
  }
}
