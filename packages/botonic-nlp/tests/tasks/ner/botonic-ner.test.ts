import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import * as generalHelper from '../../helpers/general-helper'
import * as nerHelper from '../../helpers/tasks/ner/helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = await BotonicNer.load(nerHelper.MODEL_DIR_PATH)
    expect(ner.locale).toEqual(nerHelper.LOCALE)
    expect(ner.maxLength).toEqual(nerHelper.MAX_SEQUENCE_LENGTH)
    expect(ner.entities).toEqual(nerHelper.ENTITIES)
    expect(ner.vocabulary).toEqual(nerHelper.VOCABULARY)
  })

  test('Load data', () => {
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_SEQUENCE_LENGTH)
    const { trainSet, testSet } = ner.splitDataset(nerHelper.DATASET)
    expect(trainSet.length).toEqual(4)
    expect(testSet.length).toEqual(1)
  })

  test('Generate vocabulary', () => {
    // arrange
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_SEQUENCE_LENGTH)

    // act
    ner.generateVocabulary([
      { text: 'this is a simple test', class: '', entities: [] },
    ])

    // assert
    expect(ner.vocabulary).toEqual(['<PAD>', '<UNK>', 'a', 'simple', 'test'])
  })

  test('Evaluate model', async () => {
    // arrange
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_SEQUENCE_LENGTH)
    const dataset = ner.loadDataset(generalHelper.SHOPPING_DATA_PATH)
    const { trainSet, testSet } = ner.splitDataset(dataset)
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
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_SEQUENCE_LENGTH)
    const dataset = ner.loadDataset(generalHelper.SHOPPING_DATA_PATH)
    const { trainSet } = ner.splitDataset(dataset)
    ner.generateVocabulary(trainSet)
    ner.compile()
    await ner.createModel('biLstm', nerHelper.testWordEmbeddingStorage)
    await ner.train(trainSet, 4, 8)

    // act
    const entities = ner.recognizeEntities('I love this t-shirt')

    // assert
    expect(entities.length).toEqual(3)
  })
})
