import { RouteInspector } from './debug/inspector'
import { Input, Route, Routes, Session } from './models'
import { isFunction } from './utils'

export class NoMatchingRouteError extends Error {
  input: Input
  constructor(input: Input) {
    super(
      `No route found for input '${String(input)}' and no 404 route defined`
    )
    this.input = input
  }
}

interface ComputedAction {
  action: string
  params: any
  lastRoutePath: string | null
}

interface RouterState {
  matchedRoute: Route | null
  matchedRoutePath: string | null
  brokenFlow: boolean
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

  // eslint-disable-next-line complexity
  processInput(
    input: Input,
    session: Partial<Session> = {},
    lastRoutePath: string | null = null
  ): any {
    let routeParams: any = {}
    if (input.payload && input.payload.includes('__PATH_PAYLOAD__')) {
      const pathParam = input.payload.split('__PATH_PAYLOAD__')
      routeParams.route = this.getRouteByPath(pathParam[1], this.routes)
    }
    const pathParams = this.getPathAndParamsFromPayloadInput(input)
    let brokenFlow = false
    const lastRoute = this.getRouteByPath(lastRoutePath, this.routes)
    if (!lastRoute && input.path)
      routeParams.route = this.getRouteByPath(input.path, this.routes)
    if (lastRoute && lastRoute.childRoutes && !routeParams.route)
      //get route depending of current ChildRoute
      routeParams = this.getRoute(
        input,
        lastRoute.childRoutes,
        session as Session,
        lastRoutePath
      )
    if (!routeParams || !Object.keys(routeParams).length) {
      /*
          we couldn't find a route in the state of the lastRoute, so let's find in
          the general conf.route
        */
      brokenFlow = Boolean(lastRoutePath)
      routeParams = this.getRoute(
        input,
        this.routes,
        session as Session,
        lastRoutePath
      )
    }
    try {
      if (pathParams) {
        const searchParams = new URLSearchParams(pathParams)
        for (const [key, value] of searchParams) {
          routeParams.params
            ? (routeParams.params[key] = value)
            : (routeParams.params = { [key]: value })
        }
      }
    } catch (e) {}
    if (routeParams && Object.keys(routeParams).length) {
      //get in childRoute if one has path ''
      let defaultAction
      if (routeParams.route) {
        if (
          routeParams.route.childRoutes &&
          routeParams.route.childRoutes.length
        ) {
          defaultAction = this.getRoute(
            { path: '' },
            routeParams.route.childRoutes,
            session as Session,
            lastRoutePath
          )
        }
        if ('action' in routeParams.route) {
          if (
            brokenFlow &&
            routeParams.route.ignoreRetry != true &&
            lastRoute &&
            (session.__retries || 0) < (lastRoute.retry || 0) &&
            routeParams.route.path != lastRoute.action
          ) {
            session.__retries = session.__retries ? session.__retries + 1 : 1
            // The flow was broken, but we want to recover it
            return {
              action: routeParams.route.action,
              params: routeParams.params,
              retryAction: lastRoute ? lastRoute.action : null,
              defaultAction: defaultAction ? defaultAction.route.action : null,
              lastRoutePath: lastRoutePath,
            }
          } else {
            session.__retries = 0
            if (lastRoutePath && !brokenFlow)
              lastRoutePath = `${lastRoutePath}/${routeParams.route.path}`
            else lastRoutePath = routeParams.route.path
            return {
              action: routeParams.route.action,
              params: routeParams.params,
              retryAction: null,
              defaultAction: defaultAction ? defaultAction.route.action : null,
              lastRoutePath: lastRoutePath,
            }
          }
        } else if (defaultAction) {
          return {
            action: defaultAction.route.action,
            params: defaultAction.params,
            lastRoutePath: lastRoutePath,
          }
        } else if ('redirect' in routeParams.route) {
          lastRoutePath = routeParams.route.redirect
          const redirectRoute = this.getRouteByPath(lastRoutePath, this.routes)
          if (redirectRoute) {
            return {
              action: redirectRoute.action,
              params: redirectRoute.params,
              lastRoutePath: lastRoutePath,
            }
          }
        }
      }
    }
    const notFound = this.getRouteByPath('404', this.routes)
    if (!notFound) throw new NoMatchingRouteError(input)
    if (lastRoute && (session.__retries || 0) < (lastRoute.retry || 0)) {
      session.__retries = session.__retries ? session.__retries + 1 : 1
      return {
        action: notFound.action,
        params: {},
        retryAction: lastRoute.action,
        lastRoutePath: lastRoutePath,
      }
    } else {
      session.__retries = 0
      return {
        action: notFound.action,
        params: {},
        retryAction: null,
        lastRoutePath: lastRoutePath,
      }
    }
  }

  getMatchedRouteFromPathPayload(
    lastRoutePath: string | null,
    pathPayload: string
  ): RouterState {
    // TODO: Can flow be broken with __PATH_PAYLOAD__?
    const brokenFlow = false
    let matchedRoute: Route | null = null
    let matchedRoutePath: string | null = null
    /**
     * Given a valid path: 'Flow1/Subflow1' we are in one of the two scenarios below.
     */
    //  1. Received __PATH_PAYLOAD__Subflow2, so we need to first try to concatenate it with Flow1 (lastRoutePath)
    if (lastRoutePath) {
      matchedRoute = this.getRouteByPath(`${lastRoutePath}/${pathPayload}`)
      if (matchedRoute) {
        matchedRoutePath = `${lastRoutePath}/${pathPayload}`
        return { matchedRoute, matchedRoutePath, brokenFlow }
      }
    }
    // 2. Received __PATH_PAYLOAD__Flow1/Subflow1, so we can resolve it directly
    matchedRoute = this.getRouteByPath(pathPayload)
    if (matchedRoute) {
      matchedRoutePath = pathPayload
      return { matchedRoute, matchedRoutePath, brokenFlow }
    }
    return { matchedRoute, matchedRoutePath, brokenFlow }
  }

  getMatchedRouteFromInput(
    input: Input,
    session: Session,
    lastRoutePath: string | null,
    previousRoute: Route | null
  ): RouterState {
    let brokenFlow = false
    let matchedRoute: Route | null = null
    let matchedRoutePath: string | null = null

    if (previousRoute && previousRoute.childRoutes) {
      const routeParams = this.getRoute(
        input,
        previousRoute.childRoutes,
        session as Session,
        lastRoutePath
      )
      if (routeParams && routeParams.route && routeParams.route.path) {
        matchedRoute = routeParams.route
        matchedRoutePath = `${lastRoutePath}/${routeParams.route.path}`
      }
    }
    return { matchedRoute, matchedRoutePath, brokenFlow }
  }

  getRouterState(input, session, lastRoutePath) {
    const previousRoute = this.getRouteByPath(lastRoutePath, this.routes)
    const { pathPayload, params } = this.getPathAndParamsFromPayloadInput(input)

    let { matchedRoute, matchedRoutePath, brokenFlow } = pathPayload
      ? this.getMatchedRouteFromPathPayload(lastRoutePath, pathPayload)
      : this.getMatchedRouteFromInput(
          input,
          session,
          lastRoutePath,
          previousRoute
        )

    if (!matchedRoute) {
      /**
       * we couldn't find a route in the state of the lastRoutePath,
       * so let's find in the general routes
       */
      const routeParams = this.getRoute(
        input,
        this.routes,
        session as Session,
        lastRoutePath
      )
      brokenFlow = true
      if (routeParams && routeParams.route) {
        matchedRoute = routeParams.route
        matchedRoutePath = routeParams.route.path
          ? String(routeParams.route.path)
          : null
      }
    }
    return { previousRoute, matchedRoute, matchedRoutePath, brokenFlow }
  }

  newprocessInput(
    input: Input,
    session: Session,
    lastRoutePath: string | null = null
  ): ComputedAction | any {
    const {
      previousRoute,
      matchedRoute,
      matchedRoutePath,
      brokenFlow,
    } = this.getRouterState(input, session, lastRoutePath)

    // Next route computation
    if (matchedRoute && matchedRoutePath !== '404') {
      if ('__retries' in session) {
        delete session.__retries
      }
      if ('redirect' in matchedRoute) {
        const redirectRoute = this.getRouteByPath(
          matchedRoute.redirect as string,
          this.routes
        )
        if (!redirectRoute) {
          return this.getNotFoundAction(input, lastRoutePath)
        }
        return this.getRedirectAction(
          input,
          session,
          redirectRoute,
          matchedRoute,
          matchedRoutePath
        )
      }
      if (matchedRoute && matchedRoute.childRoutes) {
        if (!this.hasEmptyAction(matchedRoute.childRoutes)) {
          return {
            action: matchedRoute.action,
            params: undefined,
            lastRoutePath: matchedRoutePath,
          }
        }
        return this.getEmptyAction(
          input,
          session,
          matchedRoute.childRoutes,
          matchedRoutePath
        )
      }
      return {
        action: matchedRoute.action,
        params: undefined,
        lastRoutePath: matchedRoutePath,
      }
    }

    if (previousRoute && previousRoute.retry) {
      if (!('__retries' in session)) {
        session.__retries = 0
      }
      if ((session as any).__retries < previousRoute.retry) {
        session.__retries = session.__retries ? session.__retries + 1 : 1
        const notFoundAction = this.getNotFoundAction(input, lastRoutePath)
        if (!this.hasEmptyAction(previousRoute.childRoutes)) {
          return {
            fallbackAction: notFoundAction.action,
            action: previousRoute.action,
            params: undefined,
            lastRoutePath,
          }
        }
        const defaultAction = this.getEmptyAction(
          input,
          session,
          previousRoute.childRoutes as Routes,
          previousRoute.path as string
        )
        return {
          fallbackAction: notFoundAction.action,
          action: defaultAction.action,
          params: undefined,
          lastRoutePath,
        }
      } else {
        delete session.__retries
      }
    }

    return this.getNotFoundAction(input, lastRoutePath)
    // input, session, lastRoutePath -> actions[{action, params}], lastRoutePath
  }

  getNotFoundAction(
    input: Input,
    lastRoutePath: string | null
  ): ComputedAction {
    const notFound = this.getRouteByPath('404', this.routes)
    if (!notFound) throw new NoMatchingRouteError(input)
    return {
      action: notFound.action,
      params: undefined,
      lastRoutePath,
    }
  }

  hasEmptyAction(childRoutes?: Route[]): boolean {
    if (!childRoutes) return false
    return childRoutes.some(r => r.path === '')
  }

  getEmptyAction(
    _input: Input,
    session: Session,
    defaultActionChildRoutes: Routes,
    matchedRoutePath: string | null
  ): ComputedAction {
    const defaultActionRoute = this.getRoute(
      { path: '' },
      defaultActionChildRoutes,
      session as Session,
      matchedRoutePath
    ) as RouteParams
    return {
      action: defaultActionRoute.route.action,
      params: undefined,
      lastRoutePath: matchedRoutePath,
    }
  }

  getRedirectAction(
    input: Input,
    session: Session,
    redirectRoute,
    matchedRoute,
    matchedRoutePath
  ): ComputedAction {
    matchedRoutePath = matchedRoute.redirect
    if (!this.hasEmptyAction(redirectRoute.childRoutes)) {
      return {
        action: redirectRoute.action,
        params: undefined,
        lastRoutePath: matchedRoutePath,
      }
    }
    return this.getEmptyAction(
      input,
      session,
      redirectRoute.childRoutes,
      matchedRoutePath
    )
  }

  getPathAndParamsFromPayloadInput(input: Input): any {
    try {
      if (!input.payload) {
        throw 'input.payload is not defined'
      }
      const isValidPathPayload = /^__PATH_PAYLOAD__(.*)/.exec(input.payload)
      if (!isValidPathPayload) {
        throw 'input.payload does not match the expected format'
      }
      const pathWithParams = input.payload.split('__PATH_PAYLOAD__')[1]
      if (!pathWithParams) {
        throw '__PATH_PAYLOAD__ is empty'
      }
      const [path, params] = pathWithParams.split('?')
      return { pathPayload: path ? path : null, params }
    } catch (e) {
      // console.error('Error getting path and params from input.payload:', e)
      return {
        pathPayload: null,
        params: undefined,
      }
    }
  }

  /**
   * @return {null|RouteParams}
   */
  getRoute(
    input: Input | Partial<Input>,
    routes: Routes,
    session: Session,
    lastRoutePath: string | null
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
        .filter(([key, _]) => key != 'action' && key != 'childRoutes')
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
            params = (match as any).groups
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
    path: string | null,
    routeList: Routes | null = null
  ): Route | null {
    if (!path) return null
    let route: Route | null = null
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
    lastRoutePath: string | null
  ): boolean {
    /*
        prop: ('text' | 'payload' | 'intent' | 'type' | 'input' | 'session' | 'request' ...)
        matcher: (string: exact match | regex: regular expression match | function: return true)
        input: user input object, ex: {type: 'text', data: 'Hi'}
      */
    /** @type {any} */
    let value: any = null
    if (Object.keys(input).indexOf(prop) > -1) value = input[prop]
    if (prop === 'input') value = input
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

  /**
   *
   * @return {*|boolean|Params}
   */
  matchValue(
    matcher: string | RegExp | ((args) => boolean),
    value: any
  ): boolean {
    if (typeof matcher === 'string') {
      return value === matcher
    }
    if (matcher instanceof RegExp) {
      // check if undefined to avoid conversion to 'undefined'
      if (value === undefined) {
        return false
      }
      return Boolean(matcher.exec(value))
    }
    if (typeof matcher === 'function') {
      return matcher(value)
    }
    return false
  }
}
