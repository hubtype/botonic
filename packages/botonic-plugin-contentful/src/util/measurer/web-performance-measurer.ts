import { PerformanceMeasurer } from './performance-measurer'

export class WebPerformanceMeasurer extends PerformanceMeasurer {
  constructor() {
    super(performance)
  }

  getEntriesByName(name: string): PerformanceEntry[] {
    return this.perf.getEntriesByName(name)
  }

  end(mark: string, name: string) {
    super.end(mark, name)
    if (this.enabled) {
      this.allProfiled[name] = []
    }
  }

  clear() {
    super.clear()
    this.perf.clearMarks()
  }
}
