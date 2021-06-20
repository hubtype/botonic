import Migration, { ContentType, MigrationContext } from 'contentful-migration'

import { createFieldName } from '../factories'

function createFromTo(
  dateRange: ContentType,
  id: string,
  name: string,
  helpText: string
): ContentType {
  dateRange
    .createField(id)
    .name(name)
    .type('Date')
    .required(true)
    .localized(false)
  dateRange.changeFieldControl('from', 'builtin', 'datePicker', {
    format: 'timeZ',
    ampm: '24',
    helpText: helpText,
  })
  return dateRange
}

module.exports = function (migration: Migration, _: MigrationContext) {
  // ATTENTION: when I applied it, the datePicker widget was not correctly applied
  // I had to select it and relogin
  const dateRange = migration
    .createContentType('dateRange')
    .name('Time Range')
    .description('Time between 2 moments')

  createFieldName(dateRange)
  createFromTo(
    dateRange,
    'from',
    'Start moment',
    'Moment at which the period starts'
  )
  createFromTo(dateRange, 'to', 'End moment', 'Moment at which the period ends')
}
