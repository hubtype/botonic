import { join } from 'path'

import { Parser } from '../../src/parser/parser'

describe('Parsing Botonic NLP input file', () => {
  test('Parsing file', () => {
    expect(
      Parser.parse(join(__dirname, '..', 'utils', 'input-example.yaml'))
    ).toEqual({
      class: 'shopping',
      entities: ['O', 'product'],
      samples: [
        {
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Mango?',
        },
        {
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Stradivarius?',
        },
        {
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Pull&Bear?',
        },
      ],
    })
  })
})
