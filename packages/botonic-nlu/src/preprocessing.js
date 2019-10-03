import * as tf from '@tensorflow/tfjs'
import franc from 'franc'
import langs from 'langs'
import { replaceAll, clone, shuffle } from './utils'
import {
  UNKNOWN_TOKEN,
  GLOBAL_ENTITIES_REGEX,
  ENTITIES_REGEX
} from './constants'

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
    return samples.map(sample => this.tokenize(sample))
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
  let seqLengths = []
  for (let sequence of sequences) {
    seqLengths.push(sequence.length)
  }
  return {
    minSeqLength: Math.min.apply(null, seqLengths),
    maxSeqLength: Math.max.apply(null, seqLengths)
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
  let res = franc(input, { whitelist: langs.map(l => langs.where('1', l)[3]) })
  if (res === 'und') {
    return langs[0]
  }
  return langs.where('3', res)[1]
}

/**
 * Given a training example utterance extracts its entities (if exist)
 * and returns a valid utterance for training with its entities.
 * E.g.:
 * Input: 'I would like to go to [Barcelona](Place)'
 * Output:
 * parsedUtterance: 'I would like to go to Barcelona',
 * parsedEntities: [ { raw: '[Barcelona](Place)', value: 'Barcelona', type: 'Place' } ]
 * @param {string} utterance Training example utterance
 * @returns {object} {parsedUtterance, parsedEntities}
 */
export function parseUtterance(utterance) {
  let capturedGroups = utterance.match(GLOBAL_ENTITIES_REGEX) || []
  let parsedEntities = capturedGroups
    .map(matched => ENTITIES_REGEX.exec(matched))
    .map(parsedEntity => ({
      raw: parsedEntity[0],
      value: parsedEntity[1],
      type: parsedEntity[2]
    }))
  for (let entity of parsedEntities) {
    utterance = utterance.replace(entity.raw, entity.value)
  }
  return { parsedUtterance: utterance, parsedEntities }
}

export function preprocessData(devIntents, params) {
  let { samples, labels } = getShuffledSamplesAndLabels(devIntents.intents)
  let tokenizer = new Tokenizer()
  tokenizer.fitOnSamples(samples)
  let sequences = tokenizer.samplesToSequences(samples)
  let seqLength = params.MAX_SEQ_LENGTH || tokenizer.maxSeqLength
  params.MAX_SEQ_LENGTH = seqLength
  let tensorData = padSequences(sequences, seqLength)
  console.log(`Shape of data tensor: [${tensorData.shape}]`)
  let tensorLabels = tf.oneHot(
    tf.tensor1d(labels, 'int32'),
    Object.keys(devIntents.intentsDict).length
  )
  console.log(`Shape of label tensor: [${tensorLabels.shape}]`)
  let vocabularyLength = tokenizer.vocabularyLength
  console.log(`Found ${vocabularyLength} unique tokens`)
  return {
    tensorData,
    tensorLabels,
    vocabulary: tokenizer.vocabulary,
    vocabularyLength: tokenizer.vocabularyLength
  }
}

function getShuffledSamplesAndLabels(intents) {
  let samples = intents.map(intent => intent.utterance)
  let labels = intents.map(intent => intent.label)
  shuffle(samples, labels)
  return { samples, labels }
}
