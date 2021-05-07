import { EntitiesParser } from '../../src/dataset/entity-parser'

describe('Entity definitions Parser', () => {
  test('Parsing entities of a given text', () => {
    const sut = new EntitiesParser(['material', 'product'])
    const { text, entities } = sut.parse(
      'Where can I buy this [leather](material) [jacket](product)?'
    )
    expect(text).toEqual('Where can I buy this leather jacket?')
    expect(entities).toEqual([
      { label: 'material', start: 21, end: 28 },
      { label: 'product', start: 29, end: 35 },
    ])
  })
})
