export * from './schedule'

export class DateRange {
  constructor(
    readonly name: string,
    readonly from: Date,
    readonly to: Date
  ) {}

  contains(date: Date): boolean {
    return (
      date.getTime() >= this.from.getTime() &&
      date.getTime() < this.to.getTime()
    )
  }
}
