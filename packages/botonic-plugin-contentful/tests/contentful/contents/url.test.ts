import { CommonFields, Url } from '../../../src/cms'
import { testContentful } from '../contentful.helper'

const TEST_URL_HUBTYPE_ID = '4ceaDUEr0ay6N7aXzFRt69'

test('TEST: contentful url', async () => {
  const url = await testContentful().url(TEST_URL_HUBTYPE_ID, { locale: 'en' })
  expect(url).toEqual(
    new Url(
      new CommonFields(TEST_URL_HUBTYPE_ID, 'URL_HUBTYPE', {
        shortText: 'Web de Hubtype',
        keywords: ['hubtypeEn', 'botonicEn'],
        customFields: { customFieldText: 'Url text' },
      }),
      'https://www.hubtype.com/en'
    )
  )
})
