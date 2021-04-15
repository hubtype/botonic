import { Dataset } from '../../../src/dataset/dataset'
import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import * as constantsHelper from '../../helpers/constants-helper'
import * as nerHelper from '../../helpers/tasks/ner/helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = await BotonicNer.load(nerHelper.MODEL_DIR_PATH)
    expect(ner.locale).toEqual(nerHelper.LOCALE)
    expect(ner.maxLength).toEqual(nerHelper.MAX_SEQUENCE_LENGTH)
    expect(ner.entities).toEqual(nerHelper.ENTITIES)
    expect(ner.vocabulary).toEqual(nerHelper.VOCABULARY)
  })

  test('Generate vocabulary', () => {
    // arrange
    const ner = BotonicNer.with(
      nerHelper.LOCALE,
      nerHelper.MAX_SEQUENCE_LENGTH,
      nerHelper.ENTITIES
    )
    const dataset = Dataset.load(constantsHelper.SHOPPING_DATA_PATH)

    // act
    ner.generateVocabulary(dataset)

    // assert
    expect(ner.vocabulary).toEqual([
      '<PAD>',
      '<UNK>',
      't-shirt',
      'available',
      'bershka',
      'zara',
      'mango',
      'stradivarius',
      'pull&bear',
    ])
  })

  test('Evaluate model', async () => {
    // arrange
    const ner = BotonicNer.with(
      nerHelper.LOCALE,
      nerHelper.MAX_SEQUENCE_LENGTH,
      nerHelper.ENTITIES
    )
    const dataset = Dataset.load(constantsHelper.SHOPPING_DATA_PATH)
    const { trainSet, testSet } = dataset.split()
    ner.generateVocabulary(trainSet)
    ner.compile()
    await ner.createModel('biLstm', nerHelper.testWordEmbeddingStorage)
    await ner.train(trainSet, 4, 8)

    // act
    const { loss, accuracy } = await ner.evaluate(testSet)

    // assert
    expect(loss).toBeDefined()
    expect(accuracy).toBeDefined()
  })

  test('Recognize entities', async () => {
    // arrange
    const ner = BotonicNer.with(
      nerHelper.LOCALE,
      nerHelper.MAX_SEQUENCE_LENGTH,
      nerHelper.ENTITIES
    )
    const dataset = Dataset.load(constantsHelper.SHOPPING_DATA_PATH)
    const { trainSet } = dataset.split()
    ner.generateVocabulary(trainSet)
    ner.compile()
    await ner.createModel('biLstm', nerHelper.testWordEmbeddingStorage)
    await ner.train(trainSet, 4, 8)

    // act
    const entities = ner.recognizeEntities('I love this tshirt')

    // assert
    expect(entities.length).toEqual(3)
  })
})
