import { LayersModel, Tensor2D } from '@tensorflow/tfjs-node'
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
import { ModelStorage } from '../../storage/model-storage'
import { Locale } from '../../types'
import { unique } from '../../utils/array-utils'
import { createSimpleNN } from './models/simple-nn'
import {
  INTENT_CLASSIFIER_TEMPLATE,
  IntentClassifierParameters,
} from './models/types'
import { Intent, PredictionProcessor } from './process/prediction-processor'
import { Processor } from './process/processor'
import { IntentClassificationConfigStorage } from './storage/config-storage'

export class BotonicIntentClassifier {
  readonly classes: string[]
  private processor: Processor
  private predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    classes: string[],
    readonly vocabulary: string[],
    private readonly preprocessor: Preprocessor
  ) {
    this.classes = unique(classes)
    this.processor = new Processor(
      this.preprocessor,
      new LabelEncoder(new IndexedItems(this.vocabulary)),
      new OneHotEncoder(new IndexedItems(this.classes))
    )
    this.predictionProcessor = new PredictionProcessor(this.classes)
  }

  static async load(
    path: string,
    preprocessor: Preprocessor
  ): Promise<BotonicIntentClassifier> {
    const config = new IntentClassificationConfigStorage().load(path)
    const classifier = new BotonicIntentClassifier(
      config.locale,
      config.maxLength,
      config.classes,
      config.vocabulary,
      preprocessor
    )
    classifier.modelManager = new ModelManager(await ModelStorage.load(path))
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
      this.vocabulary
    )

    switch (template) {
      case INTENT_CLASSIFIER_TEMPLATE.SIMPLE_NN:
        return createSimpleNN(
          this.maxLength,
          this.classes.length,
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
    path = join(path, this.locale)
    const config = {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.vocabulary,
      classes: this.classes,
    }
    new IntentClassificationConfigStorage().save(path, config)
    await this.modelManager.save(path)
  }
}
