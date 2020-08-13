export function cetDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0
): Date {
  return timeFor('Europe/Madrid', year, month, day, hour, minute)
}

export function nyDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0
): Date {
  return timeFor('America/New_York', year, month, day, hour, minute)
}

export function timeFor(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0
): Date {
  const date = new Date(Date.UTC(year, month, day, hour, minute, 0))

  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
  const offset = utcDate.getTime() - tzDate.getTime()

  date.setTime(date.getTime() + offset)

  return date
}
