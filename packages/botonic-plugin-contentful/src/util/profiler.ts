import { NodePerformanceMeasurer } from './measurer/node-performance-measurer'
import { PerformanceMeasurer } from './measurer/performance-measurer'
import { WebPerformanceMeasurer } from './measurer/web-performance-measurer'

export const isBrowser = () => {
  // @ts-ignore
  return typeof IS_BROWSER !== 'undefined'
    ? // eslint-disable-next-line no-undef
      // @ts-ignore
      IS_BROWSER
    : typeof window !== 'undefined' &&
        typeof window.document !== 'undefined' &&
        !window.process
}

export class Profiler {
  static performanceMeasurer: PerformanceMeasurer = isBrowser()
    ? new WebPerformanceMeasurer()
    : new NodePerformanceMeasurer()

  /**
   * disables any profiling logic
   */
  static isEnabled(): boolean {
    return Profiler.performanceMeasurer.isEnabled()
  }

  /**
   * disables any profiling logic
   */
  static disable() {
    Profiler.performanceMeasurer.disable()
  }

  /**
   * enables profiling logic
   */
  static enable() {
    Profiler.performanceMeasurer.enable()
  }

  /**
   * get a pretty summary of your profiling
   */
  static getSummaryAll(): string {
    return Profiler.performanceMeasurer.stringSummaryAll()
  }

  /**
   * get a pretty summary 1 profiling
   */
  static getSummary(name: string): string {
    return Profiler.performanceMeasurer.stringSummary(name)
  }

  static getCallCount(name: string): number {
    return Profiler.performanceMeasurer.callCount(name)
  }

  /**
   * clear all measurements
   */
  static clear() {
    return Profiler.performanceMeasurer.clear()
  }

  /**
   * annotation for a typescript class member
   * @constructor
   */
  static Profile(customName?: string) {
    return function (
      _target: any,
      _propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const f = descriptor.value
      const newF = Profiler.profiledFunction(f, customName)
      // @ts-ignore
      descriptor.value = function (...args) {
        return newF.apply(this, args)
      }
      return descriptor
    }
  }

  /**
   * creates a profiled function
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  static profiledFunction(f: Function, customName?: string) {
    const name: string = customName || f.name
    // @ts-ignore
    return function (...args) {
      const m = new Measure(name)
      // @ts-ignore
      const res = f.apply(this, args)
      m.end()
      return res
    }
  }
}

export class Measure {
  static lastUuid = 0
  private readonly uuid
  public readonly name

  constructor(name: string) {
    this.name = (name || '<NO_NAME>').substr(0, 40)
    this.uuid = this.name + String(Measure.lastUuid++)
    Profiler.performanceMeasurer.start(this.uuid)
  }

  end<T = undefined>(passthrough?: T): T {
    Profiler.performanceMeasurer.end(this.uuid, this.name)
    return passthrough as T
  }
}
