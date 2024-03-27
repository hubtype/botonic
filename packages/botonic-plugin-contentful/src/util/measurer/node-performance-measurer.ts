import { PerformanceMeasurer } from './performance-measurer'

class PerformanceFactory {
  static getPerformance(): Performance {
    try {
      return performance
    } catch {
      //TODO: investigate why a normal require breaks the bot when compiling with webpack
      //To solve the issue we're executing eval('require') instead of using a direct require (https://stackoverflow.com/a/67288823/3982733)
      return eval('require')('perf_hooks').performance
    }
  }
  static getObserver(): typeof PerformanceObserver {
    try {
      return PerformanceObserver
    } catch {
      //TODO: investigate why a normal require breaks the bot when compiling with webpack
      //To solve the issue we're executing eval('require') instead of using a direct require (https://stackoverflow.com/a/67288823/3982733)
      return eval('require')('perf_hooks').PerformanceObserver
    }
  }
}
export class NodePerformanceMeasurer extends PerformanceMeasurer {
  private performanceObserver?: PerformanceObserver

  constructor() {
    super(PerformanceFactory.getPerformance())
  }

  enable(): void {
    if (this.enabled) {
      return
    }
    super.enable()
    const ObsClass = PerformanceFactory.getObserver()
    this.performanceObserver = new ObsClass(list => {
      list.getEntries().forEach(measure => {
        if (!this.allProfiled[measure.name]) {
          this.allProfiled[measure.name] = [measure]
        } else {
          this.allProfiled[measure.name].push(measure)
        }
      })
    })

    this.performanceObserver!.observe({ entryTypes: ['measure'] })
  }

  disable() {
    super.disable()
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }
  }

  getEntriesByName(name: string): PerformanceEntry[] {
    return this.allProfiled[name]
  }
}
