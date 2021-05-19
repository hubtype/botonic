import { LayersModel, Tensor3D } from '@tensorflow/tfjs-node'
import { join } from 'path'

import { Dataset } from '../../dataset'
import {
  generateEmbeddingsMatrix,
  WordEmbeddingStorage,
} from '../../embeddings'
import { IndexedItems, LabelEncoder, OneHotEncoder } from '../../encode'
import { ModelEvaluation, ModelManager } from '../../model'
import { Preprocessor } from '../../preprocess'
import { ModelStorage } from '../../storage'
import { Locale } from '../../types'
import { unique } from '../../utils'
import { NlpTaskConfig } from '../nlp-task-config'
import { createBiLstmModel, NER_TEMPLATE, NerModelParameters } from './models'
import {
  Entity,
  NEUTRAL_ENTITY,
  PredictionProcessor,
  Processor,
} from './process'
import { NerConfig, NerConfigStorage } from './storage'

export interface EntityRecognizerConfig extends NlpTaskConfig {
  entities: string[]
}

export class BotonicNer {
  readonly locale: Locale
  readonly maxLength: number
  readonly vocabulary: string[]
  readonly entities: string[]
  private readonly processor: Processor
  private readonly predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(config: EntityRecognizerConfig) {
    this.locale = config.locale
    this.maxLength = config.maxLength
    this.vocabulary = config.vocabulary
    this.entities = unique([NEUTRAL_ENTITY].concat(config.entities))
    this.processor = new Processor(
      config.preprocessor,
      new LabelEncoder(new IndexedItems(config.vocabulary)),
      new OneHotEncoder(new IndexedItems(this.entities))
    )
    this.predictionProcessor = new PredictionProcessor(config.entities)
  }

  static async load(
    path: string,
    preprocessor: Preprocessor
  ): Promise<BotonicNer> {
    const config = NerConfigStorage.load(path)
    const ner = new BotonicNer({
      locale: config.locale,
      maxLength: config.maxLength,
      vocabulary: config.vocabulary,
      entities: config.entities,
      preprocessor,
    })
    ner.modelManager = new ModelManager(await ModelStorage.load(path))
    return ner
  }

  async createModel(
    template: NER_TEMPLATE,
    storage: WordEmbeddingStorage,
    params?: NerModelParameters
  ): Promise<LayersModel> {
    // TODO: set embeddings as optional
    const embeddingsMatrix = await generateEmbeddingsMatrix(
      storage,
      this.vocabulary
    )

    switch (template) {
      case NER_TEMPLATE.BILSTM:
        return createBiLstmModel(
          this.maxLength,
          this.entities,
          embeddingsMatrix,
          params
        )
      default:
        throw new Error(`"${template}" is an invalid model template.`)
    }
  }

  setModel(model: LayersModel): void {
    this.modelManager = new ModelManager(model)
  }

  async train(
    dataset: Dataset,
    epochs: number,
    batchSize: number
  ): Promise<void> {
    const { x, y } = this.processor.process(dataset.samples)
    await this.modelManager.train(x, y, { epochs, batchSize })
  }

  async evaluate(dataset: Dataset): Promise<ModelEvaluation> {
    const { x, y } = this.processor.process(dataset.samples)
    return await this.modelManager.evaluate(x, y)
  }

  recognizeEntities(text: string): Entity[] {
    const { sequence, input } = this.processor.generateInput(text)
    const prediction = this.modelManager.predict(input) as Tensor3D
    return this.predictionProcessor.process(sequence, prediction)
  }

  async saveModel(path: string): Promise<void> {
    path = join(path, this.locale)
    const config: NerConfig = {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.vocabulary,
      entities: this.entities,
    }
    NerConfigStorage.save(path, config)
    await this.modelManager.save(path)
  }
}
