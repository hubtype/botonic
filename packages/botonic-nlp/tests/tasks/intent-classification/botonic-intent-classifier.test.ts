import { DatabaseStorage } from '../../../src/embeddings/database/storage'
import { BotonicIntentClassifier } from '../../../src/tasks/intent-classification/botonic-intent-classifier'
import { INTENT_CLASSIFIER_TEMPLATE } from '../../../src/tasks/intent-classification/models/types'
import * as constantsHelper from '../../helpers/constants-helper'
import * as toolsHelper from '../../helpers/tools-helper'

describe('Botonic Intent Classifier', () => {
  const { trainSet, testSet } = toolsHelper.dataset.split()
  const vocabulary = trainSet.extractVocabulary(toolsHelper.preprocessor)
  const sut = new BotonicIntentClassifier(
    {
      locale: constantsHelper.LOCALE,
      maxLength: constantsHelper.MAX_SEQUENCE_LENGTH,
      vocabulary: vocabulary,
      intents: constantsHelper.INTENTS,
    },
    toolsHelper.preprocessor
  )

  test('Train and Evaluate model', async () => {
    const model = await sut.createModel(
      INTENT_CLASSIFIER_TEMPLATE.SIMPLE_NN,
      await DatabaseStorage.with(
        constantsHelper.LOCALE,
        constantsHelper.EMBEDDINGS_TYPE,
        constantsHelper.EMBEDDINGS_DIMENSION
      )
    )
    sut.setModel(model)
    await sut.train(trainSet, 4, 8)

    const { accuracy, loss } = await sut.evaluate(testSet)

    expect(accuracy).toBeGreaterThan(0.01)
    expect(loss).toBeLessThan(2)
  })

  test('Classify Intent', async () => {
    const sut = await BotonicIntentClassifier.load(
      constantsHelper.INTENT_CLASSIFIER_MODEL_DIR_PATH,
      toolsHelper.preprocessor
    )

    const intents = sut.classify('I want to return this jacket')

    expect(intents.length).toEqual(constantsHelper.INTENTS.length)
    expect(intents[0].label).toEqual('ReturnProduct')
  })
})
