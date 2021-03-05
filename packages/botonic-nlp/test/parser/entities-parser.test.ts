import { EntitiesParser } from '../../src/parser/entities-parser'

describe('Entity definitions Parser', () => {
  test('Parsing entities of a given text', () => {
    expect(
      EntitiesParser.parse(
        [
          {
            text: 'Where can I buy this [leather](material) [jacket](product)?',
            entities: [],
          },
        ],
        ['material', 'product']
      )
    ).toEqual([
      {
        text: 'Where can I buy this leather jacket?',
        entities: [
          { text: 'leather', label: 'material', start: 21, end: 28 },
          { text: 'jacket', label: 'product', start: 29, end: 35 },
        ],
      },
    ])
  })
})
