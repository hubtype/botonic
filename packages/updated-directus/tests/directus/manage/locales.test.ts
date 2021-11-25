import { testDirectus } from '../helpers/directus.helper'
import * as cms from '../../../src/cms'

test('Test: add locale copying the content from other locale', async () => {
  const directus = testDirectus()
  await directus.removeLocale(cms.SupportedLocales.RUSSIAN)
  await directus.addLocales([
    {
      locale: cms.SupportedLocales.RUSSIAN,
      copyFrom: cms.SupportedLocales.SPANISH,
    },
  ])
})
