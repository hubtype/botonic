import {
  DaySchedule,
  HourAndMinute,
  Schedule,
  ScheduleAlwaysOn,
  TimeRange,
  WeekDay
} from '../../src/time/schedule';
import momentTz from 'moment-timezone';

const MARCH = 2;
const APRIL = 3;

test('TEST ScheduleAlwaysOn', () => {
  const sut = new ScheduleAlwaysOn();
  expect(sut.contains(new Date())).toEqual(true);
});

test.each<any>([
  // Friday winter time
  [new Date(2019, MARCH, 29, 8, 59), false],
  [new Date(2019, MARCH, 29, 9, 0), true],
  [new Date(2019, MARCH, 29, 18, 59), true],
  [new Date(2019, MARCH, 29, 19, 0), false],
  // Saturday winter time
  [new Date(2019, MARCH, 30, 9, 59), false],
  [new Date(2019, MARCH, 30, 10, 0), true],
  [new Date(2019, MARCH, 30, 15, 59), true],
  [new Date(2019, MARCH, 30, 16, 0), false],
  // Sunday (directly discarded because there's no service on Sunday)
  [new Date(2019, MARCH, 31, rand(0, 23), rand(0, 59)), false],
  // Monday summer time
  [new Date(2019, APRIL, 1, 8, 59), false],
  [new Date(2019, APRIL, 1, 9, 0), true],
  [new Date(2019, APRIL, 1, 18, 59), true],
  [new Date(2019, APRIL, 1, 19, 0), false]
])('TEST: Schedule.contains(%s)=>%s', (date: Date, expected: boolean) => {
  const sut = new Schedule(Schedule.TZ_CET);

  for (let d = WeekDay.MONDAY; d <= WeekDay.FRIDAY; d++) {
    const timeRange = new TimeRange(
      sut.createHourAndMinute(9),
      sut.createHourAndMinute(19)
    );
    sut.addDaySchedule(d, new DaySchedule([timeRange]));
  }
  const timeRange = new TimeRange(
    sut.createHourAndMinute(10),
    sut.createHourAndMinute(16)
  );
  sut.addDaySchedule(WeekDay.SATURDAY, new DaySchedule([timeRange]));
  sut.addDaySchedule(WeekDay.SUNDAY, new DaySchedule([]));

  // act
  expect(sut.contains(date)).toEqual(expected);
});

test('TEST: HourAndMinute.compareToDate CET', () => {
  assertInCET();
  const zone = momentTz.tz.zone('Europe/Madrid');
  const time = new HourAndMinute(zone!, 13, 45);

  const date = new Date(2019, 5, 29, 13, 46);

  expect(time.compareToDate(date)).toEqual(-1);

  date.setMinutes(45);
  expect(time.compareToDate(date)).toEqual(0);

  date.setMinutes(44);
  expect(time.compareToDate(date)).toEqual(1);
});

test('TEST: HourAndMinute.compareToDate OTHER', () => {
  assertInCET();
  const zone = momentTz.tz.zone('Europe/London');
  const time = new HourAndMinute(zone!, 12, 45);

  const date = new Date(2019, 5, 29, 13, 46);
  expect(time.compareToDate(date)).toEqual(-1);

  date.setMinutes(45);
  expect(time.compareToDate(date)).toEqual(0);

  date.setMinutes(44);
  expect(time.compareToDate(date)).toEqual(1);
});

test('TEST: timeInThisTimezone ', () => {
  const sut = new Schedule('Europe/London');

  const date = new Date(2019, 5, 29, 0, 51);
  expect(sut.timeInThisTimezone('es', date)).toEqual('23:51:00');
});

test('TEST: addException', () => {
  const sut = new Schedule('Europe/Madrid');
  sut.addDaySchedule(
    WeekDay.FRIDAY,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(10), sut.createHourAndMinute(12))
    ])
  );

  const date10h = new Date(2019, MARCH, 29, 10);
  expect(sut.contains(date10h)).toBeTruthy();
  const date12h = new Date(2019, MARCH, 29, 12);
  expect(sut.contains(date12h)).toBeFalsy();

  sut.addException(
    date10h,
    new DaySchedule([
      new TimeRange(sut.createHourAndMinute(11), sut.createHourAndMinute(13))
    ])
  );
  expect(sut.contains(date10h)).toBeFalsy();
  expect(sut.contains(date12h)).toBeTruthy();
});

test('TEST: time.toString ', () => {
  // tz does not affect toString
  const zone = momentTz.tz.zone('Europe/London');

  const time = new HourAndMinute(zone!, 13, 45);
  expect(time.toString()).toEqual('13:45h');
});

function assertInCET(): void {
  const tzName = momentTz.tz.guess();
  expect(tzName).toEqual('Europe/Madrid');
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
