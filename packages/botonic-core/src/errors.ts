import { Input } from './index'

export class NoMatchingRouteError extends Error {
  input: Input
  constructor(input: Input) {
    super(
      `No route found for input '${String(input)}' and no 404 route defined`
    )
    this.input = input
  }
}
