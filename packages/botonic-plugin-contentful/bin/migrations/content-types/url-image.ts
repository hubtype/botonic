import Migration, { MigrationContext } from 'contentful-migration'

import {
  createFieldKeywords,
  createFieldName,
  createFieldShortText,
} from '../factories'

function createUrl(migration: Migration) {
  const url = migration.createContentType('url')

  createFieldName(url, true)
  createFieldKeywords(url, true)
  createFieldShortText(url, true)
}

module.exports = function (migration: Migration, _: MigrationContext) {
  createUrl(migration)
}
