import Migration, { MigrationContext } from 'contentful-migration'

import { createCommonFields } from '../factories'

module.exports = function (migration: Migration, _: MigrationContext) {
  // TODO WIP
  const startUp = migration
    .createContentType('startUp')
    .name('Start Up')
    .description('Flow initial content. Image, text & buttons')
  createCommonFields(startUp, { shortText: false, keywords: false })
}
