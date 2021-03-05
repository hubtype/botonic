import { Preprocessor } from '../../src/preprocess/preprocessor'
import { VocabularyGenerator } from '../../src/preprocess/vocabulary-generator'

describe('Vocabulary Generator', () => {
  test('Generation of the vocabulary', () => {
    const generator = new VocabularyGenerator(new Preprocessor('en', 4))
    expect(
      generator.generate([
        { text: 'Where is my order?', entities: [], class: '' },
        {
          text: 'I want to return the products of this order',
          entities: [],
          class: '',
        },
        { text: "I don't like this t-shirt?", entities: [], class: '' },
      ])
    ).toEqual([
      'where',
      'order',
      '?',
      'i',
      'want',
      'return',
      'products',
      "n't",
      't-shirt',
    ])
  })
})
