import Migration, { MigrationContext } from 'contentful-migration'

import {
  createFieldKeywords,
  createFieldName,
  createFieldShortText,
  createFieldButtons,
  createFieldFollowUp,
} from '../factories'

function crateUrl(migration: Migration) {
  const url = migration.createContentType('url')

  // TODO: make them required when Massimo contents migrated
  createFieldName(url, true)
  createFieldKeywords(url, true)
  createFieldShortText(url, true)
}

module.exports = function (migration: Migration, _: MigrationContext) {

  // const carousel = migration.editContentType('carousel');
  // setFollowUpLinkContentTypes(carousel); code supports it, but not in Contentful model
  // to keep it simple until anybody asks for it

  const image = migration.editContentType('image')
  createFieldName(image)
}
