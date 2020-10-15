import { join } from 'path'

const { BotonicNLU } = require('../../packages/botonic-nlu/dist')

const nlu = new BotonicNLU()

const MODEL_DIR = ''
const MODEL_DATA_PATH = join(MODEL_DIR, 'model-data.json')
const MODEL_PATH = join(MODEL_DIR, 'model.json')

nlu.loadModelData(MODEL_DATA_PATH)
;(async () => {
  await nlu.loadModel(MODEL_PATH)
  const prediction = nlu.predictProbabilities(
    'Please, book me a table in the best Italian food restaurant.'
  )
  console.log(prediction)
})()
