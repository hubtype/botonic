import { DatasetLoader } from '../../src/dataset/loader'
import * as helper from '../helpers/helper'

describe('Dataset Loader', () => {
  test('Loading Dataset from file', () => {
    expect(DatasetLoader.load(helper.SHOPPING_DATA_PATH)).toEqual({
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

  test('Loading Dataset from directory', () => {
    expect(DatasetLoader.load(helper.DATA_DIR_PATH)).toEqual({
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
