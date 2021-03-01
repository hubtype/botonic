import { Codifier } from '../../../../src/preprocess/codifier'
import { Preprocessor } from '../../../../src/preprocess/preprocessor'
import { NerSampleProcessor } from '../../../../src/tasks/ner/process/ner-sample-processor'

describe('NER Sample Processor', () => {
  test('Process sample', () => {
    const processor = new NerSampleProcessor(
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
      ),
      new Codifier(['O', 'product', 'color', 'material', 'size'], true)
    )
    expect(
      processor
        .process([
          { class: '', entities: [], text: 'I love this leather jacket' },
        ])
        .x.arraySync()
    ).toEqual([[2, 28, 20, 17, 0, 0, 0, 0, 0, 0, 0, 0]])
  })
})
