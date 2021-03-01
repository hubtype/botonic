import { join } from 'path'

import { NerModelLoader } from '../../../../src/tasks/ner/loaders/ner-model-loader'

describe('Ner Model Loader', () => {
  test('locale loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'utils', 'model')
    )
    expect(loader.locale).toEqual('en')
  })

  test('maxLength loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'utils', 'model')
    )
    expect(loader.maxLength).toEqual(12)
  })

  test('vocabulary loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'utils', 'model')
    )
    expect(loader.vocabulary).toEqual([
      '<PAD>',
      '<UNK>',
      'i',
      'looking',
      'a',
      'size',
      'xxs',
      'wool',
      'belts',
      'xs',
      'hate',
      'gray',
      'linen',
      'hat',
      'hoodie',
      'm',
      '?',
      'jacket',
      's',
      'blue',
      'leather',
      'pink',
      't-shirt',
      'fur',
      'cotton',
      'xl',
      'shirt',
      'l',
      'love',
      '.',
      'xxl',
      'red',
      'can',
      'someone',
      'tell',
      'where',
      'buy',
      'want',
      'return',
      'not',
      'white',
      'orange',
      'sale',
      'brown',
      'allergic',
      'black',
      'material',
      'jeans',
      'understand',
      'people',
      'coats',
      'clothes',
      'new',
      'trousers',
      'who',
      'wears',
      'coat',
    ])
  })

  test('entities loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'utils', 'model')
    )
    expect(loader.entities).toEqual([
      'O',
      'product',
      'color',
      'material',
      'size',
    ])
  })

  test('model loaded', async () => {
    const loader = await NerModelLoader.from(
      join(__dirname, '..', '..', '..', 'utils', 'model')
    )
    expect(loader.model.name).toEqual('BiLstmNerModel')
  })
})
