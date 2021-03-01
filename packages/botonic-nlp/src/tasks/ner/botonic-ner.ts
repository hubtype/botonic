import { LayersModel, Scalar, Tensor3D } from '@tensorflow/tfjs-node'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { DatabaseManager } from '../../embeddings/database-manager'
import { Embedder } from '../../embeddings/embedder'
import { MODEL_CONFIG_FILENAME } from '../../loaders/constants'
import { DataLoader } from '../../loaders/data-loader'
import { Sample } from '../../parser/types'
import { Codifier } from '../../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../preprocess/constants'
import { Preprocessor } from '../../preprocess/preprocessor'
import { trainTestSplit } from '../../preprocess/selection'
import {
  Normalizer,
  Stemmer,
  Stopwords,
  Tokenizer,
} from '../../preprocess/types'
import { VocabularyGenerator } from '../../preprocess/vocabulary-generator'
import { Locale } from '../../types'
import { createBiLstmModel } from '../ner/models/bilstm-model'
import { ModelEvaluation } from '../types'
import { NerModelLoader } from './loaders/ner-model-loader'
import { ModelTemplate } from './models/types'
import { NEUTRAL_ENTITY } from './process/constants'
import { NerSampleProcessor } from './process/ner-sample-processor'
import { PredictionProcessor } from './process/prediction-processor'
import { Entity } from './process/types'

export class BotonicNer {
  entities: string[]
  vocabulary: string[]
  preprocessor: Preprocessor
  sequenceCodifier: Codifier
  entitiesCodifier: Codifier
  sampleProcessor: NerSampleProcessor
  predictionProcessor: PredictionProcessor
  model: LayersModel

  private constructor(readonly locale: Locale, readonly maxLength: number) {}

  static with(locale: Locale, maxLength: number): BotonicNer {
    return new BotonicNer(locale, maxLength)
  }

  static from(loader: NerModelLoader): BotonicNer {
    const ner = new BotonicNer(loader.locale, loader.maxLength)
    ner.entities = loader.entities
    ner.vocabulary = loader.vocabulary
    ner.model = loader.model
    return ner
  }

  loadData(
    loader: DataLoader,
    testSize = 0.2,
    shuffle = true
  ): { train: Sample[]; test: Sample[] } {
    this.entities = Array.from(
      new Set([NEUTRAL_ENTITY].concat(loader.data.entities))
    )
    return trainTestSplit(loader.data.samples, testSize, shuffle)
  }

  loadPreprocessor(preprocessor: Preprocessor): void {
    this.preprocessor = preprocessor
  }

  generateVocabulary(samples: Sample[]): void {
    const generator = new VocabularyGenerator(this.preprocessor)
    this.vocabulary = Array.from(
      new Set(
        [PADDING_TOKEN, UNKNOWN_TOKEN].concat(generator.generate(samples))
      )
    )
  }

  compile(): void {
    this.sequenceCodifier = new Codifier(this.vocabulary, false)
    this.entitiesCodifier = new Codifier(this.entities, true)
    this.sampleProcessor = new NerSampleProcessor(
      this.preprocessor,
      this.sequenceCodifier,
      this.entitiesCodifier
    )
    this.predictionProcessor = new PredictionProcessor(this.entities)
  }

  async createModel(
    template: ModelTemplate,
    manager: DatabaseManager
  ): Promise<void> {
    const embedder = await Embedder.with(manager)
    const embeddingsMatrix = await embedder.generateEmbeddingsMatrix(
      this.vocabulary
    )

    switch (template) {
      case 'biLstm':
        this.model = createBiLstmModel(
          this.maxLength,
          this.entities,
          embeddingsMatrix
        )
        break
      default:
        throw new Error(`"${template}" is an invalid model template.`)
    }
  }

  async train(
    samples: Sample[],
    epochs: number,
    batchSize: number
  ): Promise<void> {
    const { x, y } = this.sampleProcessor.process(samples)
    await this.model.fit(x, y, { epochs, batchSize })
  }

  async evaluate(samples: Sample[]): Promise<ModelEvaluation> {
    const { x, y } = this.sampleProcessor.process(samples)
    const [loss, accuracy] = (await this.model.evaluate(x, y)) as Scalar[]
    return {
      loss: loss.arraySync(),
      accuracy: accuracy.arraySync(),
    }
  }

  recognizeEntities(text: string): Entity[] {
    const { sequence, input } = this.sampleProcessor.processInput(text)
    const prediction = this.model.predict(input) as Tensor3D
    return this.predictionProcessor.process(sequence, prediction)
  }

  async saveModel(path: string): Promise<void> {
    //TODO: maybe create a ModelWritter
    mkdirSync(path, { recursive: true })
    writeFileSync(
      join(path, MODEL_CONFIG_FILENAME),
      JSON.stringify({
        locale: this.locale,
        maxLength: this.maxLength,
        vocabulary: this.vocabulary,
        entities: this.entities,
      })
    )
    await this.model.save(`file://${path}`)
  }

  set normalizer(engine: Normalizer) {
    this.preprocessor.engines.normalizer = engine
  }

  set tokenizer(engine: Tokenizer) {
    this.preprocessor.engines.tokenizer = engine
  }

  set stopwords(engine: Stopwords) {
    this.preprocessor.engines.stopwords = engine
  }

  get stopwords(): Stopwords {
    return this.preprocessor.engines.stopwords
  }

  set stemmer(engine: Stemmer) {
    this.preprocessor.engines.stemmer = engine
  }
}
