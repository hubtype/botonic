import { BotonicNLU, ModelTemplatesType } from '../../packages/botonic-nlu/'

const nlu = new BotonicNLU({})

const data = nlu.readData({
  path: '/home/eric/Documents/Botonic/nlu/Dataset/Data/data.csv',
  language: 'en',
  maxSeqLen: 20,
  csvSeparator: ';',
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
