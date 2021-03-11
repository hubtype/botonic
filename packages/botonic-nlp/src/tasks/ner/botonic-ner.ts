import { Tensor3D } from '@tensorflow/tfjs-node'

import { DatasetLoader } from '../../dataset/loader'
import { Dataset, Sample } from '../../dataset/types'
import { Embedder } from '../../embeddings/embedder'
import { WordEmbeddingManager } from '../../embeddings/types'
import { ModelManager } from '../../model/manager'
import { ModelEvaluation } from '../../model/types'
import { Codifier } from '../../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../preprocess/constants'
import { Preprocessor } from '../../preprocess/preprocessor'
import { trainTestSplit } from '../../preprocess/selection'
import {
  Normalizer,
  PaddingPosition,
  Stemmer,
  Stopwords,
  Tokenizer,
} from '../../preprocess/types'
import { VocabularyGenerator } from '../../preprocess/vocabulary-generator'
import { ModelStorage } from '../../storage/model-storage'
import { Locale } from '../../types'
import { unique } from '../../utils/array-utils'
import { createBiLstmModel } from '../ner/models/bilstm-model'
import { NerModelParameters, NerModelTemplate } from './models/types'
import { NEUTRAL_ENTITY } from './process/constants'
import { PredictionProcessor } from './process/prediction-processor'
import { Processor } from './process/processor'
import { Entity } from './process/types'
import { NerConfigStorage } from './storage/config-storage'

export class BotonicNer {
  entities: string[]
  vocabulary: string[]
  private processor: Processor
  private predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  private constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    private preprocessor: Preprocessor
  ) {}

  static with(locale: Locale, maxLength: number): BotonicNer {
    return new BotonicNer(
      locale,
      maxLength,
      new Preprocessor(locale, maxLength)
    )
  }

  static async load(path: string): Promise<BotonicNer> {
    const config = NerConfigStorage.load(path)
    const ner = new BotonicNer(
      config.locale,
      config.maxLength,
      new Preprocessor(config.locale, config.maxLength)
    )
    ner.vocabulary = config.vocabulary
    ner.entities = config.entities
    ner.modelManager = new ModelManager(await ModelStorage.load(path))
    return ner
  }

  loadDataset(path: string): Dataset {
    const dataset = DatasetLoader.load(path)
    this.entities = unique([NEUTRAL_ENTITY].concat(dataset.entities))
    return dataset
  }

  splitDataset(
    dataset: Dataset,
    testSize = 0.2,
    shuffle = true
  ): { train: Sample[]; test: Sample[] } {
    return trainTestSplit(dataset.samples, testSize, shuffle)
  }

  generateVocabulary(samples: Sample[]): void {
    this.vocabulary = unique(
      [PADDING_TOKEN, UNKNOWN_TOKEN].concat(
        new VocabularyGenerator(this.preprocessor).generate(samples)
      )
    )
  }

  compile(): void {
    this.processor = new Processor(
      this.preprocessor,
      new Codifier(this.vocabulary, { isCategorical: false }),
      new Codifier(this.entities, { isCategorical: true })
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
        this.modelManager = new ModelManager(
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
    const { x, y } = this.processor.process(samples)
    await this.modelManager.train(x, y, { epochs, batchSize })
  }

  async evaluate(samples: Sample[]): Promise<ModelEvaluation> {
    const { x, y } = this.processor.process(samples)
    return await this.modelManager.evaluate(x, y)
  }

  recognizeEntities(text: string): Entity[] {
    const { sequence, input } = this.processor.generateInput(text)
    const prediction = this.modelManager.predict(input) as Tensor3D
    return this.predictionProcessor.process(sequence, prediction)
  }

  async saveModel(path: string): Promise<void> {
    const config = {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.vocabulary,
      entities: this.entities,
    }
    NerConfigStorage.save(path, config)
    await this.modelManager.save(path)
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

  set paddingPosition(position: PaddingPosition) {
    this.preprocessor.paddingPosition = position
  }
}
