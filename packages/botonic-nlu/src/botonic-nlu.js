import path from 'path'
import { readJSON, readDir } from './file-utils'
import { detectLang, preprocessData } from './preprocessing'
import { getEmbeddingMatrix } from './word-embeddings'
import * as tf from '@tensorflow/tfjs-node'
import { printPrettyConfig } from './utils'
import {
  UTTERANCES_DIRNAME,
  MODELS_DIRNAME,
  NLU_DATA_FILENAME,
  MODEL_FILENAME,
  DEFAULT_HYPERPARAMETERS,
} from './constants'
import {
  loadConfigAndTrainingData,
  saveConfigAndTrainingData,
} from './file-utils'
import { getPrediction, getIntent } from './prediction'
import { getEntities } from './ner'

// TODO: interactive command to try intents from terminal
// import inquirer from 'inquirer'
// import { interactiveMode } from './scripts/interactive-mode'
// async function askForInteractiveMode() {
//   const questions = [
//     {
//       type: 'confirm',
//       name: 'affirmative',
//       message: `Do you want to switch into interactive mode?`
//     }
//   ]
//   return inquirer.prompt(questions)
// }

export class BotonicNLU {
  constructor(langs) {
    this.languages = langs
    this.nluPath = ''
    this.utterancesPath = ''
    this.modelsPath = ''
    this.devData = {}
    this.models = {}
  }

  async train({ nluPath }) {
    // TODO: Think about passing an arg for using models in memory
    this.nluPath = nluPath
    this.utterancesPath = path.join(nluPath, UTTERANCES_DIRNAME)
    this.modelsPath = path.join(nluPath, MODELS_DIRNAME)
    try {
      this.configsByLang = loadConfigAndTrainingData(
        this.nluPath,
        this.languages
      )
    } catch (e) {
      console.log(e)
    }
    for (const config of this.configsByLang) {
      let { devIntents, devEntities, ...params } = config
      params = { ...DEFAULT_HYPERPARAMETERS, ...params }
      printPrettyConfig(params)
      const start = new Date()
      const {
        tensorData,
        tensorLabels,
        vocabulary,
        vocabularyLength,
      } = preprocessData(devIntents, params)
      const embeddingMatrix = await getEmbeddingMatrix({
        vocabulary,
        vocabularyLength,
        params,
      })
      this.models[params.language] = embeddingLSTMModel({
        params,
        vocabularyLength,
        embeddingMatrix: tf.tensor(embeddingMatrix),
        outputDim: Object.keys(devIntents.intentsDict).length,
      })
      this.models[params.language].summary()
      this.models[params.language].compile({
        optimizer: tf.train.adam(params.LEARNING_RATE),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      })
      console.log('TRAINING...')

      const history = await this.models[params.language].fit(
        tensorData,
        tensorLabels,
        {
          epochs: params.EPOCHS,
          validationSplit: params.VALIDATION_SPLIT,
        }
      )
      const end = new Date() - start
      console.log(`\nTOTAL TRAINING TIME: ${end}ms`)
      const nluData = {
        maxSeqLength: params.MAX_SEQ_LENGTH,
        vocabulary,
        intentsDict: devIntents.intentsDict,
        language: params.language,
        devEntities,
      }
      await saveConfigAndTrainingData({
        modelsPath: this.modelsPath,
        model: this.models[params.language],
        language: params.language,
        nluData,
      })
    }
  }

  async loadModels({ modelsPath }) {
    const models = {}
    models.languages = readDir(modelsPath)
    for (const language of models.languages) {
      models[language] = {}
      models[language].nluData = readJSON(
        path.join(modelsPath, language, NLU_DATA_FILENAME)
      )
      models[language].model = await tf.loadLayersModel(
        `file://${modelsPath}/${language}/${MODEL_FILENAME}`
      )
    }
    return models
  }
  predict(models, input) {
    const language = detectLang(input, models.languages)
    const { model, nluData } = models[language]
    const prediction = getPrediction(input, model, nluData)
    const intent = getIntent(prediction, nluData.intentsDict, language)
    const entities = getEntities(input, nluData.devEntities)
    return { intent, entities }
  }
  // static async interactive({ modelsPath, languages }) {
  //   let wantsInteractiveMode = await askForInteractiveMode()
  //   if (wantsInteractiveMode.affirmative) {
  //     let modelsLanguages =
  //       parseLangFlag(process.argv) || languages || readDir(modelsPath)
  //     let nlus = {}
  //     for (let lang of modelsLanguages) {
  //       nlus[`${lang}`] = {}
  //       nlus[`${lang}`].nluData = readJSON(
  //         path.join(modelsPath, lang, NLU_DATA_FILENAME)
  //       )
  //       nlus[`${lang}`].model = await tf.loadLayersModel(
  //         `file://${modelsPath}/${lang}/${MODEL_FILENAME}`
  //       )
  //     }
  //     interactiveMode(nlus)
  //   }
  // }
}
function embeddingLSTMModel({
  vocabularyLength,
  embeddingMatrix,
  params,
  outputDim,
}) {
  const model = tf.sequential()
  model.add(
    tf.layers.embedding({
      inputDim: vocabularyLength,
      outputDim: params.EMBEDDING_DIM,
      inputLength: params.MAX_SEQ_LENGTH,
      trainable: params.TRAINABLE_EMBEDDINGS,
      weights: [embeddingMatrix],
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
      recurrentDropout: params.DROPOUT_REG,
    })
  )
  model.add(
    tf.layers.dense({
      units: outputDim,
      activation: 'softmax',
    })
  )
  return model
}
