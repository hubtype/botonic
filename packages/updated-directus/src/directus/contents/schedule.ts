import { PartialItem } from '@directus/sdk'
import { ContentType, SupportedLocales, ScheduleContent } from '../../cms'
import { getCustomFields, mf } from '../../directus/delivery/delivery-utils'
import { ContentDelivery, DirectusClient } from '../delivery'
import * as time from '../../time'

export class ScheduleDelivery extends ContentDelivery {
  constructor(client: DirectusClient) {
    super(client, ContentType.SCHEDULE)
  }

  async schedule(
    id: string,
    context: SupportedLocales
  ): Promise<ScheduleContent> {
    const entry = await this.getEntry(id, context)
    return this.fromEntry(entry, context)
  }

  fromEntry(
    entry: PartialItem<any>,
    context: SupportedLocales
  ): ScheduleContent {
    const schedule = new time.Schedule(time.Schedule.TZ_CET)
    if (entry[mf][0]) this.addDaySchedules(schedule, entry[mf][0], context)
    if (entry[mf][0])
      this.addExceptions(schedule, context, entry[mf][0].exceptions)
    const opt = {
      common: {
        id: entry.id as string,
        name: entry.name ?? '',
        shortText: entry[mf][0]?.shorttext ?? undefined,
        keywords: entry[mf][0]?.keywords?.split(',') ?? undefined,
        customFields: entry[mf][0] ? getCustomFields(entry[mf][0]) : {},
      },
      schedule: schedule ?? undefined,
    }
    return new ScheduleContent(opt)
  }

  private addDaySchedules(
    schedule: time.Schedule,
    entry: PartialItem<any>,
    context: SupportedLocales
  ): void {
    const Week_Days = [
      'mondays',
      'tuesdays',
      'wednesdays',
      'thursdays',
      'fridays',
      'saturdays',
      'sundays',
    ]
    for (let field in entry) {
      if (Week_Days.includes(field)) {
        if (entry[field].length) {
          entry[field][0].item[mf] = this.getContextContent(
            entry[field][0].item[mf],
            context
          )
        }
      }
    }

    const days: PartialItem<any>[] = [
      entry.mondays[0]?.item[mf][0],
      entry.tuesdays[0]?.item[mf][0],
      entry.wednesdays[0]?.item[mf][0],
      entry.thursdays[0]?.item[mf][0],
      entry.fridays[0]?.item[mf][0],
      entry.saturdays[0]?.item[mf][0],
      entry.sundays[0]?.item[mf][0],
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
    hourRange: PartialItem<any>
  ): time.DaySchedule {
    const timeRange = new time.TimeRange(
      sched.createHourAndMinute(hourRange.from_hour, hourRange.from_minute),
      sched.createHourAndMinute(hourRange.to_hour, hourRange.to_minute)
    )

    return new time.DaySchedule(timeRange)
  }

  private addExceptions(
    schedule: time.Schedule,
    context: SupportedLocales,
    exceptions?: PartialItem<any>[]
  ) {
    if (!exceptions?.length) {
      return
    }
    exceptions[0].item[mf] = this.getContextContent(
      exceptions[0].item[mf],
      context
    )

    for (const exception of exceptions) {
      exception.item[mf] = this.getContextContent(exception.item[mf], context)
      exception.item[mf][0].hour_ranges[0].item[mf] = this.getContextContent(
        exception.item[mf][0].hour_ranges[0].item[mf],
        context
      )
      const timeRanges = this.createDaySchedule(
        schedule,
        exception.item[mf][0].hour_ranges[0].item[mf][0] || []
      )
      const dateStr = exception.item[mf][0].date.split('-')
      const date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2])
      schedule.addException(date, timeRanges)
    }
  }

  private getContextContent(
    entry: PartialItem<any>,
    context: SupportedLocales
  ): PartialItem<any> {
    const localeContent = entry.find(
      (content: PartialItem<any>) => content.languages_code === context
    )
    return [localeContent]
  }
}
