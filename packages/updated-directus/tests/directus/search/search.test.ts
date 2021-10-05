import { testSearch } from './helpers/search.helper'

const TEXT_WITH_KEYWORDS = 'ce1f229c-9f30-4bf4-a891-102b66a91287'

test.each([['help'], ['jejeje'], ['need']])(
  'Test: search text with exact keywords',
  async keyword => {
    const search = testSearch()
    const searchResults = await search.searchByKeywords(keyword)
    expect(searchResults[0]).toEqual(TEXT_WITH_KEYWORDS)
  }
)
