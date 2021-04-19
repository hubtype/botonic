import { LayersModel, Tensor3D } from '@tensorflow/tfjs-node'
import { join } from 'path'

import { Dataset } from '../../dataset/dataset'
import { generateEmbeddingsMatrix } from '../../embeddings/embeddings-matrix'
import { WordEmbeddingStorage } from '../../embeddings/types'
import { LabelEncoder } from '../../encode/label-encoder'
import { OneHotEncoder } from '../../encode/one-hot-encoder'
import { ModelManager } from '../../model/manager'
import { ModelEvaluation } from '../../model/types'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../preprocess/constants'
import { Preprocessor } from '../../preprocess/preprocessor'
import {
  Normalizer,
  Stemmer,
  Stopwords,
  Tokenizer,
} from '../../preprocess/types'
import { VocabularyGenerator } from '../../preprocess/vocabulary-generator'
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
  vocabulary: string[]
  private preprocessor: Preprocessor
  private processor: Processor
  private predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    readonly entities: string[]
  ) {
    this.preprocessor = new Preprocessor(locale, maxLength)
  }

  static async load(path: string): Promise<BotonicNer> {
    const config = NerConfigStorage.load(path)
    const ner = new BotonicNer(config.locale, config.maxLength, config.entities)
    ner.vocabulary = config.vocabulary
    ner.modelManager = new ModelManager(await ModelStorage.load(path))
    return ner
  }

  generateVocabulary(dataset: Dataset): void {
    this.vocabulary = unique(
      [PADDING_TOKEN, UNKNOWN_TOKEN].concat(
        new VocabularyGenerator(this.preprocessor).generate(dataset.samples)
      )
    )
  }

  compile(): void {
    this.processor = new Processor(
      this.preprocessor,
      new LabelEncoder(this.vocabulary),
      new OneHotEncoder(this.entities)
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
