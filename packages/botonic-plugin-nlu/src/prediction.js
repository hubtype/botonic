import { tensor, tensor1d } from '@tensorflow/tfjs'
import franc from 'franc'
import langs from 'langs'

export function detectLang(input, languages) {
  const res = franc(input, {
    whitelist: languages.map(l => langs.where('1', l)[3]),
  })
  if (res === 'und') return languages[0]
  return langs.where('3', res)[1]
}

export function predictionToIntent(prediction, intentsDict, language) {
  const intent = {}
  intent.intents = Array.from(prediction)
    .map((confidence, i) => ({
      intent: intentsDict[i],
      confidence: confidence,
    }))
    .sort((a, b) => b.confidence - a.confidence)
  intent.language = language
  intent.intent = intent.intents[0].intent
  intent.confidence = intent.intents[0].confidence
  return intent
}

export function inputToTensor(input, preprocessor) {
  const paddedSequence = tensor1d(preprocessor.preprocess(input))
  return tensor([paddedSequence.dataSync()])
}
