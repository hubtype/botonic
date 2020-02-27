import { Entry } from 'contentful/index'
import { DEFAULT_CONTEXT, ContentType, ScheduleContent } from '../../cms'
import * as time from '../../time'
import { ContentDelivery } from '../content-delivery'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  ContentWithNameFields,
  DeliveryApi,
} from '../delivery-api'

export class ScheduleDelivery extends ContentDelivery {
  static REFERENCES_INCLUDE = 2

  constructor(delivery: DeliveryApi) {
    super(ContentType.SCHEDULE, delivery)
  }

  async schedule(id: string): Promise<ScheduleContent> {
    const f = await this.getEntry<ScheduleFields>(id, DEFAULT_CONTEXT, {
      include: ScheduleDelivery.REFERENCES_INCLUDE,
    })
    return ScheduleDelivery.fromEntry(f)
  }

  static fromEntry(entry: Entry<ScheduleFields>): ScheduleContent {
    const schedule = new time.Schedule(time.Schedule.TZ_CET) // TODO allow configuration
    ScheduleDelivery.addDaySchedules(schedule, entry.fields)
    ScheduleDelivery.addExceptions(schedule, entry.fields.exceptions)
    return new ScheduleContent(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      schedule
    )
  }

  private static addDaySchedules(
    schedule: time.Schedule,
    fields: ScheduleFields
  ): void {
    const days = [
      fields.sundays || undefined,
      fields.mondays || undefined,
      fields.tuesdays || undefined,
      fields.wednesdays || undefined,
      fields.thursdays || undefined,
      fields.fridays || undefined,
      fields.saturdays || undefined,
    ]
    for (const day in days) {
      if (!day || !days[day]) {
        continue
      }
      const daySchedule = ScheduleDelivery.createDaySchedule(
        schedule,
        days[day]!
      )
      schedule.addDaySchedule(+day, daySchedule)
    }
  }

  private static createDaySchedule(
    sched: time.Schedule,
    hourRanges: Entry<HourRangeFields>[]
  ): time.DaySchedule {
    const timeRanges = hourRanges.map(
      hr =>
        new time.TimeRange(
          sched.createHourAndMinute(hr.fields.fromHour, hr.fields.fromMinute),
          sched.createHourAndMinute(hr.fields.toHour, hr.fields.toMinute)
        )
    )
    return new time.DaySchedule(timeRanges)
  }

  // private static createTim

  private static addExceptions(
    schedule: time.Schedule,
    exceptions?: Entry<DayScheduleFields>[]
  ) {
    if (!exceptions) {
      return
    }
    for (const exception of exceptions) {
      const timeRanges = ScheduleDelivery.createDaySchedule(
        schedule,
        exception.fields.hourRanges || []
      )
      const dateStr = exception.fields.date.split('-')
      const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
      schedule.addException(date, timeRanges)
    }
  }
}

export interface ScheduleFields extends CommonEntryFields {
  mondays?: Entry<HourRangeFields>[]
  tuesdays?: Entry<HourRangeFields>[]
  wednesdays?: Entry<HourRangeFields>[]
  thursdays?: Entry<HourRangeFields>[]
  fridays?: Entry<HourRangeFields>[]
  saturdays?: Entry<HourRangeFields>[]
  sundays?: Entry<HourRangeFields>[]
  exceptions?: Entry<DayScheduleFields>[]
}

export interface DayScheduleFields extends ContentWithNameFields {
  date: string
  hourRanges: Entry<HourRangeFields>[]
}

export interface HourRangeFields extends ContentWithNameFields {
  fromHour: number
  fromMinute: number
  toHour: number
  toMinute: number
}
