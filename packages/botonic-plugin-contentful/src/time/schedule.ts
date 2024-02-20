import momentTz from 'moment-timezone'

import { offsetWithTimeZone } from './timezones'

/**
 * Manages ranges of hour/minutes for each day of a week.
 * The hour/minutes refer to the specified timezone.
 * Use {@link addException} to add holidays (eg with empty {@link TimeRange}) or sales openings in weekends
 * TODO consider using everywhere Date.toLocaleTimeString() to remove moment-timezone dependency
 */
export class Schedule {
  static TZ_CET = 'Europe/Madrid'
  private readonly zone: momentTz.MomentZone
  private readonly scheduleByDay = new Map<WeekDay, DaySchedule>()
  private readonly exceptions = [] as ExceptionSchedule[]

  constructor(tzName: string) {
    const zone = momentTz.tz.zone(tzName)
    if (!zone) {
      throw new Error(`${tzName} is not a valid timezone name`)
    }
    this.zone = zone
  }

  createHourAndMinute(hour: number, minute = 0): HourAndMinute {
    return new HourAndMinute(hour, minute)
  }

  addDaySchedule(weekday: WeekDay, daySchedule: DaySchedule): Schedule {
    this.scheduleByDay.set(weekday, daySchedule)
    return this
  }

  /**
   * For the specified date, the weekly schedule will be superseded by the daySchedule specified here
   */
  addException(date: Date, daySchedule: DaySchedule): Schedule {
    this.exceptions.push(new ExceptionSchedule(date, daySchedule))
    return this
  }

  /**
   * Formats the specified date using the {@link Schedule}'s timezone.
   * @param locales don't confuse with timezone. This is just to format the date
   */
  timeInThisTimezone(
    locales?: string | string[],
    date: Date = new Date()
  ): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.zone.name,
      hour12: false,
    }
    return date.toLocaleTimeString(locales, options)
  }

  contains(inDate: Date): boolean {
    const offset = offsetWithTimeZone(this.zone, inDate)
    const scheduleZoneDate = new Date(inDate.getTime() + offset)
    const exception = this.exceptions.find(exception =>
      isSameDay(scheduleZoneDate, exception.date)
    )
    if (exception) {
      return exception.daySchedule.contains(scheduleZoneDate)
    }
    const weekDay = scheduleZoneDate.getDay() as WeekDay
    const schedule = this.scheduleByDay.get(weekDay)
    if (!schedule) {
      return false
    }
    return schedule.contains(scheduleZoneDate)
  }
}

export class ScheduleAlwaysOn extends Schedule {
  constructor() {
    super('UTC')
  }
  contains(_date: Date): boolean {
    return true
  }
}

export class DaySchedule {
  constructor(readonly ranges: TimeRange[]) {}

  contains(date: Date): boolean {
    for (const range of this.ranges) {
      if (range.contains(date)) {
        return true
      }
    }
    return false
  }
}

export enum WeekDay {
  SUNDAY = 0, // compatible with Date getDay
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

class ExceptionSchedule {
  constructor(
    readonly date: Date,
    readonly daySchedule: DaySchedule
  ) {}
}

export class TimeRange {
  readonly from: HourAndMinute
  readonly to: HourAndMinute
  /**
   * @param from inclusive
   * @param to exclusive if 00:00, it will be interpreted as 24:00
   */
  constructor(from: HourAndMinute, to: HourAndMinute) {
    this.from = from
    this.to = to.isMidnight() ? new HourAndMinute(24, 0) : to
    if (this.from.compare(this.to) >= 0) {
      throw new Error(`${from.toString()} should be before ${to.toString()}`)
    }
  }

  contains(date: Date): boolean {
    if (this.from.compareToDate(date) > 0) {
      return false
    }
    return this.to.compareToDate(date) > 0
  }
}

export class HourAndMinute {
  constructor(
    readonly hour: number,
    readonly minute: number = 0
  ) {}

  compareToDate(date: Date): number {
    return HourAndMinute.compareNumber(
      this.toMinutes(),
      date.getHours() * 60 + date.getMinutes()
    )
  }

  isMidnight(): boolean {
    return this.hour === 0 && this.minute === 0
  }

  private static compareNumber(first: number, second: number): number {
    if (first === second) {
      return 0
    }
    if (first < second) {
      return -1
    }
    return 1
  }

  compare(other: HourAndMinute): number {
    return HourAndMinute.compareNumber(this.toMinutes(), other.toMinutes())
  }

  private toMinutes(): number {
    return this.hour * 60 + this.minute
  }

  toString(): string {
    let str = this.hour.toString()
    if (this.minute != 0) {
      str += ':' + this.minute.toString()
    }
    return str + 'h'
  }
}

// BUG should check date in schedule timezone
function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}
