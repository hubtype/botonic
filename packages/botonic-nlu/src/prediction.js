import * as tf from '@tensorflow/tfjs'
import { Tokenizer, padSequences } from './preprocessing'
import { getEntities } from './ner'

export function getPrediction(input, model, nluData) {
  let tokenizer = new Tokenizer(nluData.vocabulary)
  let sequence = tokenizer.samplesToSequences(input)[0]
  let paddedSequence = padSequences([sequence], nluData.maxSeqLength).dataSync()
  return model.predict(tf.tensor([paddedSequence])).dataSync()
}
export function getIntent(prediction, intentsDict, language) {
  let intent = {}
  intent.intents = Array.from(prediction)
    .map((confidence, i) => ({
      intent: `${intentsDict[i]}`,
      confidence: confidence
    }))
    .sort((a, b) => b.confidence - a.confidence)
  intent.language = language
  intent.intent = intent.intents[0].intent
  intent.confidence = intent.intents[0].confidence
  return intent
}

export { getEntities }
