import { join } from 'path'

import { BotonicNLU } from '../../packages/botonic-nlu'

const nlu = new BotonicNLU({})

const MODEL_DIR = ''
const MODEL_DATA_PATH = join(MODEL_DIR, 'model-data.json')
const MODEL_PATH = join(MODEL_DIR, 'model.json')

;(async () => {
  await nlu.loadModel(MODEL_PATH, MODEL_DATA_PATH)
  const prediction = nlu.predictProbabilities(
    'Please, book me a table in the best Italian food restaurant.'
  )
  console.log(prediction)
})()
