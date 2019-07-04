import { Url } from '../../src/cms';
import { testContentful } from './contentful.helper';

const TEST_URL_HUBTYPE_ID = '4ceaDUEr0ay6N7aXzFRt69';

test('TEST: contentful url', async () => {
  let url = await testContentful().url(TEST_URL_HUBTYPE_ID, { locale: 'en' });
  expect(url).toEqual(
    new Url('URL_HUBTYPE', 'https://www.hubtype.com/en', 'Web de Hubtype', [
      'hubtypeEn',
      'botonicEn'
    ])
  );
});
