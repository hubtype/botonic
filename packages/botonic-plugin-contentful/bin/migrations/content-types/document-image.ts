import Migration, { ContentType, MigrationContext } from 'contentful-migration'

import { createCommonFields } from '../factories'

// be aware that assets are by themselves localized
function createFieldAsset(
  contentType: ContentType,
  id: string,
  name: string,
  _: { localized: boolean }
) {
  contentType
    .createField(id)
    .name(name)
    .type('Link')
    .linkType('Asset')
    .required(true)
    .localized(_.localized)
}

export function createDocument(migration: Migration) {
  const document = migration
    .createContentType('document')
    .name('Document')
    .description('Document (eg. PDF, ...')
  // Shorttext/keywords not required since documents will typically be the followup
  // of other contents which will provide an introductory text
  createCommonFields(document, { shortText: false, keywords: false })
  createFieldAsset(document, 'document', 'Document', { localized: false })
}

export function createImage(migration: Migration) {
  const image = migration
    .createContentType('image')
    .name('Image')
    .description('Image (eg. PDF, ...')
  // Shorttext/keywords not required since images will typically be the followup
  // of other contents which will provide an introductory text
  createCommonFields(image, { shortText: false, keywords: false })
  createFieldAsset(image, 'image', 'Image', { localized: false })
}

module.exports = function (migration: Migration, _: MigrationContext) {
  createDocument(migration)
  createImage(migration)
}
