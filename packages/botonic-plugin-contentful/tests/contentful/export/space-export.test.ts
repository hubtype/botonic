import path from 'path'

import { SpaceExport } from '../../../src/contentful/export/space-export'

const FIXTURES_BASE = path.resolve(__dirname, '__fixtures__')
describe.skip('SpaceExport', () => {
  test('TEST: contentTypes overcomes lack of items in schema', () => {
    const fromFile = FIXTURES_BASE + '/contentTypes-with-items.json'

    // act
    const space = SpaceExport.fromJsonFile(fromFile)

    // assert
    expect(space.payload.contentTypes).toHaveLength(1)
    expect(space.payload.contentTypes![0].fields[2].items!.linkType).toEqual(
      'Entry'
    )
  })
})
