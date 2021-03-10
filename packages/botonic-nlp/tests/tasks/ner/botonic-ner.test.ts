import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import * as nlpHelper from '../../helpers/helper'
import * as nerHelper from '../../helpers/tasks/ner/helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = await BotonicNer.load(nerHelper.MODEL_DIR_PATH)
    expect(ner.locale).toEqual(nerHelper.LOCALE)
    expect(ner.maxLength).toEqual(nerHelper.MAX_LENGTH)
    expect(ner.entities).toEqual(nerHelper.ENTITIES)
    expect(ner.vocabulary).toEqual(nerHelper.VOCABULARY)
  })

  test('Load data', () => {
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_LENGTH)
    const { train, test } = ner.splitDataset(nerHelper.DATASET)
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })

  test('Generate vocabulary', () => {
    // arrange
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_LENGTH)

    // act
    ner.generateVocabulary([
      { text: 'this is a simple test', class: '', entities: [] },
    ])

    // assert
    expect(ner.vocabulary).toEqual(['<PAD>', '<UNK>', 'a', 'simple', 'test'])
  })

  test('Evaluate model', async () => {
    // arrange
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_LENGTH)
    const dataset = ner.loadDataset(nlpHelper.SHOPPING_DATA_PATH)
    const { train, test } = ner.splitDataset(dataset)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', nerHelper.testWordEmbeddingManager)
    await ner.train(train, 4, 8)

    // act
    const { loss, accuracy } = await ner.evaluate(test)

    // assert
    expect(loss).toBeDefined()
    expect(accuracy).toBeDefined()
  })

  test('Recognize entities', async () => {
    // arrange
    const ner = BotonicNer.with(nerHelper.LOCALE, nerHelper.MAX_LENGTH)
    const dataset = ner.loadDataset(nlpHelper.SHOPPING_DATA_PATH)
    const { train } = ner.splitDataset(dataset)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', nerHelper.testWordEmbeddingManager)
    await ner.train(train, 4, 8)

    // act
    const entities = ner.recognizeEntities('I love this t-shirt')

    // assert
    expect(entities.length).toEqual(3)
  })
})
