import { join } from 'path'

import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import { NerModelLoader } from '../../../src/tasks/ner/loaders/ner-model-loader'
import {
  databaseManager,
  dataLoader,
  ENTITIES,
  LOCALE,
  MAX_LENGTH,
  MODEL_NAME,
  preprocessor,
  VOCABULARY,
} from '../../helpers/tasks/ner/test-helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const ner = BotonicNer.from(
      await NerModelLoader.from(
        join(__dirname, '..', '..', 'helpers', 'models', 'ner')
      )
    )
    expect(ner.model.name).toEqual(MODEL_NAME)
    expect(ner.locale).toEqual(LOCALE)
    expect(ner.maxLength).toEqual(MAX_LENGTH)
    expect(ner.entities).toEqual(ENTITIES)
    expect(ner.vocabulary).toEqual(VOCABULARY)
  })

  test('Load data', () => {
    const ner = BotonicNer.with(LOCALE, MAX_LENGTH)
    const { train, test } = ner.loadData(dataLoader)
    expect(train.length).toEqual(4)
    expect(test.length).toEqual(1)
  })

  test('Generate vocabulary', () => {
    // arrange
    const ner = BotonicNer.with('en', 12)
    ner.loadPreprocessor(preprocessor)
    console.log(ner.preprocessor.engines.stopwords)

    // act
    ner.generateVocabulary([
      { text: 'this is a simple test', class: '', entities: [] },
    ])

    // assert
    expect(ner.vocabulary).toEqual(['<PAD>', '<UNK>', 'a', 'simple', 'test'])
  })

  test('Create model', async () => {
    // arrange
    const ner = BotonicNer.with(LOCALE, MAX_LENGTH)
    const { train } = ner.loadData(dataLoader)
    ner.loadPreprocessor(preprocessor)
    ner.generateVocabulary(train)
    ner.compile()

    // act
    await ner.createModel('biLstm', databaseManager)

    // assert
    expect(ner.model.name).toEqual('BiLstmNerModel')
  })

  test('Evaluate model', async () => {
    // arrange
    const ner = BotonicNer.with(LOCALE, MAX_LENGTH)
    const { train, test } = ner.loadData(dataLoader)
    ner.loadPreprocessor(preprocessor)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', databaseManager)
    await ner.train(train, 4, 8)

    // act
    const { loss, accuracy } = await ner.evaluate(test)

    // assert
    expect(loss).toBeLessThan(1)
    expect(accuracy).toBeGreaterThan(0.5)
  })

  test('Recognize entities', async () => {
    // arrange
    const ner = BotonicNer.with(LOCALE, MAX_LENGTH)
    const { train } = ner.loadData(dataLoader)
    ner.loadPreprocessor(preprocessor)
    ner.generateVocabulary(train)
    ner.compile()
    await ner.createModel('biLstm', databaseManager)
    await ner.train(train, 4, 8)

    // act
    const entities = ner.recognizeEntities('I love this t-shirt')

    // assert
    expect(entities.length).toEqual(3)
  })
})
