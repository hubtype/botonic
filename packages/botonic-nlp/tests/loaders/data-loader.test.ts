import { join } from 'path'

import { DataLoader } from '../../src/loaders/data-loader'

describe('Parsing Botonic NLP input file', () => {
  test('Parsing file', () => {
    const loader = new DataLoader(
      join(__dirname, '..', 'helpers', 'data', 'shopping.yaml')
    )
    expect(loader.data).toEqual({
      classes: ['shopping'],
      entities: ['product'],
      samples: [
        {
          class: 'shopping',
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Bershka?',
        },
        {
          class: 'shopping',
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Zara?',
        },
        {
          class: 'shopping',
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
          class: 'shopping',
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
          class: 'shopping',
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

  test('Parsing directory files', () => {
    const loader = new DataLoader(join(__dirname, '..', 'helpers', 'data'))
    expect(loader.data).toEqual({
      classes: ['booking', 'shopping'],
      entities: ['restaurant', 'product'],
      samples: [
        {
          class: 'booking',
          entities: [
            {
              end: 37,
              label: 'restaurant',
              start: 32,
              text: 'Ginos',
            },
          ],
          text: 'I would like to book a table at Ginos',
        },
        {
          class: 'booking',
          entities: [
            {
              end: 31,
              label: 'restaurant',
              start: 26,
              text: 'Goiko',
            },
          ],
          text: 'I want to book a table at Goiko for tomorrow',
        },
        {
          class: 'booking',
          entities: [
            {
              end: 31,
              label: 'restaurant',
              start: 27,
              text: 'Koyo',
            },
          ],
          text: 'Please, book me a table at Koyo',
        },
        {
          class: 'shopping',
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Bershka?',
        },
        {
          class: 'shopping',
          entities: [
            {
              end: 15,
              label: 'product',
              start: 8,
              text: 't-shirt',
            },
          ],
          text: 'Is this t-shirt available in Zara?',
        },
        {
          class: 'shopping',
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
          class: 'shopping',
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
          class: 'shopping',
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
