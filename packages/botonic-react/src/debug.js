import { RouteInspector } from '@botonic/core'

export class Inspector {
  constructor(routeInspector = undefined) {
    this.routeInspector = routeInspector || new RouteInspector()
  }

  getRouteInspector() {
    return this.routeInspector
  }
}
