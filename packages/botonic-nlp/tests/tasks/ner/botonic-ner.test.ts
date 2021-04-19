import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import { NER_TEMPLATE } from '../../../src/tasks/ner/models/types'
import { NEUTRAL_ENTITY } from '../../../src/tasks/ner/process/constants'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const sut = await BotonicNer.load(
      constantsHelper.NER_MODEL_DIR_PATH,
      toolsHelper.preprocessor
    )
    expect(sut.locale).toEqual(constantsHelper.LOCALE)
    expect(sut.maxLength).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sut.entities).toEqual(
      [NEUTRAL_ENTITY].concat(constantsHelper.ENTITIES)
    )
    expect(sut.vocabulary).toEqual(constantsHelper.VOCABULARY)
  })

  test('Evaluate model', async () => {
    // arrange
    const { trainSet, testSet } = toolsHelper.dataset.split()
    const vocabulary = trainSet.extractVocabulary(toolsHelper.preprocessor)
    const sut = new BotonicNer(
      constantsHelper.LOCALE,
      constantsHelper.MAX_SEQUENCE_LENGTH,
      constantsHelper.ENTITIES,
      vocabulary,
      toolsHelper.preprocessor
    )
    sut.compile()
    const model = await sut.createModel(
      NER_TEMPLATE.BILSTM,
      toolsHelper.wordEmbeddingStorage
    )
    sut.setModel(model)
    await sut.train(trainSet, 4, 8)

    // act
    const { loss, accuracy } = await sut.evaluate(testSet)

    // assert
    expect(loss).toBeLessThan(3)
    expect(accuracy).toBeGreaterThan(0)
  })

  test('Recognize entities', async () => {
    // arrange
    const sut = await BotonicNer.load(
      constantsHelper.NER_MODEL_DIR_PATH,
      toolsHelper.preprocessor
    )
    sut.compile()

    // act
    const entities = sut.recognizeEntities('I want to return this jacket')

    // assert
    expect(entities.length).toEqual(1)
    expect(entities.map(e => e.label)).toEqual(['product'])
    expect(entities.map(e => e.text)).toEqual(['jacket'])
  })
})
