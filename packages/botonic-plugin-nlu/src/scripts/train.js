import path from 'path'
import { homedir } from 'os'
import * as tf from '@tensorflow/tfjs-node'
import { printPrettyConfig } from '../utils'
import { loadIntentsData, readJSON, saveResults } from '../fileUtils'
import { generateEmbeddingMatrix } from '../db-embeddings'
import { Tokenizer, padSequences } from '../preprocessing'
import {
  NLU_DIRNAME,
  NLU_CONFIG_FILENAME,
  WORD_EMBEDDINGS_PATH,
  INTENTS_DIRNAME
} from '../constants'

const developerPath = path.join(process.env.INIT_CWD, 'src')
const nluPath = path.join(developerPath, NLU_DIRNAME)
const intentsPath = path.join(nluPath, INTENTS_DIRNAME)

function preprocessData(data, config) {
  let tokenizer = new Tokenizer()
  tokenizer.fitOnSamples(data.samples)
  let sequences = tokenizer.samplesToSequences(data.samples)
  let seqLength = config.MAX_SEQ_LENGTH || tokenizer.maxSeqLength
  config.MAX_SEQ_LENGTH = seqLength
  let tensorData = padSequences(sequences, seqLength)
  console.log(`Shape of data tensor: [${tensorData.shape}]`)
  let tensorLabels = tf.oneHot(
    tf.tensor1d(data.labels, 'int32'),
    Object.keys(data.intentsDict).length
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

async function getEmbeddingMatrix({ vocabulary, vocabularyLength, config }) {
  let embeddingMatrix = await generateEmbeddingMatrix({
    dim1: vocabularyLength,
    dim2: config.EMBEDDING_DIM,
    vocabulary,
    wordEmbeddingsPath: path.join(
      homedir(),
      WORD_EMBEDDINGS_PATH,
      `${config.ALGORITHM}-${config.EMBEDDING_DIM}d-${config.LANG}.db`
    )
  })
  return tf.tensor(embeddingMatrix)
}

function embeddingLSTMModel({
  vocabularyLength,
  embeddingMatrix,
  config,
  outputDim
}) {
  let model = tf.sequential()
  model.add(
    tf.layers.embedding({
      inputDim: vocabularyLength,
      outputDim: config.EMBEDDING_DIM,
      inputLength: config.MAX_SEQ_LENGTH,
      trainable: config.TRAINABLE_EMBEDDINGS,
      weights: [embeddingMatrix]
    })
  )

  model.add(
    // tf.layers.bidirectional({
    //   layer: tf.layers.lstm({
    //     units: config.UNITS,
    //     dropout: config.DROPOUT_REG,
    //     recurrentDropout: config.DROPOUT_REG
    //   })
    // })
    tf.layers.lstm({
      units: config.UNITS,
      dropout: config.DROPOUT_REG,
      recurrentDropout: config.DROPOUT_REG
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

async function train() {
  let flagLang = process.argv.slice(3)[0]
  let options = readJSON(path.join(nluPath, NLU_CONFIG_FILENAME))
  if (flagLang) {
    options = options.filter(config => config.LANG === flagLang)
  }
  for (let config of options) {
    printPrettyConfig(config)
    let start = new Date()
    let data = loadIntentsData(path.join(intentsPath, `${config.LANG}`))
    let {
      tensorData,
      tensorLabels,
      vocabulary,
      vocabularyLength
    } = preprocessData(data, config)
    const model = embeddingLSTMModel({
      config,
      vocabularyLength,
      embeddingMatrix: await getEmbeddingMatrix({
        vocabulary,
        vocabularyLength,
        config
      }),
      outputDim: Object.keys(data.intentsDict).length
    })
    model.summary()
    model.compile({
      optimizer: tf.train.adam(config.LEARNING_RATE),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    })
    console.log('TRAINING...')

    const history = await model.fit(tensorData, tensorLabels, {
      epochs: config.EPOCHS,
      validationSplit: config.VALIDATION_SPLIT
    })
    // console.log('HISTORY', history)
    let end = new Date() - start
    console.log(`TOTAL TRAINING TIME: ${end}ms`)
    await saveResults({
      nluPath,
      maxSeqLength: config.MAX_SEQ_LENGTH,
      vocabulary,
      intentsDict: data.intentsDict,
      model,
      lang: config.LANG
    })
  }
}

train()
