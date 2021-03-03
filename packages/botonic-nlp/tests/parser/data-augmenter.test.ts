import { DataAugmenter } from '../../src/parser/data-augmenter'

describe('Data augmentation', () => {
  test('Generating variations of the given samples', () => {
    const augmenter = new DataAugmenter(
      { product: ['jacket', 'hoodie'], material: ['leather', 'cotton'] },
      ['O', 'product']
    )
    expect(
      augmenter.augment([
        'Where can I buy this [material] [product]?',
        "I don't like this [material] [jacket](product)",
      ])
    ).toEqual([
      'Where can I buy this cotton [hoodie](product)?',
      'Where can I buy this cotton [jacket](product)?',
      'Where can I buy this leather [hoodie](product)?',
      'Where can I buy this leather [jacket](product)?',
      "I don't like this cotton [jacket](product)",
      "I don't like this leather [jacket](product)",
    ])
  })
})
