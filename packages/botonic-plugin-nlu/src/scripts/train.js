import path from 'path'
import { homedir } from 'os'
import * as tf from '@tensorflow/tfjs-node'
import { loadIntentsData, saveResults, printPrettyConfig } from '../utils'
import { generateEmbeddingMatrix } from '../db-embeddings'
import { Tokenizer, padSequences } from '../preprocessing'
import fs from 'fs'
import {
  NLU_PATH,
  NLU_CONFIG_PATH,
  WORD_EMBEDDINGS_PATH,
  INTENTS_DIRNAME
} from '../constants'

async function train() {
  let flagLang = process.argv.slice(3)[0]
  let projectPath = process.env.INIT_CWD
  let nluPath = path.join(projectPath, NLU_PATH)
  let options = JSON.parse(
    fs.readFileSync(path.join(projectPath, NLU_CONFIG_PATH))
  )

  if (flagLang) {
    options = options.filter(config => config.LANG === flagLang)
  }
  for (let config of options) {
    printPrettyConfig(config)
    let start = new Date()
    let lang = config.LANG
    let intentsPath = path.join(nluPath, INTENTS_DIRNAME, `${lang}`)
    let { samples, labels, intentsDict } = loadIntentsData({
      intentsPath
    })

    let tokenizer = new Tokenizer()
    tokenizer.fitOnSamples(samples)
    let sequences = tokenizer.samplesToSequences(samples)
    let maxSeqLength = config.MAX_SEQ_LENGTH || tokenizer.maxSeqLength
    let vocabulary = tokenizer.vocabulary
    let vocabularyLength = tokenizer.vocabularyLength
    console.log(`Found ${vocabularyLength} unique tokens`)

    let tensorData = padSequences(sequences, maxSeqLength)
    console.log(`Shape of data tensor: [${tensorData.shape}]`)

    let tensorLabels = tf.oneHot(
      tf.tensor1d(labels, 'int32'),
      Object.keys(intentsDict).length
    )
    console.log(`Shape of label tensor: [${tensorLabels.shape}]`)
    let embeddingMatrix = await generateEmbeddingMatrix({
      dim1: vocabularyLength,
      dim2: config.EMBEDDING_DIM,
      vocabulary,
      wordEmbeddingsPath: path.join(
        homedir(),
        WORD_EMBEDDINGS_PATH,
        `${config.ALGORITHM}-${config.EMBEDDING_DIM}d-${lang}.db`
      )
    })

    embeddingMatrix = tf.tensor(embeddingMatrix)
    console.log(`Shape of embedding matrix: [${embeddingMatrix.shape}]`)

    const model = tf.sequential()
    model.add(
      tf.layers.embedding({
        inputDim: vocabularyLength,
        outputDim: config.EMBEDDING_DIM,
        inputLength: maxSeqLength,
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
        units: Object.keys(intentsDict).length,
        activation: 'softmax'
      })
    )
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
      maxSeqLength,
      vocabulary,
      intentsDict,
      model,
      lang
    })
  }
}

train()
