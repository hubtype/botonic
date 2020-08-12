import momentTz from 'moment-timezone'

/**
 * @return the offset of specified timezone with respect to offset of local timezone
 * at specified date
 */
export function offsetWithTimeZone(
  timeZone: momentTz.MomentZone,
  date: Date
): number {
  const offset =
    new Date(date.getTime()).getTimezoneOffset() -
    timeZone.utcOffset(date.getTime())
  return offset * 60 * 1000
}
