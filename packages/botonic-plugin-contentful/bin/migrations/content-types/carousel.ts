import Migration, { MigrationContext } from 'contentful-migration'

import { createCommonFields, createFieldButtons } from '../factories'

function createCarousel(migration: Migration) {
  // TODO WIP
  const element = migration
    .createContentType('element')
    .name('Element')
    .description('Image with text and a button displayed on a Carousel')
  createFieldButtons(element)

  const carousel = migration.createContentType('carousel')
  createCommonFields(carousel, { shortText: true, keywords: true })
}

module.exports = function (migration: Migration, _: MigrationContext) {
  createCarousel(migration)
}
