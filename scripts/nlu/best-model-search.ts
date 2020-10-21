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

const BEST_MODEL_DIR = ''

const PARAMS = { LEARNING_RATES: [5e-3, 1e-3], EPOCHS: [75, 100, 125] }

interface Result {
  learningRate: number
  epochs: number
  accuracy: number
}

const results: Result[] = []
let bestResult: Result = {
  learningRate: 0.005,
  epochs: 75,
  accuracy: 0.9891485809682805,
}

;(async () => {
  for (const lr of PARAMS.LEARNING_RATES) {
    for (const ep of PARAMS.EPOCHS) {
      console.log('Learning rate:', lr)
      console.log('Epochs:', ep)
      await nlu.createModel({
        template: ModelTemplatesType.SIMPLE_NN,
        learningRate: lr,
      })
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
