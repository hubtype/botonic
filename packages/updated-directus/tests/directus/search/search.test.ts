import { testSearch } from './helpers/search'

const TEXT_WITH_KEYWORDS = 'c2634da5-f8cd-4254-a68b-9a76d6792b81'

test.each([['help'], ['jejeje'], ['need']])(
  'Test: search text with exact keywords',
  async keyword => {
    const search = testSearch()
    const searchResults = await search.searchByKeywords(keyword)
    expect(searchResults[0]).toEqual(TEXT_WITH_KEYWORDS)
  }
)

test('Test: search text with keywords and other words', async () => {
  const search = testSearch()
  const searchResults = await search.searchByKeywords(
    'El otro dia me lo pasé muy bien jejeje y disfruté'
  )
  console.log({ searchResults })
  expect(searchResults[0]).toEqual(TEXT_WITH_KEYWORDS)
})
