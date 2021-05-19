import { LayersModel, Tensor2D } from '@tensorflow/tfjs-node'
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
import {
  createSimpleNN,
  INTENT_CLASSIFIER_TEMPLATE,
  IntentClassifierParameters,
} from './models'
import { Intent, PredictionProcessor, Processor } from './process'

export interface IntentClassifierConfig extends NlpTaskConfig {
  intents: string[]
}

export class BotonicIntentClassifier {
  private readonly config: Readonly<IntentClassifierConfig>
  private readonly processor: Processor
  private readonly predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(config: IntentClassifierConfig, preprocessor: Preprocessor) {
    this.config = {
      ...config,
      intents: unique(config.intents),
    }
    this.processor = new Processor(
      preprocessor,
      new LabelEncoder(new IndexedItems(this.config.vocabulary)),
      new OneHotEncoder(new IndexedItems(this.config.intents))
    )
    this.predictionProcessor = new PredictionProcessor(this.config.intents)
  }

  static async load(
    path: string,
    preprocessor: Preprocessor
  ): Promise<BotonicIntentClassifier> {
    const config = new ConfigStorage().load(path) as IntentClassifierConfig
    const classifier = new BotonicIntentClassifier(config, preprocessor)
    const model = await new ModelStorage().load(path)
    classifier.modelManager = new ModelManager(model)
    return classifier
  }

  // TODO: set embeddings as optional
  async createModel(
    template: INTENT_CLASSIFIER_TEMPLATE,
    storage: WordEmbeddingStorage,
    params?: IntentClassifierParameters
  ): Promise<LayersModel> {
    const embeddingsMatrix = await generateEmbeddingsMatrix(
      storage,
      this.config.vocabulary
    )

    switch (template) {
      case INTENT_CLASSIFIER_TEMPLATE.SIMPLE_NN:
        return createSimpleNN(
          this.config.maxLength,
          this.config.intents.length,
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
    const { x, y } = this.processor.processSamples(dataset.samples)
    await this.modelManager.train(x, y, { epochs, batchSize })
  }

  async evaluate(dataset: Dataset): Promise<ModelEvaluation> {
    const { x, y } = this.processor.processSamples(dataset.samples)
    return await this.modelManager.evaluate(x, y)
  }

  classify(text: string): Intent[] {
    const input = this.processor.processTexts([text])
    const prediction = this.modelManager.predict(input) as Tensor2D
    const intents = this.predictionProcessor.process(prediction)
    return intents
  }

  async saveModel(path: string): Promise<void> {
    path = join(path, this.config.locale)
    new ConfigStorage().save(this.config, path)
    await new ModelStorage().save(this.modelManager.model, path)
  }
}
