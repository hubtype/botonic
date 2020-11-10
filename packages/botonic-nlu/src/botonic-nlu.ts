/* eslint-disable @typescript-eslint/unbound-method */
import { LayersModel, Sequential, tensor } from '@tensorflow/tfjs-node'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { MODEL_DATA_FILENAME, MODELS_DIR, NLU_DIR } from './constants'
import { DatasetReader, DataSetReaderConfig } from './data-reader'
import { IntentsProcessor } from './intents-processor'
import { Language } from './language'
import { ModelManager } from './model-manager'
import { DefaultNormalizer } from './preprocessing-tools/normalizer'
import { DefaultStemmer } from './preprocessing-tools/stemmer'
import { DefaultTokenizer } from './preprocessing-tools/tokenizer'
import { Preprocessor } from './preprocessor'
import {
  DataSet,
  DecodedPrediction,
  InputSet,
  ModelTemplatesType,
  Normalizer,
  OutputSet,
  PreprocessorEngines,
  Stemmer,
  Tokenizer,
  Vocabulary,
  WordEmbeddingDimension,
  WordEmbeddingType,
} from './types'
import { readJSON } from './util/file-system'
import { shuffle } from './util/object-tools'

export class BotonicNLU {
  language: Language
  maxSeqLen: number
  vocabulary: Vocabulary
  engines: PreprocessorEngines = {}
  private modelManager: ModelManager
  private preprocessor: Preprocessor
  private intentsProcessor: IntentsProcessor
  constructor({
    normalizer = new DefaultNormalizer(),
    tokenizer = new DefaultTokenizer(),
    stemmer = new DefaultStemmer(),
  }: {
    normalizer?: Normalizer
    tokenizer?: Tokenizer
    stemmer?: Stemmer
  } = {}) {
    this.engines.normalizer = normalizer
    this.engines.tokenizer = tokenizer
    this.engines.stemmer = stemmer
  }

  set model(model: Sequential | LayersModel) {
    this.modelManager = ModelManager.fromModel(model)
  }

  async loadModel(modelPath: string, modelDataPath: string): Promise<void> {
    const modelData = readJSON(modelDataPath)
    this.language = modelData.language
    this.maxSeqLen = modelData.maxSeqLen
    this.vocabulary = modelData.vocabulary

    this.intentsProcessor = IntentsProcessor.fromDecoder(modelData.intents)
    this.preprocessor = Preprocessor.fromModelData(modelData, this.engines)
    this.modelManager = await ModelManager.fromModelPath(modelPath)
  }

  predict(sentence: string): string {
    const input = tensor([this.preprocessor.preprocess(sentence)])
    const intentId = this.modelManager.predict(input)
    const intent = this.intentsProcessor.decode(intentId)
    return intent
  }

  predictProbabilities(sentence: string): DecodedPrediction[] {
    const input = tensor([this.preprocessor.preprocess(sentence)])
    const encodedPrediction = this.modelManager.predictProbabilities(input)
    return encodedPrediction.map(intentConfidence => {
      const intent = this.intentsProcessor.decode(intentConfidence.intentId)
      return {
        intent: intent,
        confidence: intentConfidence.confidence,
      }
    })
  }

  readData(
    options: {
      path: string
      language: Language
      maxSeqLen: number
    },
    readerConfig?: DataSetReaderConfig
  ): DataSet {
    this.language = options.language
    this.maxSeqLen = options.maxSeqLen
    return DatasetReader.readData(options.path, {
      csvSeparator: readerConfig?.csvSeparator,
    })
  }

  trainTestSplit(options: {
    data: DataSet
    testPercentage: number
    stratify?: boolean
  }): [InputSet, InputSet, OutputSet, OutputSet] {
    if (options.testPercentage > 1 || options.testPercentage < 0) {
      throw new RangeError('testPercentage should be a number between 0 and 1.')
    }
    const data = shuffle(options.data)

    let trainSet = []
    let testSet = []

    if (options.stratify !== false) {
      const intents = Array.from(new Set(data.map(sample => sample.label)))
      for (const intent of intents) {
        const intentData = data.filter(sample => sample.label == intent)
        const intentSize = intentData.length
        const testSize = Math.round(intentSize * options.testPercentage)
        testSet = testSet.concat(intentData.slice(0, testSize))
        trainSet = trainSet.concat(intentData.slice(testSize, intentSize))
      }
    } else {
      const dataSize = data.length
      const testSize = Math.round(dataSize * options.testPercentage)
      testSet = testSet.concat(data.slice(0, testSize))
      trainSet = trainSet.concat(data.slice(testSize, dataSize))
    }

    this.preprocessor = Preprocessor.fromData(
      trainSet,
      this.language,
      this.maxSeqLen,
      this.engines
    )

    this.vocabulary = this.preprocessor.vocabulary
    this.intentsProcessor = IntentsProcessor.fromDataset(trainSet)

    const [xTrain, yTrain] = this.inputOutputSplit(trainSet)
    const [xTest, yTest] = this.inputOutputSplit(testSet)

    return [xTrain, xTest, yTrain, yTest]
  }

  private inputOutputSplit(data: DataSet): [InputSet, OutputSet] {
    const x = tensor(
      data.map(sample => this.preprocessor.preprocess(sample.feature))
    )

    const y = tensor(
      data.map(sample => this.intentsProcessor.encode(sample.label))
    )
    return [x, y]
  }

  async createModel(options: {
    template: ModelTemplatesType
    learningRate: number
    wordEmbeddingsType?: WordEmbeddingType
    wordEmbeddingsDimension?: WordEmbeddingDimension
    trainableEmbeddings?: boolean
  }): Promise<void> {
    const wordEmbeddingsConfig = {
      type: options.wordEmbeddingsType || '10k-fasttext',
      dimension: options.wordEmbeddingsDimension || 300,
      language: this.language,
      vocabulary: this.vocabulary,
    }

    const parameters = {
      maxSeqLen: this.maxSeqLen,
      learningRate: options.learningRate,
      intentsCount: this.intentsProcessor.intentsCount,
      trainableEmbeddings: options.trainableEmbeddings ?? true,
    }
    this.modelManager = await ModelManager.fromModelTemplate(
      options.template,
      wordEmbeddingsConfig,
      parameters
    )
  }

  async train(
    x: InputSet,
    y: OutputSet,
    options?: {
      epochs?: number
      batchSize?: number
      validationSplit?: number
    }
  ): Promise<void> {
    const parameters = {
      x: x,
      y: y,
      epochs: options?.epochs || 10,
      batchSize: options?.batchSize || 8,
      validationSplit: options?.validationSplit || 0.2,
    }

    await this.modelManager.train(parameters)
  }

  evaluate(x: InputSet, y: OutputSet): number {
    const accuracy = this.modelManager.evaluate(x, y)
    return accuracy
  }

  async saveModel(path?: string): Promise<void> {
    const modelDir =
      path ||
      join(
        process.cwd(),
        'src',
        NLU_DIR,
        MODELS_DIR,
        this.preprocessor.language
      )
    mkdirSync(modelDir, { recursive: true })

    const modelDataPath = join(modelDir, MODEL_DATA_FILENAME)

    const modelData = {
      language: this.preprocessor.language,
      intents: this.intentsProcessor.decoder,
      maxSeqLen: this.preprocessor.maxSeqLen,
      vocabulary: this.preprocessor.vocabulary,
    }
    writeFileSync(modelDataPath, JSON.stringify(modelData))

    await this.modelManager.saveModel(modelDir)
  }
}
