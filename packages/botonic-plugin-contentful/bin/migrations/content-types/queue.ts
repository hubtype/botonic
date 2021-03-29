import Migration, { MigrationContext } from 'contentful-migration'

import {
  createFieldKeywords,
  createFieldName,
  createFieldShortText,
} from '../factories'

module.exports = function (migration: Migration, _: MigrationContext) {
  const searchable = migration
    .createContentType('searchableByKeywords')
    .name('Searchable By Keywords')
  createFieldName(searchable)
  createFieldKeywords(searchable, false)
  searchable
    .createField('priority')
    .name('Priority')
    .type('Symbol')
    .required(false)
    .localized(false)

  const queue = migration.createContentType('queue').name('Desk Queue')
  createFieldName(queue)
  createFieldShortText(queue, true)
  queue
    .createField('queue')
    .name('Botonic Queue Name')
    .type('Symbol')
    .required(true)
    .localized(false)

  queue
    .createField('schedule')
    .name('Schedule')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([{ linkContentType: ['schedule'] }])

  queue
    .createField('searchableBy')
    .name('Searchable by')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['searchableByKeywords'] }],
    })
    .required(false)
}
