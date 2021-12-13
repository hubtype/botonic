import { testDirectus } from '../helpers/directus.helper'
import * as cms from '../../../src/cms'

test('Test: add locale copying the content from other locale', async () => {
  const directus = testDirectus()
  await directus.removeLocales([cms.SupportedLocales.FRENCH])
  await directus.addLocales([
    {
      locale: cms.SupportedLocales.FRENCH,
      copyFrom: cms.SupportedLocales.SPANISH,
    },
  ])

  for (let contentType of cms.DirectusContentTypes) {
    if (contentType == cms.ContentType.HOUR_RANGE) {
      return
    }
    const spanishEntries = await directus.topContents(
      contentType,
      cms.SupportedLocales.SPANISH
    )
    const frenchEntries = await directus.topContents(
      contentType,
      cms.SupportedLocales.FRENCH
    )
    expect(frenchEntries).toEqual(spanishEntries)
  }
}, 1000000)
