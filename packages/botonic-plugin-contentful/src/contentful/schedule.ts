import { Entry } from 'contentful';
import * as time from '../time';
import { ContentWithNameFields, DeliveryApi } from './delivery-api';

export class ScheduleDelivery {
  static REFERENCES_INCLUDE = 2;
  constructor(protected delivery: DeliveryApi) {}

  async schedule(id: string): Promise<time.Schedule> {
    let f = await this.delivery.getEntry<ScheduleFields>(id, {
      include: ScheduleDelivery.REFERENCES_INCLUDE
    });
    return ScheduleDelivery.scheduleFromEntry(f);
  }

  static scheduleFromEntry(f: Entry<ScheduleFields>): time.Schedule {
    let schedule = new time.Schedule(time.Schedule.TZ_CET); // TODO allow configuration
    ScheduleDelivery.addDaySchedules(schedule, f.fields);
    ScheduleDelivery.addExceptions(schedule, f.fields.exceptions);
    return schedule;
  }

  private static addDaySchedules(
    schedule: time.Schedule,
    fields: ScheduleFields
  ): void {
    let days = [
      fields.sundays || undefined,
      fields.mondays || undefined,
      fields.tuesdays || undefined,
      fields.wednesdays || undefined,
      fields.thursdays || undefined,
      fields.fridays || undefined,
      fields.saturdays || undefined
    ];
    for (let day in days) {
      if (!day || !days[day]) {
        continue;
      }
      let daySchedule = ScheduleDelivery.createDaySchedule(
        schedule,
        days[day]!
      );
      schedule.addDaySchedule(+day, daySchedule);
    }
  }

  private static createDaySchedule(
    sched: time.Schedule,
    hourRanges: Entry<HourRangeFields>[]
  ): time.DaySchedule {
    let timeRanges = hourRanges.map(
      hr =>
        new time.TimeRange(
          sched.createHourAndMinute(hr.fields.fromHour, hr.fields.fromMinute),
          sched.createHourAndMinute(hr.fields.toHour, hr.fields.toMinute)
        )
    );
    return new time.DaySchedule(timeRanges);
  }

  // private static createTim

  private static addExceptions(
    schedule: time.Schedule,
    exceptions?: Entry<DayScheduleFields>[]
  ) {
    if (!exceptions) {
      return;
    }
    for (let exception of exceptions) {
      let timeRanges = ScheduleDelivery.createDaySchedule(
        schedule,
        exception.fields.hourRanges || []
      );
      let dateStr = exception.fields.date.split('-');
      let date = new Date(+dateStr[0], +dateStr[1] - 1, +dateStr[2]);
      schedule.addException(date, timeRanges);
    }
  }
}
export interface ScheduleFields extends ContentWithNameFields {
  mondays?: Entry<HourRangeFields>[];
  tuesdays?: Entry<HourRangeFields>[];
  wednesdays?: Entry<HourRangeFields>[];
  thursdays?: Entry<HourRangeFields>[];
  fridays?: Entry<HourRangeFields>[];
  saturdays?: Entry<HourRangeFields>[];
  sundays?: Entry<HourRangeFields>[];
  exceptions?: Entry<DayScheduleFields>[];
}

export interface DayScheduleFields extends ContentWithNameFields {
  date: string;
  hourRanges: Entry<HourRangeFields>[];
}

export interface HourRangeFields extends ContentWithNameFields {
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;
}
