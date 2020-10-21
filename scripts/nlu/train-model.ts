import { BotonicNLU } from '../../packages/botonic-nlu/src/botonic-nlu'
import { ModelTemplatesType } from '../../packages/botonic-nlu/src/types'

const nlu = new BotonicNLU({})

const data = nlu.loadData({
  path: '',
  language: 'en',
  maxSeqLen: 20,
})

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.2,
})

;(async () => {
  await nlu.createModel({
    template: ModelTemplatesType.SIMPLE_NN,
    learningRate: 5e-3,
  })
  await nlu.train(xTrain, yTrain, { epochs: 25 })
  const accuracy = await nlu.evaluate(xTest, yTest)
  console.log('Accuracy:', accuracy)
  await nlu.saveModel('')
  console.log('Model saved.')
})()
