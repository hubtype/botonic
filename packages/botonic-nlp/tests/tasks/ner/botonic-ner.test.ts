import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../../src/preprocess/constants'
import { BotonicNer } from '../../../src/tasks/ner/botonic-ner'
import { NER_TEMPLATE } from '../../../src/tasks/ner/models/types'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic NER', () => {
  test('Loading model', async () => {
    const sut = await BotonicNer.load(constantsHelper.NER_MODEL_DIR_PATH)
    expect(sut.locale).toEqual(constantsHelper.LOCALE)
    expect(sut.maxLength).toEqual(constantsHelper.MAX_SEQUENCE_LENGTH)
    expect(sut.entities).toEqual(['O'].concat(constantsHelper.ENTITIES))
    expect(sut.vocabulary).toEqual(constantsHelper.VOCABULARY)
  })

  test('Generate vocabulary', () => {
    // arrange
    const sut = BotonicNer.with(
      constantsHelper.LOCALE,
      constantsHelper.MAX_SEQUENCE_LENGTH,
      constantsHelper.ENTITIES
    )

    // act
    const { trainSet } = toolsHelper.dataset.split()
    sut.generateVocabulary(trainSet)

    // assert
    expect(sut.vocabulary.length).toBeGreaterThan(2)
    expect(sut.vocabulary.includes(PADDING_TOKEN)).toBeTruthy()
    expect(sut.vocabulary.includes(UNKNOWN_TOKEN)).toBeTruthy()
  })

  test('Evaluate model', async () => {
    // arrange
    const sut = BotonicNer.with(
      constantsHelper.LOCALE,
      constantsHelper.MAX_SEQUENCE_LENGTH,
      constantsHelper.ENTITIES
    )
    const { trainSet, testSet } = toolsHelper.dataset.split()
    sut.generateVocabulary(trainSet)
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
    const sut = await BotonicNer.load(constantsHelper.NER_MODEL_DIR_PATH)
    sut.compile()

    // act
    const entities = sut.recognizeEntities('I want to return this jacket')

    // assert
    expect(entities.length).toEqual(1)
    expect(entities.map(e => e.label)).toEqual(['product'])
    expect(entities.map(e => e.text)).toEqual(['jacket'])
  })
})
