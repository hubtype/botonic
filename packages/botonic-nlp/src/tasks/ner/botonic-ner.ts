import { LayersModel, Tensor3D } from '@tensorflow/tfjs-node'
import { join } from 'path'

import { Dataset } from '../../dataset/dataset'
import { generateEmbeddingsMatrix } from '../../embeddings/embeddings-matrix'
import { WordEmbeddingStorage } from '../../embeddings/types'
import { IndexedItems } from '../../encode/indexed-items'
import { LabelEncoder } from '../../encode/label-encoder'
import { OneHotEncoder } from '../../encode/one-hot-encoder'
import { ModelManager } from '../../model/manager'
import { ModelEvaluation } from '../../model/types'
import { Preprocessor } from '../../preprocess/preprocessor'
import {
  Normalizer,
  Stemmer,
  Stopwords,
  Tokenizer,
} from '../../preprocess/types'
import { ModelStorage } from '../../storage/model-storage'
import { Locale } from '../../types'
import { unique } from '../../utils/array-utils'
import { createBiLstmModel } from '../ner/models/bilstm-model'
import { NER_TEMPLATE, NerModelParameters } from './models/types'
import { NEUTRAL_ENTITY } from './process/constants'
import { PredictionProcessor } from './process/prediction-processor'
import { Processor } from './process/processor'
import { Entity } from './process/types'
import { NerConfigStorage } from './storage/config-storage'

export class BotonicNer {
  readonly entities: string[]
  private processor: Processor
  private predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    entities: string[],
    readonly vocabulary: string[],
    private readonly preprocessor: Preprocessor
  ) {
    this.entities = unique([NEUTRAL_ENTITY].concat(entities))
  }

  static async load(
    path: string,
    preprocessor: Preprocessor
  ): Promise<BotonicNer> {
    const config = NerConfigStorage.load(path)
    const ner = new BotonicNer(
      config.locale,
      config.maxLength,
      config.entities,
      config.vocabulary,
      preprocessor
    )
    ner.modelManager = new ModelManager(await ModelStorage.load(path))
    return ner
  }

  compile(): void {
    this.processor = new Processor(
      this.preprocessor,
      new LabelEncoder(new IndexedItems(this.vocabulary)),
      new OneHotEncoder(new IndexedItems(this.entities))
    )
    this.predictionProcessor = new PredictionProcessor(this.entities)
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
    const config = {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.vocabulary,
      entities: this.entities,
    }
    NerConfigStorage.save(path, config)
    await this.modelManager.save(path)
  }
}
