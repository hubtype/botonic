import Migration from 'contentful-migration'

import { createFieldButtons, createFieldFollowUp } from '../factories'

function createCarousel(migration: Migration) {
  // TODO WIP
  const element = migration
    .createContentType('element')
    .name('Element')
    .description('Image with text and a button displayed on a Carousel')
  createFieldButtons(element)

  const carousel = migration.createContentType('carousel')
  createFieldFollowUp(carousel)
}
