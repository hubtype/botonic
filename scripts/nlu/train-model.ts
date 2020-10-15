const { BotonicNLU } = require('../../packages/botonic-nlu/dist')

const nlu = new BotonicNLU()

const DATA_PATH = ''
const LANGUAGE = 'en'
const MAX_SEQ_LEN = 20

const data = nlu.loadData({
  path: DATA_PATH,
  language: LANGUAGE,
  maxSeqLen: MAX_SEQ_LEN,
})

const TEST_PERCENTAGE = 0.2

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: TEST_PERCENTAGE,
})

;(async () => {
  const EPOCHS = 25
  const LEARNING_RATE = 5e-4
  const MODEL_DIR = ''
  await nlu.createModel({
    learningRate: LEARNING_RATE,
    wordEmbeddingsType: 'glove',
    wordEmbeddingsDimension: 50,
  })
  await nlu.train(xTrain, yTrain, { epochs: EPOCHS })
  const accuracy = await nlu.evaluate(xTest, yTest)
  console.log('Accuracy:', accuracy)
  await nlu.saveModel(MODEL_DIR)
  console.log('Model saved.')
})()
