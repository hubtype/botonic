import { Tensor3D } from '@tensorflow/tfjs-node'

import { Sample } from '../../dataset/types'
import { Embedder } from '../../embeddings/embedder'
import { WordEmbeddingManager } from '../../embeddings/types'
import { ModelHandler } from '../../handlers/model-handler'
import { ModelEvaluation } from '../../handlers/types'
import { DataLoader } from '../../loaders/data-loader'
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
import { NerConfigHandler } from '../ner/handlers/config-handler'
import { createBiLstmModel } from '../ner/models/bilstm-model'
import { NerModelParameters, NerModelTemplate } from './models/types'
import { NEUTRAL_ENTITY } from './process/constants'
import { PredictionProcessor } from './process/prediction-processor'
import { NerSampleProcessor } from './process/sample-processor'
import { Entity } from './process/types'

export class BotonicNer {
  entities: string[]
  vocabulary: string[]
  private preprocessor: Preprocessor
  private sequenceCodifier: Codifier
  private entitiesCodifier: Codifier
  private sampleProcessor: NerSampleProcessor
  private predictionProcessor: PredictionProcessor
  private modelHandler: ModelHandler

  private constructor(readonly locale: Locale, readonly maxLength: number) {}

  static with(locale: Locale, maxLength: number): BotonicNer {
    return new BotonicNer(locale, maxLength)
  }

  static async load(path: string): Promise<BotonicNer> {
    const config = NerConfigHandler.load(path)
    const ner = new BotonicNer(config.locale, config.maxLength)
    ner.vocabulary = config.vocabulary
    ner.entities = config.entities
    ner.modelHandler = await ModelHandler.load(path)
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
    this.sequenceCodifier = new Codifier(this.vocabulary, {
      categorical: false,
    })
    this.entitiesCodifier = new Codifier(this.entities, {
      categorical: true,
    })
    this.sampleProcessor = new NerSampleProcessor(
      this.preprocessor,
      this.sequenceCodifier,
      this.entitiesCodifier
    )
    this.predictionProcessor = new PredictionProcessor(this.entities)
  }

  async createModel(
    template: NerModelTemplate,
    manager: WordEmbeddingManager,
    params?: NerModelParameters
  ): Promise<void> {
    // TODO: set embeddings as optional
    const embeddingsMatrix = await new Embedder(
      manager
    ).generateEmbeddingsMatrix(this.vocabulary)

    switch (template) {
      case 'biLstm':
        this.modelHandler = new ModelHandler(
          createBiLstmModel(
            this.maxLength,
            this.entities,
            embeddingsMatrix,
            params
          )
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
    await this.modelHandler.train(x, y, { epochs, batchSize })
  }

  async evaluate(samples: Sample[]): Promise<ModelEvaluation> {
    const { x, y } = this.sampleProcessor.process(samples)
    return await this.modelHandler.evaluate(x, y)
  }

  recognizeEntities(text: string): Entity[] {
    const { sequence, input } = this.sampleProcessor.processInput(text)
    const prediction = this.modelHandler.predict(input) as Tensor3D
    return this.predictionProcessor.process(sequence, prediction)
  }

  async saveModel(path: string): Promise<void> {
    NerConfigHandler.save(path, {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.vocabulary,
      entities: this.entities,
    })
    await this.modelHandler.save(path)
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
