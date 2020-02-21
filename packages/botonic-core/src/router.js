import * as url from 'url'
import { isBrowser, isNode, isFunction } from './utils'
import { RouteInspector } from './debug/inspector'

export class Router {
  constructor(routes, routeInspector = undefined) {
    this.routes = routes
    this.routeInspector = routeInspector || new RouteInspector()
  }

  processInput(input, session = {}, lastRoutePath = null) {
    let routeParams = {}
    const pathParams = this.getOnFinishParams(input)
    let brokenFlow = false
    const lastRoute = this.getRouteByPath(lastRoutePath, this.routes)
    if (lastRoute && lastRoute.childRoutes)
      //get route depending of current ChildRoute
      routeParams = this.getRoute(input, lastRoute.childRoutes, session)
    if (!routeParams || !Object.keys(routeParams).length) {
      /*
          we couldn't find a route in the state of the lastRoute, so let's find in
          the general conf.route
        */
      brokenFlow = Boolean(lastRoutePath)
      routeParams = this.getRoute(input, this.routes, session)
    }
    try {
      if (pathParams) {
        let searchParams = ''
        if (isBrowser()) searchParams = new URLSearchParams(pathParams)
        if (isNode()) searchParams = new url.URLSearchParams(pathParams)
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
      if (
        !routeParams.route.path &&
        routeParams.route &&
        routeParams.route.childRoutes &&
        routeParams.route.childRoutes.length
      ) {
        defaultAction = this.getRoute(
          { path: '' },
          routeParams.route.childRoutes,
          session
        )
      }
      if ('action' in routeParams.route) {
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
    const notFound = this.getRouteByPath('404', this.routes)
    if (lastRoute && session.__retries < lastRoute.retry) {
      session.__retries = session.__retries ? session.__retries + 1 : 1
      return {
        action: notFound.action,
        params: {},
        retryAction: lastRoute.action,
        lastRoutePath: lastRoutePath,
      }
    } else {
      this.lastRoutePath = null
      session.__retries = 0
      return {
        action: notFound.action,
        params: {},
        retryAction: null,
        lastRoutePath: lastRoutePath,
      }
    }
  }

  getOnFinishParams(input) {
    try {
      const pathParams = input.payload.split('__PATH_PAYLOAD__')[1].split('?')
      if (pathParams.length > 0) {
        input.path = pathParams[0]
        delete input.payload
      }
      if (pathParams.length > 1) {
        return pathParams[1]
      }
    } catch (e) {
      return undefined
    }
  }

  getRoute(input, routes, session) {
    const computedRoutes = isFunction(routes)
      ? routes({ input, session })
      : routes
    /* Find the route that matches the given input, if it match with some of the entries,
      return the whole Route of the entry with optional params captured if matcher was a regex */
    let params = {}
    const route = computedRoutes.find(r =>
      Object.entries(r)
        .filter(([key, {}]) => key != 'action' && key != 'childRoutes')
        .some(([key, value]) => {
          const match = this.matchRoute(r, key, value, input, session)
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
    const [currentPath, ...childPath] = path.split('/')
    for (const r of routeList) {
      //iterate over all routeList
      if (r.path == currentPath) {
        route = r
        if (r.childRoutes && r.childRoutes.length && childPath.length > 0) {
          //evaluate childroute over next actions
          route = this.getRouteByPath(childPath.join('/'), r.childRoutes)
          if (route) return route
        } else if (childPath.length == 0) return route //last action and found route
      }
    }
    return null
  }

  matchRoute(route, prop, matcher, input, session) {
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
    const matched = this.matchValue(matcher, value)
    if (matched) {
      this.routeInspector.routeMatched(route, prop, matcher, value)
    } else {
      this.routeInspector.routeNotMatched(route, prop, matcher, value)
    }
    return matched
  }

  matchValue(matcher, value) {
    if (typeof matcher === 'string') {
      return value == matcher
    }
    if (matcher instanceof RegExp) {
      // check if undefined to avoid conversion to 'undefined'
      if (value === undefined) {
        return false
      }
      return matcher.exec(value)
    }
    if (typeof matcher === 'function') {
      return matcher(value)
    }
    return false
  }
}
