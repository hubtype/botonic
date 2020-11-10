import { ENGLISH, KeywordsOptions, MatchType, Normalizer } from '../../src/nlp'
import { Search } from '../../src/search'
import { testContentful } from '../contentful/contentful.helper'

test('INTEGRATION TEST: searchByKeywords', async () => {
  const contentful = testContentful()
  const normalizer = new Normalizer()
  const sut = new Search(contentful, normalizer, {
    es: new KeywordsOptions(1),
  })
  const res = await sut.searchByKeywords(
    'mi pedido no encuentro',
    MatchType.ALL_WORDS_IN_KEYWORDS_MIXED_UP,
    {
      locale: 'es',
    }
  )
  expect(res.length).toBeGreaterThanOrEqual(1)
  expect(res.filter(res => res.common.name == 'POST_FAQ1')).toHaveLength(1)
})

test('INTEGRATION TEST: searchByKeywords with numbers', async () => {
  const locale = ENGLISH
  const cms = testContentful()
  const search = new Search(cms, new Normalizer())

  const exactKeyword = await search.searchByKeywords(
    '11',
    MatchType.ONLY_KEYWORDS_FOUND,
    { locale }
  )
  expect(exactKeyword.map(c => c.common.name)).toEqual(['TEST_NUMBER_KEYWORDS'])

  const substringNotFound = await search.searchByKeywords(
    '22',
    MatchType.ONLY_KEYWORDS_FOUND,
    { locale }
  )
  expect(substringNotFound).toHaveLength(0)
})
