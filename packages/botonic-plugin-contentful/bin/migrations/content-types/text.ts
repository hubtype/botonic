import Migration, { MigrationContext } from 'contentful-migration'

import {
  createCommonFields,
  createFieldButtons,
  createFieldFollowUp,
} from '../factories'

function createText(migration: Migration) {
  // TODO WIP
  const text = migration
    .createContentType('text')
    .name('Text')
    .description('A text optionally with buttons')
  createCommonFields(text, { shortText: true, keywords: true })
  createFieldButtons(text)
  createFieldFollowUp(text)
}

module.exports = function (migration: Migration, _: MigrationContext) {
  createText(migration)
}
