// @ts-nocheck
export class NoMatchingRouteError extends Error {
  constructor(input) {
    super(
      `No route found for input '${String(input)}' and no 404 route defined`
    )
    this.input = input
  }
}
