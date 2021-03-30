import Migration, { MigrationContext } from 'contentful-migration'

import {
  createFieldFollowUp,
  createFieldKeywords,
  createFieldName,
  createFieldShortText,
} from '../factories'

export function createDocument(migration: Migration) {
  const document = migration
    .createContentType('document')
    .name('Document')
    .description('Document (eg. PDF, ...')
  createFieldName(document)
  createFieldShortText(document, false)
  document
    .createField('document')
    .name('Document')
    .type('Link')
    .linkType('Asset')
    .required(true)
    // assets are by themselves localized
    .localized(false)

  // by default not required since documents will typically be the followup
  // of other contents to provide some text
  createFieldKeywords(document, false)


  createFieldFollowUp(document)
}

module.exports = function (migration: Migration, _: MigrationContext) {
  createDocument(migration)
}
