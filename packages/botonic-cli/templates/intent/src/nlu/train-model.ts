import { BotonicNLU, ModelTemplatesType } from '@botonic/nlu'
import { join } from 'path'

const nlu = new BotonicNLU()
const LANGUAGE = 'en'
const data = nlu.readData({
  path: join(process.cwd(), 'src', 'nlu', 'utterances', LANGUAGE),
  language: LANGUAGE,
  maxSeqLen: 20,
})

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.1,
  stratify: true,
})

;(async () => {
  await nlu.createModel({
    template: ModelTemplatesType.SIMPLE_NN,
    learningRate: 5e-3,
    trainableEmbeddings: true,
  })
  await nlu.train(xTrain, yTrain, { epochs: 8 })
  await nlu.saveModel()
  console.log('Model saved.')
})()
