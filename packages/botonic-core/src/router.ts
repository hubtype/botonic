import { NOT_FOUND_PATH } from './constants'
import { RouteInspector } from './debug/inspector'
import {
  Input,
  MatchedValue,
  Matcher,
  MatchingProp,
  Nullable,
  ProcessInputResult,
  Route,
  RouteParams,
  RoutePath,
  Routes,
  RoutingState,
  Session,
} from './models'
import {
  getEmptyAction,
  getNotFoundAction,
  getPathParamsFromPathPayload,
  isPathPayload,
  pathParamsToParams,
} from './routing/router-utils'
import { cloneObject, isFunction } from './utils'

export class Router {
  routes: Routes
  routeInspector: RouteInspector

  constructor(
    routes: Routes,
    routeInspector: RouteInspector | undefined = undefined
  ) {
    this.routes = routes
    this.routeInspector = routeInspector || new RouteInspector()
  }

  /**
   * Processes an input and return a representation of the new bot state.
   * The algorithm is splitted in two main parts:
   * 1. Getting the current routing state.
   * 2. Given a routing state, resolve the different possible scenarios and return the new bot state.
   * The new bot state can return three type of actions:
   * - action: an action directly resolved from a matching route
   * - emptyAction: optional action that can exists or not only within childRoutes
   * - fallbackAction: any other action that acts as a fallback (404, )
   */

  processInput(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath = null
  ): ProcessInputResult {
    session.__retries = session.__retries ?? 0

    // 1. Getting the current routing state.
    const {
      currentRoute,
      currentRoutePath,
      matchedRoute,
      matchedRoutePath,
      params,
      isFlowBroken,
    } = this.getRoutingState(input, session, lastRoutePath)

    // 2. Given a routing state, resolve the different possible scenarios and return the new bot state.

    /**
     * Redirect Scenario:
     * We have matched a redirect route with a given redirection path, so we try to obtain the redirectionRoute with getRouteByPath.
     * Independently of whether the redirectionRoute is found or not, the intent is to trigger a redirection which by definition breaks the flow, so retries are set to 0.
     * It has preference over ignoring retries.
     */
    if (matchedRoute && matchedRoute.redirect) {
      session.__retries = 0
      const redirectionRoute = this.getRouteByPath(
        matchedRoute.redirect,
        this.routes
      )
      if (redirectionRoute) {
        return {
          action: redirectionRoute.action,
          emptyAction: getEmptyAction(redirectionRoute.childRoutes),
          fallbackAction: null,
          lastRoutePath: matchedRoute.redirect,
          params,
        }
      }
      return {
        action: null,
        emptyAction: null,
        fallbackAction: getNotFoundAction(input, this.routes as Route[]),
        lastRoutePath: null,
        params,
      }
    }

    /**
     * Ignore Retry Scenario:
     * We have matched a route with an ignore retry, so we return directly the new bot state. The intent is to break the flow, so retries are set to 0.
     */
    if (matchedRoute && matchedRoute.ignoreRetry) {
      session.__retries = 0
      return {
        action: matchedRoute.action,
        emptyAction: getEmptyAction(matchedRoute.childRoutes),
        fallbackAction: null,
        lastRoutePath: matchedRoutePath,
        params,
      }
    }

    /**
     * Retry Scenario:
     * We were in a route which had retries enabled, so we check if the number of retries is exceeded.
     * If we have not surpassed the limit of retries and we haven't matched an ignoreRetry route, update them, and then return the new bot state.
     */
    if (
      isFlowBroken &&
      currentRoute &&
      currentRoute.retry &&
      session.__retries < currentRoute.retry
    ) {
      session.__retries = session.__retries !== 0 ? session.__retries + 1 : 1
      if (matchedRoute && matchedRoutePath !== NOT_FOUND_PATH) {
        return {
          action: currentRoute.action,
          emptyAction: getEmptyAction(matchedRoute.childRoutes),
          fallbackAction: matchedRoute.action,
          lastRoutePath: currentRoutePath,
          params,
        }
      }
      return {
        action: currentRoute.action ?? null,
        emptyAction: getEmptyAction(currentRoute.childRoutes),
        fallbackAction: getNotFoundAction(input, this.routes as Route[]),
        lastRoutePath: currentRoutePath,
        params,
      }
    }

    /**
     * Default Scenario:
     * We have matched a route or not, but we don't need to execute retries logic, so retries stay to 0.
     */
    session.__retries = 0

    /**
     * Matching Route Scenario:
     * We have matched a route, so we return the new bot state.
     */
    if (matchedRoute && matchedRoutePath !== NOT_FOUND_PATH) {
      return {
        action: matchedRoute.action ?? null,
        emptyAction: getEmptyAction(matchedRoute.childRoutes),
        fallbackAction: null,
        lastRoutePath: matchedRoutePath,
        params,
      }
    }

    /**
     * 404 Scenario (No Route Found):
     * We have not matched any route, so we return the new bot state.
     */
    return {
      action: null,
      emptyAction: null,
      fallbackAction: getNotFoundAction(input, this.routes as Route[]),
      params,
      lastRoutePath: currentRoutePath,
    }
  }

  /**
   * Find the route that matches the given input, if it match with some of the entries, return the whole Route of the entry with optional params captured if matcher was a regex.
   * IMPORTANT: It returns a cloned route instead of the route itself to avoid modifying original routes and introduce side effects
   * */
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
    if (route) return { route: cloneObject(route), params }
    return null
  }

  /**
   * Find the route that matches the given path. Path can include concatenations, e.g: 'Flow1/Subflow1.1'.
   * IMPORTANT: It returns a cloned route instead of the route itself to avoid modifying original routes and introduce side effects
   * */
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
            // IMPORTANT: Returning a new object to avoid modifying dev routes and introduce side effects
            if (route) return cloneObject(route)
          } else if (childPath.length === 0) return cloneObject(route) //last action and found route
        }
      }
    }
    return null
  }

  /**
   * Returns the matched value for a specific route.
   * Matching Props: ('text' | 'payload' | 'intent' | 'type' | 'input' | 'session' | 'request' ...)
   * Matchers: (string: exact match | regex: regular expression match | function: return true)
   * input: user input object, e.g.: {type: 'text', data: 'Hi'}
   * */
  matchRoute(
    route: Route,
    prop: MatchingProp,
    matcher: Matcher,
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
  ): MatchedValue {
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

  /**
   * Runs the matcher against the given value.
   * If there is a match, it will return a truthy value (true, RegExp result), o.w., it will return a falsy value.
   * */
  matchValue(matcher: Matcher, value: any): MatchedValue {
    if (typeof matcher === 'string') return value === matcher
    if (matcher instanceof RegExp) {
      if (value === undefined || value === null) return false
      return matcher.exec(value)
    }
    if (typeof matcher === 'function') return matcher(value)
    return false
  }

  /**
   * It resolves the current state of navigation. Two scenarios:
   * 1. Given a path payload input (__PATH_PAYLOAD__somePath?someParam=someValue), we can resolve the routing state directly from it (using getRouteByPath).
   * 2. Given any other type of input, we resolve the routing state with normal resolution (using getRoute).
   * */
  getRoutingState(
    input: Input,
    session: Session,
    lastRoutePath: RoutePath
  ): RoutingState {
    const currentRoute = this.getRouteByPath(lastRoutePath, this.routes)
    const currentRoutePath = lastRoutePath
    if (isPathPayload(input.payload)) {
      return this.getRoutingStateFromPathPayload(
        currentRoute,
        currentRoutePath,
        input.payload as string
      )
    }
    return this.getRoutingStateFromInput(
      currentRoute,
      currentRoutePath,
      input,
      session
    )
  }

  /**
   * Given a non path payload input, try to run it against the routes, update matching routes information in consequence and dictamine if the flow has been broken.
   * */
  getRoutingStateFromInput(
    currentRoute: Nullable<Route>,
    currentRoutePath: RoutePath,
    input: Input,
    session: Session
  ): RoutingState {
    // get route depending of current ChildRoutes
    if (currentRoute && currentRoute.childRoutes) {
      const routeParams = this.getRoute(
        input,
        currentRoute.childRoutes,
        session,
        currentRoutePath
      )
      if (routeParams) {
        return {
          currentRoute,
          currentRoutePath,
          matchedRoute: routeParams.route,
          matchedRoutePath: routeParams.route
            ? `${currentRoutePath}/${routeParams.route.path}`
            : currentRoutePath,
          params: routeParams.params,
          isFlowBroken: false,
        }
      }
    }
    /**
     * we couldn't find a route in the state of the currentRoute childRoutes,
     * so let's find in the general routes
     */
    const routeParams = this.getRoute(
      input,
      this.routes,
      session,
      currentRoutePath
    )
    const isFlowBroken = !currentRoutePath ? false : true
    if (routeParams) {
      return {
        currentRoute,
        currentRoutePath,
        matchedRoute: routeParams.route,
        matchedRoutePath: routeParams.route?.path ?? null,
        params: routeParams.params,
        isFlowBroken,
      }
    }
    return {
      currentRoute,
      currentRoutePath,
      matchedRoute: null,
      matchedRoutePath: null,
      params: {},
      isFlowBroken,
    }
  }

  /**
   * Given a path payload input, try to run the path against the routes, update matching routes information in consequence and dictamine if the flow has been broken.
   * */
  getRoutingStateFromPathPayload(
    currentRoute: Nullable<Route>,
    currentRoutePath: RoutePath,
    pathPayload: string
  ): RoutingState {
    const { path, params } = getPathParamsFromPathPayload(pathPayload)

    /**
     * shorthand function to update the matching information given a path
     */
    const getRoutingStateFromPath = (seekPath: string): RoutingState => {
      const matchedRoute = this.getRouteByPath(seekPath)

      if (!matchedRoute) {
        return {
          currentRoute,
          currentRoutePath,
          matchedRoute: null,
          matchedRoutePath: null,
          params: {},
          isFlowBroken: true,
        }
      }

      return {
        currentRoute,
        currentRoutePath,
        matchedRoute,
        matchedRoutePath: seekPath,
        params: pathParamsToParams(params),
        isFlowBroken: false,
      }
    }
    /**
     * Given a valid path: 'Flow1/Subflow1' we are in one of the two scenarios below.
     */
    //  1. Received __PATH_PAYLOAD__Subflow2, so we need to first try to concatenate it with Flow1 (lastRoutePath)
    if (currentRoutePath) {
      const routingState = getRoutingStateFromPath(
        `${currentRoutePath}/${path}`
      )
      if (routingState.matchedRoute) return routingState
    }
    // 2. Received __PATH_PAYLOAD__Flow1/Subflow1, so we can resolve it directly
    return getRoutingStateFromPath(path as string)
  }
}
