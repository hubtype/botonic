import * as url from 'url'
import { isBrowser, isNode } from './utils'

export class Router {
  constructor(routes) {
    this.routes = routes
  }

  processInput(input, session, lastRoutePath) {
    let path_params = Router.parseInputPath(input)
    let {routeParams, brokenFlow, lastRoute} = this.parseRoute(lastRoutePath, input, session, path_params)
    if (routeParams && Object.keys(routeParams).length) {
      let defaultAction = this.getActionFromChildRoutesIfNoPath(routeParams)
      if ('action' in routeParams.route) {
        let actionRoute = Router.processActionRoute(brokenFlow, routeParams, lastRoute, session, defaultAction, lastRoutePath)
        if (actionRoute) return actionRoute
      } else if (defaultAction) {
        return {
          action: defaultAction.route.action,
          params: defaultAction.params,
          lastRoutePath: lastRoutePath
        }
      } else if ('redirect' in routeParams.route) {
        lastRoutePath = routeParams.route.redirect
        let redirectRoute = this.getRouteByPath(lastRoutePath, this.routes)
        if (redirectRoute) {
          return {
            action: redirectRoute.action,
            params: redirectRoute.params,
            lastRoutePath: lastRoutePath
          }
        }
      }
    }
    return this.getNotFound(lastRoute, session, lastRoutePath);
  }

  getNotFound(lastRoute, session, lastRoutePath) {
    let notFound = this.getRouteByPath('404', this.routes)
    if (lastRoute && session.__retries < lastRoute.retry) {
      session.__retries = session.__retries ? session.__retries + 1 : 1
      return {
        action: notFound.action,
        params: {},
        retryAction: lastRoute.action,
        lastRoutePath: lastRoutePath
      }
    } else {
      this.lastRoutePath = null
      session.__retries = 0
      return {
        action: notFound.action,
        params: {},
        retryAction: null,
        lastRoutePath: lastRoutePath
      }
    }
  }

  getActionFromChildRoutesIfNoPath(routeParams) {
    let defaultAction
    if (
      !routeParams.route.path &&
      routeParams.route &&
      routeParams.route.childRoutes &&
      routeParams.route.childRoutes.length
    ) {
      defaultAction = this.getRoute(
        {path: ''},
        routeParams.route.childRoutes
      )
    }

    return defaultAction;
  }

  parseRoute(lastRoutePath, input, session, path_params) {
    let routeParams = {}
    let brokenFlow = false
    let lastRoute = this.getRouteByPath(lastRoutePath, this.routes)
    if (lastRoute && lastRoute.childRoutes)
      routeParams = this.getRoute(input, lastRoute.childRoutes)
    if (!routeParams || !Object.keys(routeParams).length) {
      /*
          we couldn't find a route in the state of the lastRoute, so let's find in
          the general conf.route
        */
      brokenFlow = Boolean(lastRoutePath)
      routeParams = this.getRoute(input, this.routes, session)
    }
    try {
      if (path_params.length > 1) {
        let searchParams = ''
        if (isBrowser()) searchParams = new URLSearchParams(path_params[1])
        if (isNode()) searchParams = new url.URLSearchParams(path_params[1])
        for (let [key, value] of searchParams) {
          routeParams.params
            ? (routeParams.params[key] = value)
            : (routeParams.params = { [key]: value })
        }
      }
    } catch (e) {}
    return { routeParams, brokenFlow, lastRoute };
  }

  static parseInputPath(input) {
    let pathParams
    try {
      pathParams = input.payload.split('__PATH_PAYLOAD__')[1].split('?')
      if (pathParams.length > 0) input.path = pathParams[0]
    } catch (e) {
    }
    return pathParams
  }

  static processActionRoute(
    brokenFlow,
    routeParams,
    lastRoute,
    session,
    defaultAction,
    lastRoutePath
  ) {
    if (
      brokenFlow &&
      routeParams.route.ignoreRetry != true &&
      lastRoute &&
      session.__retries < lastRoute.retry &&
      routeParams.route.path != lastRoute.action
    ) {
      session.__retries = session.__retries ? session.__retries + 1 : 1
      // The flow was broken, but we want to recover it
      return {
        action: routeParams.route.action,
        params: routeParams.params,
        retryAction: lastRoute ? lastRoute.action : null,
        defaultAction: defaultAction ? defaultAction.route.action : null,  //eslint-disable-line no-null/no-null
        lastRoutePath: lastRoutePath
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
        lastRoutePath: lastRoutePath
      }
    }
  }

  getRoute(input, routes, session) {
    /*
        Find the input throw the routes, if it match with some of the entries,
        return the hole Route of the entry with optional params (used in regEx)
      */
    let params = {}
    let route = routes.find(r =>
      Object.entries(r)
        .filter(([key, {}]) => key != 'action' && key != 'childRoutes')
        .some(([key, value]) => {
          let match = this.matchRoute(key, value, input, session)
          try {
            params = match.groups
          } catch (e) {}
          return Boolean(match)
        })
    )
    if (route) {
      return { route, params }
    }
    return null
  }

  getRouteByPath(path, routeList) {
    if (!path) return null
    let route = null
    routeList = routeList || this.routes
    let [currentPath, ...childPath] = path.split('/')
    for (let r of routeList) {
      if (r.path == currentPath) route = r
      if (r.childRoutes && r.childRoutes.length && childPath.length > 0) {
        //evaluate childroute over next actions
        route = this.getRouteByPath(childPath.join('/'), r.childRoutes)
        if (route) return route
      } else if (route) return route //last action and found route
    }
    return null
  }

  matchRoute(prop, matcher, input, session) {
    /*
        prop: ('text' | 'payload' | 'intent' | 'type' | 'input' | 'session' |...)
        matcher: (string: exact match | regex: regular expression match | function: return true)
        input: user input object, ex: {type: 'text', data: 'Hi'}
      */
    let value = ''
    if (Object.keys(input).indexOf(prop) > -1) value = input[prop]
    if (prop == 'text') {
      if (input.type == 'text') value = input.data
    } else if (prop == 'input') value = input
    else if (prop == 'session') value = session
    if (typeof matcher === 'string') return value == matcher
    if (matcher instanceof RegExp) return matcher.exec(value)
    if (typeof matcher === 'function') return matcher(value)
    return false
  }
}
