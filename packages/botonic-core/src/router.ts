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

type Action = Nullable<() => any>
type RoutePath = Nullable<string>

interface ProcessedInput {
  action: Action
  emptyAction: Action
  fallbackAction: Action
  lastRoutePath: RoutePath
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
  withAction(action: Action): this {
    if (action) this.processedInput.action = action
    return this
  }

  withEmptyAction(emptyAction: Action): this {
    if (emptyAction) this.processedInput.emptyAction = emptyAction
    return this
  }

  withFallbackAction(fallbackAction: Action): this {
    if (fallbackAction) this.processedInput.fallbackAction = fallbackAction
    return this
  }

  withLastRoutePath(lastRoutePath: RoutePath): this {
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
  previousRoutePath: RoutePath
  matchedRoute: Nullable<Route>
  matchedRoutePath: RoutePath
  params: Params
  isRetry: boolean
  isMatched: boolean
}

interface RouteParams {
  route: Nullable<Route>
  params: Params
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
    previousRoutePath: RoutePath,
    pathPayload: string
  ): RoutingState {
    let matchedRoute: Nullable<Route> = null
    let matchedRoutePath: RoutePath = null
    const pathParams = this.getPathParamsFromPathPayload(pathPayload)
    const getMatchedRouteByPath = (seekPath: string): RoutingState => {
      matchedRoute = this.getRouteByPath(seekPath)
      if (!matchedRoute) {
        return {
          previousRoute,
          previousRoutePath,
          matchedRoute,
          matchedRoutePath,
          params: {},
          isMatched: this.isMatched(matchedRoute, matchedRoutePath),
          isRetry: this.isRetry(true, session, previousRoute),
        }
      }
      matchedRoute = { ...matchedRoute }
      matchedRoutePath = seekPath
      return {
        previousRoute,
        previousRoutePath,
        matchedRoute,
        matchedRoutePath,
        params: this.pathParamsToParams(pathParams.params),
        isMatched: this.isMatched(matchedRoute, matchedRoutePath),
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
    previousRoutePath: RoutePath,
    input: Input,
    session: Session
  ): RoutingState {
    let matchedRoute: Nullable<Route> = null
    let matchedRoutePath: RoutePath = null
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
        if (routeParams.route) {
          matchedRoutePath = `${previousRoutePath}/${routeParams.route.path}`
        } else {
          matchedRoutePath = previousRoutePath
        }
      }
    }
    if (matchedRoute) {
      return {
        previousRoute,
        previousRoutePath,
        matchedRoute,
        matchedRoutePath,
        params,
        isMatched: this.isMatched(matchedRoute, matchedRoutePath),
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
      isMatched: this.isMatched(matchedRoute, matchedRoutePath),
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

  isMatched(
    matchedRoute: Nullable<Route>,
    matchedRoutePath: RoutePath
  ): boolean {
    if (!matchedRoute) return false
    if (matchedRoutePath === '404') return false
    return true
  }

  getRoutingState(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
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

  computeRetryProcessedInput(
    input: Input,
    session: Session,
    routingState: RoutingState
  ): ProcessedInput {
    const {
      previousRoute,
      previousRoutePath,
      matchedRoutePath,
      params,
      isMatched,
    } = routingState

    const processedInput = new ProcessedInputBuilder()
    if (isMatched) {
      const matchedRoute = routingState.matchedRoute as Route
      if (matchedRoute.ignoreRetry === true) {
        this.reinitializeRetries(session)
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

    return processedInput
      .withAction(previousRoute?.action ?? null)
      .withEmptyAction(this.getEmptyAction(previousRoute?.childRoutes))
      .withFallbackAction(
        routingState.matchedRoute?.action ?? this.getNotFoundAction(input)
      )
      .withLastRoutePath(previousRoutePath)
      .withParams(params)
      .build()
  }

  computeMatchedProcessedInput(
    input: Input,
    routingState: RoutingState
  ): ProcessedInput {
    const processedInput = new ProcessedInputBuilder()
    const matchedRoute = routingState.matchedRoute as Route
    const { previousRoutePath, matchedRoutePath, params } = routingState
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

  computeNotFoundProcessedInput(
    input: Input,
    routingState: RoutingState
  ): ProcessedInput {
    const { previousRoutePath, matchedRoute, params } = routingState
    const processedInput = new ProcessedInputBuilder()
    return processedInput
      .withFallbackAction(matchedRoute?.action ?? this.getNotFoundAction(input))
      .withLastRoutePath(previousRoutePath)
      .withParams(params)
      .build()
  }

  increaseRetries(session: Session): void {
    session.__retries = session.__retries !== 0 ? session.__retries + 1 : 1
  }

  reinitializeRetries(session: Session): void {
    session.__retries = 0
  }

  computeProcessedInput(
    input: Input,
    session: Session,
    routingState: RoutingState
  ): ProcessedInput {
    if (routingState.isRetry) {
      this.increaseRetries(session)
      return this.computeRetryProcessedInput(input, session, routingState)
    }

    this.reinitializeRetries(session)

    if (routingState.isMatched) {
      return this.computeMatchedProcessedInput(input, routingState)
    }

    return this.computeNotFoundProcessedInput(input, routingState)
  }

  processInput(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath = null
  ): ProcessedInput {
    session.__retries = session.__retries ?? 0
    const routingState = this.getRoutingState(input, session, lastRoutePath)
    return this.computeProcessedInput(input, session, routingState)
    // TODO: new return? input, session, lastRoutePath -> actions[{action, params}], lastRoutePath
  }

  getNotFoundAction(input: Input): Action {
    const notFoundActionRoute = this.getRouteByPath('404', this.routes)
    if (!notFoundActionRoute) throw new NoMatchingRouteError(input)
    return notFoundActionRoute.action
  }

  getEmptyAction(childRoutes?: Route[]): Action {
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
    lastRoutePath: RoutePath
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
    path: RoutePath,
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
    lastRoutePath: RoutePath
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
