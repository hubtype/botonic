import { Codifier } from '../../src/preprocess/codifier'
import { Preprocessor } from '../../src/preprocess/preprocessor'
import { SampleProcessor } from '../../src/process/sample-processor'

describe('Sample Processor', () => {
  test('Process input', () => {
    const processor = new SampleProcessor(
      new Preprocessor('en', 12),
      new Codifier(
        [
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
        ],
        false
      )
    )
    const { sequence, input } = processor.processInput(
      'I love this leather jacket'
    )
    expect(sequence).toEqual([
      'i',
      'love',
      'leather',
      'jacket',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
    ])
    expect(input.arraySync()).toEqual([[2, 28, 20, 17, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
