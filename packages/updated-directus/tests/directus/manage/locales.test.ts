import { testDirectus } from '../helpers/directus.helper'
import * as cms from '../../../src/cms'

test('Test: add locale copying the content from other locale', async () => {
  const directus = testDirectus()
  await directus.removeLocale(cms.SupportedLocales.ITALIAN)
  await directus.removeLocale(cms.SupportedLocales.GERMAN)
  await directus.addLocales([
    {
      locale: cms.SupportedLocales.GERMAN,
      copyFrom: cms.SupportedLocales.SPANISH,
    },
  ])
}, 1000000)
