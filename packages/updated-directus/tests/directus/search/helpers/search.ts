import { Search } from '../../../../src/search'
import { testDirectus } from '../../helpers/directus'

export function testSearch() {
  return new Search(testDirectus(), {})
}
