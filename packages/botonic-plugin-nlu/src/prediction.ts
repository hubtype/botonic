import type { NluResult } from '@botonic/core'
import { Language } from '@botonic/nlu/dist/language'
import { Preprocessor } from '@botonic/nlu/dist/preprocessor'
import { IntentDecoder } from '@botonic/nlu/dist/types'
import { Tensor, tensor, tensor1d } from '@tensorflow/tfjs'
import franc from 'franc'
import langs from 'langs'

export function detectLang(input: string, languages: Language[]): Language {
  const res = franc(input, {
    whitelist: languages.map(l => langs.where('1', l)[3]),
  })
  if (res === 'und') return languages[0]
  return langs.where('3', res)[1]
}

export function predictionToIntent(
  prediction: Tensor,
  intentsDecoder: IntentDecoder,
  language: Language
): NluResult {
  const intents = Array.from(prediction.dataSync())
    .map((confidence, i) => ({
      intent: intentsDecoder[i],
      confidence: confidence,
    }))
    .sort((a, b) => b.confidence - a.confidence)
  return {
    language,
    intents,
    intent: intents[0].intent,
    confidence: intents[0].confidence,
  }
}

export function inputToTensor(
  input: string,
  preprocessor: Preprocessor
): Tensor {
  const paddedSequence = tensor1d(preprocessor.preprocess(input))
  return tensor([paddedSequence.dataSync()])
}
