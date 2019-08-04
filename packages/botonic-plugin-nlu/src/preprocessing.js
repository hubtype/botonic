import * as tf from '@tensorflow/tfjs'
import franc from 'franc'
import { replaceAll, clone } from './utils'
import { UNKNOWN_TOKEN } from './constants'

export class Tokenizer {
  constructor(vocabulary = null) {
    this.charsToShift = ["'", '.', ',', '?', '!']
    this.vocabulary = vocabulary
    this.vocabularyLength = vocabulary
      ? Object.keys(this.vocabulary).length
      : null
    this.minSeqLength = null
    this.maxSeqLength = null
  }

  tokenize(text) {
    let shifted = shiftSpecialChars(text, clone(this.charsToShift))
    return shifted.toLowerCase().split(' ')
  }

  tokenizeSamples(samples) {
    let tokenizedSamples = []
    for (let sample of samples) {
      tokenizedSamples.push(this.tokenize(sample))
    }
    return tokenizedSamples
  }

  fitOnSamples(samples) {
    let tokenizedSamples = this.tokenizeSamples(samples)
    this.vocabulary = generateVocabulary(tokenizedSamples)
    this.vocabularyLength = Object.keys(this.vocabulary).length
  }

  samplesToSequences(samples) {
    let tokenizedSamples = []
    let sequences = []
    if (typeof samples === 'string') {
      samples = [samples]
    }
    tokenizedSamples = this.tokenizeSamples(samples)
    for (let tokenizedSample of tokenizedSamples) {
      let sequence = []
      for (let token of tokenizedSample) {
        if (!(token in this.vocabulary)) {
          sequence.push(this.vocabulary[UNKNOWN_TOKEN])
        } else {
          sequence.push(this.vocabulary[token])
        }
      }
      sequences.push(sequence)
    }
    let { minSeqLength, maxSeqLength } = getSeqLengths(sequences)
    this.minSeqLength = minSeqLength
    this.maxSeqLength = maxSeqLength
    return sequences
  }
}

function shiftSpecialChars(userInput, charsToShift) {
  if (charsToShift.length == 0) {
    return userInput
  } else {
    let char = charsToShift.pop()
    let newInput = replaceAll(userInput, `${char}`, ` ${char}`)
    return shiftSpecialChars(newInput, charsToShift)
  }
}

function generateVocabulary(tokenizedSamples) {
  let vocabulary = {}
  vocabulary[UNKNOWN_TOKEN] = 0
  let c = 1 // Reserved for UNKNOWN_TOKEN
  for (let tokenizedSample of tokenizedSamples) {
    for (let token of tokenizedSample) {
      if (!(token in vocabulary)) {
        vocabulary[token] = c
        c++
      }
    }
  }
  return vocabulary
}

function getSeqLengths(sequences) {
  let seqLenghts = []
  for (let sequence of sequences) {
    seqLenghts.push(sequence.length)
  }
  return {
    minSeqLength: Math.min.apply(null, seqLenghts),
    maxSeqLength: Math.max.apply(null, seqLenghts)
  }
}

export function padSequences(sequences, maxSeqLength) {
  let paddedSequences = []
  for (let sequence of sequences) {
    let t = tf.tensor1d(sequence).pad([[maxSeqLength - sequence.length, 0]])
    paddedSequences.push(t)
  }
  return tf.stack(paddedSequences)
}

export function detectLang(input, langs) {
  let res = franc(input, { whitelist: langs })
  if (res === 'und') {
    res = langs[0]
  }
  return res
}
