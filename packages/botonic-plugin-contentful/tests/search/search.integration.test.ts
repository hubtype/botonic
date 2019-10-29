import { Search } from '../../src/search'
import { testContentful } from '../contentful/contentful.helper'
import { KeywordsOptions, MatchType, Normalizer } from '../../src/nlp'

test('TEST search: ', async () => {
  const contentful = testContentful()
  const normalizer = new Normalizer()
  const sut = new Search(contentful, normalizer, {
    es: new KeywordsOptions(1)
  })
  const res = await sut.searchByKeywords(
    'mi pedido no encuentro',
    MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP,
    {
      locale: 'es'
    }
  )
  expect(res.length).toBeGreaterThanOrEqual(1)
  expect(res.filter(res => res.common.name == 'POST_FAQ1')).toHaveLength(1)
})
