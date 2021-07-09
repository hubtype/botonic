/* eslint-disable @typescript-eslint/restrict-plus-operands*/
export abstract class PerformanceMeasurer {
  protected enabled = false
  protected allProfiled: { [key: string]: PerformanceEntry[] } = {}
  private static STATS_PAD = 8

  protected constructor(protected perf: Performance) {}

  public enable(): void {
    this.enabled = true
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public disable(): void {
    this.enabled = false
  }

  public clear(): void {
    this.allProfiled = {}
  }

  public start(mark: string): void {
    if (this.enabled) {
      this.perf.mark(`${mark}-start`)
    }
  }

  public end(mark: string, name: string): void {
    if (this.enabled) {
      this.perf.mark(`${mark}-end`)
      this.perf.measure(name, `${mark}-start`, `${mark}-end`)
    }
  }

  public abstract getEntriesByName(name: string): PerformanceEntry[]

  /**
   * get the amount of calls to a specific profiled entity
   * @param name
   */
  callCount(name: string): number {
    return this.getEntriesByName(name).length
  }

  totalRunTime(name: string): number {
    return this.reduce(name, (a, b) => a + b)
  }

  maxRunTime(name: string): number {
    return this.reduce(name, Math.max)
  }

  private reduce(name: string, fn: (a: number, b: number) => number): number {
    const raw = this.getEntriesByName(name)
      .map(value => value.duration)
      .reduce((a, b) => fn(a, b))
    return Math.round(raw)
  }

  averageRunTime(name: string): number {
    return Math.round(this.totalRunTime(name) / this.callCount(name))
  }

  /**
   * prints all available data about the profiled entity
   * @param name
   * @param namePadding
   * @param callCountPadding
   * @param totalRuntimePadding
   * @param avgRunTimePadding
   */
  stringSummary(
    name: string,
    namePadding = 20,
    callCountPadding = 6,
    totalRuntimePadding = PerformanceMeasurer.STATS_PAD,
    avgRunTimePadding = PerformanceMeasurer.STATS_PAD,
    maxRunTimePadding = PerformanceMeasurer.STATS_PAD
  ): string {
    return (
      `|${padString(name, namePadding)}| calls=${padString(
        this.callCount(name) + '',
        callCountPadding
      )}|` +
      ` totalMs=${padString(
        this.totalRunTime(name) + '',
        totalRuntimePadding
      )}|` +
      ` maxMs=${padString(this.maxRunTime(name) + '', maxRunTimePadding)}|` +
      ` avgMs=${padString(this.averageRunTime(name) + '', avgRunTimePadding)}|`
    )
  }

  private profiledKeys(): string[] {
    return Object.keys(this.allProfiled)
  }
  /**
   * prints all available data about all the profiled entities
   */
  stringSummaryAll(): string {
    if (this.profiledKeys().length == 0) {
      return 'No calls or not Measurer not enabled'
    }
    const namePadding = Math.max.apply(
      null,
      this.profiledKeys().map(key => key.length)
    )

    return (
      // `|${padString('Summary', namePadding)}| ${padString('', 16)}| ${padString(
      //   '',
      //   43
      // )}| ${padString('', 45)}|\n` +
      this.profiledKeys()
        .map(key => this.stringSummary(key, namePadding))
        .sort()
        .reduce((a, b) => `${a}\n${b}`) +
      `\n|${padString('', namePadding)}| ` +
      `calls=${padString(this.totalCalls() + '', 6)}| ` +
      `totalMs=${padString(
        this.totalCallTime() + '',
        PerformanceMeasurer.STATS_PAD
      )}| ` +
      `maxMs=${padString(
        this.totalMaxCallTime() + '',
        PerformanceMeasurer.STATS_PAD
      )}| ` +
      `${padString('', 45)}|`
    )
  }

  private totalCalls(): number {
    return this.profiledKeys()
      .map(key => this.callCount(key))
      .reduce((a, b) => a + b)
  }

  private totalCallTime(): number {
    return this.profiledKeys()
      .map(key => this.totalRunTime(key))
      .reduce((a, b) => a + b)
  }
  private totalMaxCallTime(): number {
    return this.profiledKeys()
      .map(key => this.maxRunTime(key))
      .reduce((a, b) => a + b)
  }
}

function padString(str: string, length: number) {
  if (str.length > length) {
    return str
  }

  return str + ' '.repeat(length - str.length)
}
