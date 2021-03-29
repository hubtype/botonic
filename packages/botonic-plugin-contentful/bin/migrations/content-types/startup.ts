import Migration, { MigrationContext } from 'contentful-migration'

import { createFieldKeywords, createFieldShortText } from '../factories'

module.exports = function (migration: Migration, _: MigrationContext) {
  // TODO WIP
  const startUp = migration
    .createContentType('startUp')
    .name('Start Up')
    .description('Flow initial content. Image, text & buttons')
  createFieldShortText(startUp, false)
  createFieldKeywords(startUp, false)
}
