import { join } from 'path'

import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import * as helper from '../../helpers/tasks/ner/helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = await BotonicNer.load(helper.MODEL_DIR_PATH)
    expect(ner.locale).toEqual(helper.LOCALE)
    expect(ner.maxLength).toEqual(helper.MAX_LENGTH)
    expect(ner.entities).toEqual(helper.ENTITIES)
    expect(ner.vocabulary).toEqual(helper.VOCABULARY)
  })

  test('Load data', () => {
    const ner = BotonicNer.with(helper.LOCALE, helper.MAX_LENGTH)
    const { train, test } = ner.loadData(helper.dataLoader)
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })

  test('Generate vocabulary', () => {
    // arrange
    const ner = BotonicNer.with(helper.LOCALE, helper.MAX_LENGTH)
    ner.loadPreprocessor(helper.preprocessor)

    // act
    ner.generateVocabulary([
      { text: 'this is a simple test', class: '', entities: [] },
    ])

    // assert
    expect(ner.vocabulary).toEqual(['<PAD>', '<UNK>', 'a', 'simple', 'test'])
  })

  test('Evaluate model', async () => {
    // arrange
    const ner = BotonicNer.with(helper.LOCALE, helper.MAX_LENGTH)
    const { train, test } = ner.loadData(helper.dataLoader)
    ner.loadPreprocessor(helper.preprocessor)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', await helper.getDatabaseManager())
    await ner.train(train, 4, 8)

    // act
    const { loss, accuracy } = await ner.evaluate(test)

    // assert
    expect(loss).toBeDefined()
    expect(accuracy).toBeDefined()
  })

  test('Recognize entities', async () => {
    // arrange
    const ner = BotonicNer.with(helper.LOCALE, helper.MAX_LENGTH)
    const { train } = ner.loadData(helper.dataLoader)
    ner.loadPreprocessor(helper.preprocessor)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', await helper.getDatabaseManager())
    await ner.train(train, 4, 8)

    // act
    const entities = ner.recognizeEntities('I love this t-shirt')

    // assert
    expect(entities.length).toEqual(3)
  })
})
