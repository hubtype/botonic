import franc from 'franc'
import langs from 'langs'
import { Rank, Tensor, tensor, tensor1d } from '@tensorflow/tfjs'
import { Language } from '@botonic/nlu/dist/language'
import { IntentDecoder } from '@botonic/nlu/dist/types'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'

import { Result } from './types'

export function detectLang(input: string, languages: Language[]): Language {
  const res = franc(input, {
    whitelist: languages.map(l => langs.where('1', l)[3]),
  })
  if (res === 'und') return languages[0]
  return langs.where('3', res)[1]
}

export function predictionToIntent(
  prediction: Tensor<Rank> | Tensor<Rank>[],
  intentsDecoder: IntentDecoder,
  language: Language
): Result {
  const intent: any = {}
  intent.intents = Array.from((prediction as Tensor).dataSync())
    .map((confidence, i) => ({
      intent: intentsDecoder[i],
      confidence: confidence,
    }))
    .sort((a: any, b: any) => b.confidence - a.confidence)
  intent.language = language
  intent.intent = intent.intents[0].intent
  intent.confidence = intent.intents[0].confidence
  return intent
}

export function inputToTensor(
  input: string,
  preprocessor: Preprocessor
): Tensor {
  const paddedSequence = tensor1d(preprocessor.preprocess(input))
  return tensor([paddedSequence.dataSync()])
}
