import {
  EMPTY_ACTION_PATH,
  NOT_FOUND_PATH,
  PATH_PAYLOAD_IDENTIFIER,
  PATH_PAYLOAD_REGEXP,
} from '../constants'
import {
  Action,
  BotRequest,
  Input,
  Params,
  PathParams,
  Route,
  Routes,
} from '../models'

export class NoMatchingRouteError extends Error {
  input: Input
  constructor(input: Input) {
    super(
      `No route found for input '${JSON.stringify(
        input
      )}' and no ${NOT_FOUND_PATH} route defined`
    )
    this.input = input
  }
}

export function isPathPayload(payload?: string): boolean {
  if (!payload) return false
  const isPathPayload = PATH_PAYLOAD_REGEXP.exec(payload)
  return Boolean(isPathPayload)
}

export function getPathParamsFromPathPayload(payload?: string): PathParams {
  const defaultPathParams = {
    path: null,
    params: {},
  }
  if (!payload) return defaultPathParams
  if (!isPathPayload(payload)) return defaultPathParams
  try {
    const pathWithParams = payload.split(PATH_PAYLOAD_IDENTIFIER)[1]
    if (!pathWithParams) {
      throw `${PATH_PAYLOAD_IDENTIFIER} is empty`
    }
    const [path, params] = pathWithParams.split('?')
    return { path: path ?? null, params: pathParamsToParams(params) }
  } catch (e) {
    console.error('Error getting path and params from input.payload:', e)
    return defaultPathParams
  }
}

export function pathParamsToParams(pathParams?: string): Params {
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

export function getEmptyAction(childRoutes?: Route[]): Action {
  if (!childRoutes) return null
  const emptyActionRoute = childRoutes.find(r => r.path === EMPTY_ACTION_PATH)
  if (!emptyActionRoute) return null
  return emptyActionRoute.action
}

export function getNotFoundAction(input: Input, routes: Route[]): Action {
  const notFoundActionRoute = routes.find(r => r.path === NOT_FOUND_PATH)
  if (!notFoundActionRoute) throw new NoMatchingRouteError(input)
  return notFoundActionRoute.action
}

export async function getComputedRoutes(
  routes: Routes,
  request: BotRequest
): Promise<Route[]> {
  if (routes instanceof Function) {
    return await getComputedRoutes(await routes(request), request)
  }
  for (const [key, route] of Object.entries(routes) as any) {
    if (route.childRoutes && route.childRoutes instanceof Function) {
      routes[key].childRoutes = await getComputedRoutes(
        await route.childRoutes(request),
        request
      )
    } else {
      routes[key] = route
    }
  }
  return routes
}
