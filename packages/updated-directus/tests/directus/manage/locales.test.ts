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
}, 1000000)
