import { Action, Input, Params, PathParams, Route } from '../models'

export const NOT_FOUND_PATH = '404'

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
  const isPathPayload = /^__PATH_PAYLOAD__(.*)/.exec(payload)
  return Boolean(isPathPayload)
}

export function getPathParamsFromPathPayload(payload?: string): PathParams {
  const defaultPathParams = {
    path: null,
    params: undefined,
  }
  if (!payload) return defaultPathParams
  if (!isPathPayload(payload)) return defaultPathParams
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
  const emptyActionRoute = childRoutes.find(r => r.path === '')
  if (!emptyActionRoute) return null
  return emptyActionRoute.action
}

export function getNotFoundAction(input: Input, routes: Route[]): Action {
  const notFoundActionRoute = routes.find(r => r.path === NOT_FOUND_PATH)
  if (!notFoundActionRoute) throw new NoMatchingRouteError(input)
  return notFoundActionRoute.action
}
