import { Search } from '../../../../src/search'
import { testDirectus } from '../../helpers/directus.helper'

export function testSearch() {
  return new Search(testDirectus(), {})
}
