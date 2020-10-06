import { tensor, tensor1d } from '@tensorflow/tfjs'
import franc from 'franc'
import langs from 'langs'

export function detectLang(input, languages) {
  const res = franc(input, {
    whitelist: languages.map(l => langs.where('1', l)[3]),
  })
  if (res === 'und') {
    return languages[0]
  }
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

export function inputToSequence(input, tokenizer, vocabulary, maxSeqLength) {
  const tokenized = tokenizer.tokenize(input)
  const sequence = []
  for (const token of tokenized) {
    if (!(token in vocabulary)) sequence.push(vocabulary['<UNK>'])
    else sequence.push(vocabulary[token])
  }
  const paddedSequence = tensor1d(sequence).pad([
    [maxSeqLength - sequence.length, 0],
  ])
  return paddedSequence
}

export function inputToTensor(input, tokenizer, vocabulary, maxSeqLength) {
  const paddedSequence = inputToSequence(
    input,
    tokenizer,
    vocabulary,
    maxSeqLength
  )
  return tensor([paddedSequence.dataSync()])
}
