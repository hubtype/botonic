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

interface ComputedNextRoute {
  currentRoute: Route | null
  nextRoute: Route | null
  nextRoutePath: string | null
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

  getNextRouteFromPathPayload(
    lastRoutePath: string | null,
    pathPayload: string
  ): ComputedNextRoute {
    // TODO: Can flow be broken with __PATH_PAYLOAD__?
    const brokenFlow = false
    let nextRoute: Route | null = null
    let nextRoutePath: string | null = null
    const currentRoute = this.getRouteByPath(lastRoutePath, this.routes)
    /**
     * Given a valid path: 'Flow1/Subflow1' we are in one of the two scenarios below.
     */

    //  1. Received __PATH_PAYLOAD__Subflow2, so we need to first try to concatenate it with Flow1 (lastRoutePath)
    if (lastRoutePath) {
      nextRoute = this.getRouteByPath(`${lastRoutePath}/${pathPayload}`)
      if (nextRoute) {
        nextRoutePath = `${lastRoutePath}/${pathPayload}`
        return { currentRoute, nextRoute, nextRoutePath, brokenFlow }
      }
    }
    // 2. Received __PATH_PAYLOAD__Flow1/Subflow1, so we can resolve it directly
    nextRoute = this.getRouteByPath(pathPayload)
    if (nextRoute) {
      nextRoutePath = pathPayload
      return { currentRoute, nextRoute, nextRoutePath, brokenFlow }
    }
    return { currentRoute, nextRoute, nextRoutePath, brokenFlow }
  }

  getNextRoute(
    input: Input,
    session: Session,
    lastRoutePath: string | null
  ): ComputedNextRoute {
    let brokenFlow = false
    let nextRoute: Route | null = null
    let nextRoutePath: string | null = null
    const currentRoute = this.getRouteByPath(lastRoutePath, this.routes)
    if (currentRoute && currentRoute.childRoutes) {
      const routeParams = this.getRoute(
        input,
        currentRoute.childRoutes,
        session as Session,
        lastRoutePath
      )
      if (routeParams && routeParams.route && routeParams.route.path) {
        nextRoute = routeParams.route
        nextRoutePath = `${lastRoutePath}/${routeParams.route.path}`
      }
    }
    if (!nextRoute) {
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
        nextRoute = routeParams.route
        nextRoutePath = routeParams.route.path
          ? String(routeParams.route.path)
          : null
      }
    }

    return { currentRoute, nextRoute, nextRoutePath, brokenFlow }
  }

  newprocessInput(
    input: Input,
    session: Session,
    lastRoutePath: string | null = null
  ): ComputedAction {
    const { pathPayload, params } = this.getPathAndParamsFromPayloadInput(input)

    const resolveNextRoute = (): ComputedNextRoute => {
      if (!pathPayload) return this.getNextRoute(input, session, lastRoutePath)
      return this.getNextRouteFromPathPayload(lastRoutePath, pathPayload)
    }

    const {
      currentRoute,
      nextRoute,
      nextRoutePath,
      brokenFlow,
    } = resolveNextRoute()
    // Next route computation

    if (nextRoute && nextRoutePath !== '404') {
      session.__retries = 0
      if ('redirect' in nextRoute) {
        const redirectRoute = this.getRouteByPath(
          nextRoute.redirect as string,
          this.routes
        )
        if (!redirectRoute) {
          return this.computeNotFoundAction(input)
        }

        return this.computeRedirectAction(
          input,
          session,
          redirectRoute,
          nextRoute,
          nextRoutePath
        )
      }
      if (nextRoute && nextRoute.childRoutes) {
        if (!this.hasDefaultAction(nextRoute.childRoutes)) {
          return {
            action: nextRoute.action,
            params: undefined,
            lastRoutePath: nextRoutePath,
          }
        }
        return this.computeDefaultAction(
          input,
          session,
          nextRoute.childRoutes,
          nextRoutePath
        )
      }
      return {
        action: nextRoute.action,
        params: undefined,
        lastRoutePath: nextRoutePath,
      }
    }
    if (
      currentRoute &&
      currentRoute.retry &&
      // @ts-ignore
      session.__retries < currentRoute.retry
    ) {
      session.__retries = session.__retries ? session.__retries + 1 : 1
      return {
        action: currentRoute.action,
        params: undefined,
        lastRoutePath: currentRoute.path || null,
      }
    } else session.__retries = 0
    return this.computeNotFoundAction(input)
  }

  computeNotFoundAction(input: Input): ComputedAction {
    const notFound = this.getRouteByPath('404', this.routes)
    if (!notFound) throw new NoMatchingRouteError(input)
    return {
      action: notFound.action,
      params: undefined,
      lastRoutePath: null,
    }
  }

  hasDefaultAction(childRoutes: Route[]): boolean {
    return childRoutes && childRoutes.some(r => r.path === '')
  }

  computeDefaultAction(
    _input: Input,
    session: Session,
    defaultActionChildRoutes: Routes,
    nextRoutePath: string | null
  ): ComputedAction {
    const defaultActionRoute = this.getRoute(
      { path: '' },
      defaultActionChildRoutes,
      session as Session,
      nextRoutePath
    ) as RouteParams
    return {
      action: defaultActionRoute.route.action,
      params: undefined,
      lastRoutePath: nextRoutePath,
    }
  }

  computeRedirectAction(
    input: Input,
    session: Session,
    redirectRoute,
    nextRoute,
    nextRoutePath
  ): ComputedAction {
    nextRoutePath = nextRoute.redirect
    if (!this.hasDefaultAction(redirectRoute.childRoutes)) {
      return {
        action: redirectRoute.action,
        params: undefined,
        lastRoutePath: nextRoutePath,
      }
    }
    return this.computeDefaultAction(
      input,
      session,
      redirectRoute.childRoutes,
      nextRoutePath
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
