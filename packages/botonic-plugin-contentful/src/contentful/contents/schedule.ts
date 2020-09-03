import { Entry } from 'contentful'
import { DEFAULT_CONTEXT, ContentType, ScheduleContent } from '../../cms'
import * as time from '../../time'
import { TopContentDelivery } from '../content-delivery'
import {
  CommonEntryFields,
  ContentfulEntryUtils,
  ContentWithNameFields,
  DeliveryApi,
} from '../delivery-api'

export class ScheduleDelivery extends TopContentDelivery {
  static REFERENCES_INCLUDE = 2

  constructor(delivery: DeliveryApi, resumeErrors: boolean) {
    super(ContentType.SCHEDULE, delivery, resumeErrors)
  }

  async schedule(id: string): Promise<ScheduleContent> {
    const f = await this.getEntry<ScheduleFields>(id, DEFAULT_CONTEXT, {
      include: ScheduleDelivery.REFERENCES_INCLUDE,
    })
    return this.fromEntry(f)
  }

  fromEntry(entry: Entry<ScheduleFields>): ScheduleContent {
    const schedule = new time.Schedule(time.Schedule.TZ_CET) // TODO allow configuration
    this.addDaySchedules(schedule, entry.fields)
    this.addExceptions(schedule, entry.fields.exceptions)
    return new ScheduleContent(
      ContentfulEntryUtils.commonFieldsFromEntry(entry),
      schedule
    )
  }

  private addDaySchedules(
    schedule: time.Schedule,
    fields: ScheduleFields
  ): void {
    const days = [
      fields.sundays,
      fields.mondays,
      fields.tuesdays,
      fields.wednesdays,
      fields.thursdays,
      fields.fridays,
      fields.saturdays,
    ]
    for (const day in days) {
      if (!days[day]) {
        continue
      }
      const daySchedule = this.createDaySchedule(schedule, days[day]!)
      schedule.addDaySchedule(+day, daySchedule)
    }
  }

  private createDaySchedule(
    sched: time.Schedule,
    hourRanges: Entry<HourRangeFields>[]
  ): time.DaySchedule {
    const timeRanges = hourRanges.map(hr => {
      try {
        return new time.TimeRange(
          sched.createHourAndMinute(hr.fields.fromHour, hr.fields.fromMinute),
          sched.createHourAndMinute(hr.fields.toHour, hr.fields.toMinute)
        )
      } catch (e) {
        console.error(`Error loading hour range`, hr)
        throw e
      }
    })
    return new time.DaySchedule(timeRanges)
  }

  private addExceptions(
    schedule: time.Schedule,
    exceptions?: Entry<DayScheduleFields>[]
  ) {
    if (!exceptions) {
      return
    }
    for (const exception of exceptions) {
      try {
        const timeRanges = this.createDaySchedule(
          schedule,
          exception.fields.hourRanges || []
        )
        const dateStr = exception.fields.date.split('-')
        const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
        schedule.addException(date, timeRanges)
      } catch (e) {
        this.logOrThrow(
          `Loading Schedule Exception '${exception.sys.id}' (name '${exception.fields.name}')`,
          e
        )
      }
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
