import { VocabularyGenerator } from '../../src/preprocess/vocabulary-generator'
import * as helper from '../helpers/tools-helper'

describe('Vocabulary Generator', () => {
  test('Generation of the vocabulary', () => {
    const sut = new VocabularyGenerator(helper.preprocessor)
    expect(
      sut.generate([
        { text: 'this is a test', entities: [], class: 'BuyProduct' },
        {
          text: 'testing vocabulary generator',
          entities: [],
          class: 'ReturnProduct',
        },
      ])
    ).toEqual(['a', 'test', 'testing', 'vocabulary', 'generator'])
  })
})
