import path from 'path'
import os from 'os'
import {
  readJSON,
  readDir,
  readFile,
  getIntentName,
  parseUtterance,
  pathExists,
  createDir,
  writeJSON
} from './file-utils'
import { Tokenizer, padSequences } from './preprocessing'
import { generateEmbeddingMatrix } from './db-embeddings'
import * as tf from '@tensorflow/tfjs-node'
import {
  filterObjectByWhitelist,
  parseLangFlag,
  shuffle,
  printPrettyConfig
} from './utils'
import {
  NLU_CONFIG_FILENAME,
  UTTERANCES_DIRNAME,
  MODELS_DIRNAME,
  WORD_EMBEDDINGS_PATH,
  NLU_DATA_FILENAME
} from './constants'

function getSamplesAndLabels(intents) {
  let { samples, labels } = intents.reduce(
    (result, intent) => {
      result.samples.push(intent.utterance)
      result.labels.push(intent.label)
      return result
    },
    { samples: [], labels: [] }
  )
  shuffle(samples, labels)
  return { samples, labels }
}
function preprocessData(devIntents, params) {
  let { samples, labels } = getSamplesAndLabels(devIntents.intents)
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

function initDevData(nluPath, languages) {
  let nluConfig = readJSON(path.join(nluPath, NLU_CONFIG_FILENAME))
  let devData = languages
    ? filterObjectByWhitelist(nluConfig, languages)
    : nluConfig
  Object.entries(devData).forEach(([lang, config]) => {
    config.utterancesDir = path.join(nluPath, UTTERANCES_DIRNAME, lang)
    config.modelsPath = path.join(nluPath, MODELS_DIRNAME, lang)
    config.devIntents = { intentsDict: {}, intents: [] }
    config.devEntities = { words: {}, tags: {}, tagList: [] }
    let utterancesDir = config.utterancesDir
    let utterancesFiles = readDir(utterancesDir)
    for (let [idx, file] of utterancesFiles.entries()) {
      config.devIntents.intentsDict[idx] = getIntentName(file)
      let utterances = readFile(path.join(utterancesDir, file)).split('\n')
      for (let utterance of utterances) {
        let { parsedUtterance, parsedEntities } = parseUtterance(utterance)
        config.devIntents.intents.push({
          rawUtterance: utterance,
          utterance: parsedUtterance,
          label: idx
        })
        for (let entity of parsedEntities) {
          let { type, value } = entity
          config.devEntities.words[`${value}`] = type
          config.devEntities.tags[`${type}`] = { isA: type }
          if (!config.devEntities.tagList.includes(type)) {
            config.devEntities.tagList.push(type)
          }
        }
      }
    }
  })
  return devData
}

function embeddingLSTMModel({
  vocabularyLength,
  embeddingMatrix,
  params,
  outputDim
}) {
  let model = tf.sequential()
  model.add(
    tf.layers.embedding({
      inputDim: vocabularyLength,
      outputDim: params.EMBEDDING_DIM,
      inputLength: params.MAX_SEQ_LENGTH,
      trainable: params.TRAINABLE_EMBEDDINGS,
      weights: [embeddingMatrix]
    })
  )

  model.add(
    // tf.layers.bidirectional({
    //   layer: tf.layers.lstm({
    //     units: params.UNITS,
    //     dropout: params.DROPOUT_REG,
    //     recurrentDropout: params.DROPOUT_REG
    //   })
    // })
    tf.layers.lstm({
      units: params.UNITS,
      dropout: params.DROPOUT_REG,
      recurrentDropout: params.DROPOUT_REG
    })
  )
  model.add(
    tf.layers.dense({
      units: outputDim,
      activation: 'softmax'
    })
  )
  return model
}

async function getEmbeddingMatrix({ vocabulary, vocabularyLength, params }) {
  let embeddingMatrix = await generateEmbeddingMatrix({
    dim1: vocabularyLength,
    dim2: params.EMBEDDING_DIM,
    vocabulary,
    wordEmbeddingsPath: path.join(
      os.homedir(),
      WORD_EMBEDDINGS_PATH,
      `${params.ALGORITHM}-${params.EMBEDDING_DIM}d-${params.LANG}.db`
    )
  })
  return tf.tensor(embeddingMatrix)
}

export class BotonicNLU {
  constructor({ nluPath, languages }) {
    this.nluPath = nluPath
    this.utterancesPath = path.join(nluPath, UTTERANCES_DIRNAME)
    this.modelsPath = path.join(nluPath, MODELS_DIRNAME)
    this.languages = languages || parseLangFlag(process.argv)
    this.devData = initDevData(this.nluPath, this.languages)
    this.languages = Object.keys(this.devData) // Update languages
    this.models = {}
  }

  async train() {
    for (let language of this.languages) {
      let devData = this.devData[`${language}`]
      let { devIntents, params, devEntities } = devData
      params = { ...params, LANG: language } // TODO: Think better about this
      printPrettyConfig(params)
      let start = new Date()
      let {
        tensorData,
        tensorLabels,
        vocabulary,
        vocabularyLength
      } = preprocessData(devIntents, params)
      this.models[`${language}`] = embeddingLSTMModel({
        params,
        vocabularyLength,
        embeddingMatrix: await getEmbeddingMatrix({
          vocabulary,
          vocabularyLength,
          params
        }),
        outputDim: Object.keys(devIntents.intentsDict).length
      })
      this.models[`${language}`].summary()
      this.models[`${language}`].compile({
        optimizer: tf.train.adam(params.LEARNING_RATE),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      })
      console.log('TRAINING...')
      let end = new Date() - start
      console.log(`TOTAL TRAINING TIME: ${end}ms`)
      const history = await this.models[`${language}`].fit(
        tensorData,
        tensorLabels,
        {
          epochs: params.EPOCHS,
          validationSplit: params.VALIDATION_SPLIT
        }
      )
      await saveResults({
        nluPath: this.nluPath,
        maxSeqLength: params.MAX_SEQ_LENGTH,
        vocabulary,
        intentsDict: devIntents.intentsDict,
        model: this.models[`${language}`],
        lang: language,
        devEntities: devEntities
      })
    }
  }
}

async function saveResults({
  nluPath,
  maxSeqLength,
  vocabulary,
  intentsDict,
  model,
  lang,
  devEntities
}) {
  let modelsPath = path.join(nluPath, MODELS_DIRNAME)
  let resultsPath = path.join(modelsPath, `${lang}`)
  if (!pathExists(modelsPath)) {
    createDir(modelsPath)
  }
  if (!pathExists(resultsPath)) {
    createDir(resultsPath)
  }
  console.log('Saving intents and entities...')
  console.log('Saving word index...')
  let nluData = {
    maxSeqLength,
    vocabulary,
    intentsDict,
    lang,
    devEntities
  }
  console.log('Saving model...')
  await model.save(`file://${resultsPath}`)
  writeJSON(`${resultsPath}/${NLU_DATA_FILENAME}`, nluData)
}
