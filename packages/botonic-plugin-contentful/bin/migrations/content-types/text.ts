import Migration from 'contentful-migration'

import { createFieldButtons, createFieldFollowUp } from '../factories'

function createText(migration: Migration) {
  // TODO WIP
  const text = migration
    .createContentType('text')
    .name('Text')
    .description('A text optionally with buttons')
  createFieldButtons(text)
  createFieldFollowUp(text)
}
