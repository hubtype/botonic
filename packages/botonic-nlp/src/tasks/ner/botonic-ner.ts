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
import { ConfigStorage, ModelStorage, NlpTaskConfig } from '../../storage'
import { unique } from '../../utils'
import { createBiLstmModel, NER_TEMPLATE, NerModelParameters } from './models'
import {
  Entity,
  NEUTRAL_ENTITY,
  PredictionProcessor,
  Processor,
} from './process'

export interface NerConfig extends NlpTaskConfig {
  entities: string[]
}

export class BotonicNer {
  private readonly config: Readonly<NerConfig>
  private readonly processor: Processor
  private readonly predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(config: NerConfig, preprocessor: Preprocessor) {
    this.config = {
      ...config,
      entities: unique([NEUTRAL_ENTITY].concat(config.entities)),
    }
    this.processor = new Processor(
      preprocessor,
      new LabelEncoder(new IndexedItems(this.config.vocabulary)),
      new OneHotEncoder(new IndexedItems(this.config.entities))
    )
    this.predictionProcessor = new PredictionProcessor(this.config.entities)
  }

  static async load(
    path: string,
    preprocessor: Preprocessor
  ): Promise<BotonicNer> {
    const config = new ConfigStorage<NerConfig>().load(path)
    const ner = new BotonicNer(config, preprocessor)
    const model = await new ModelStorage().load(path)
    ner.modelManager = new ModelManager(model)
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
      this.config.vocabulary
    )

    switch (template) {
      case NER_TEMPLATE.BILSTM:
        return createBiLstmModel(
          this.config.maxLength,
          this.config.entities,
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
    path = join(path, this.config.locale)
    new ConfigStorage<NerConfig>().save(this.config, path)
    await new ModelStorage().save(this.modelManager.model, path)
  }
}
