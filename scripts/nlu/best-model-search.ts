const { BotonicNLU } = require('../../packages/botonic-nlu/dist')

const nlu = new BotonicNLU()

const DATA_PATH = ''
const LANGUAGE = 'en'
const MAX_SEQ_LEN = 20

var data = nlu.loadData({
  path: DATA_PATH,
  language: LANGUAGE,
  maxSeqLen: MAX_SEQ_LEN,
})

const TEST_PERCENTAGE = 0.2

var [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: TEST_PERCENTAGE,
})

const BEST_MODEL_DIR = ''

const MIN_LEARNING_RATE = 1e-5
const MAX_LEARNING_RATE = 0.1
const MIN_EPOCHS = 25
const MAX_EPOCHS = 100
const EPOCHS_STEP = 25

interface Result {
  learningRate: number
  epochs: number
  accuracy: number
}
var results: Result[] = []
var bestResult: Result = {
  learningRate: MAX_LEARNING_RATE,
  epochs: MIN_EPOCHS,
  accuracy: 0.0,
}

;(async () => {
  for (let lr = MAX_LEARNING_RATE; lr > MIN_LEARNING_RATE; lr /= 10) {
    for (let ep = MIN_EPOCHS; ep < MAX_EPOCHS; ep += EPOCHS_STEP) {
      await nlu.createModel({ learningRate: lr })
      await nlu.train(xTrain, yTrain, { epochs: ep })
      const acc = await nlu.evaluate(xTest, yTest)
      const result: Result = { learningRate: lr, epochs: ep, accuracy: acc }
      console.log('RESULT:\t', result)
      results.push({ learningRate: lr, epochs: ep, accuracy: acc })
      if (bestResult.accuracy < result.accuracy) {
        bestResult = result
        await nlu.saveModel(BEST_MODEL_DIR)
      }
    }
  }
  console.log('All Results:')
  results.forEach(result => console.log(result))

  console.log('Best Result:', bestResult)
})()
