import { Tensor2D } from '@tensorflow/tfjs-node'
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
import {
  Intent,
  PredictionProcessor,
} from '../text-classification/process/prediction-processor'
import { createSimpleNN } from './models/simple-nn'
import {
  TEXT_CLASSIFIER_TEMPLATE,
  TextClassifierParameters,
} from './models/types'
import { Processor } from './process/processor'
import { TextClassificationConfigStorage } from './storage/config-storage'

export class BotonicTextClassifier {
  vocabulary: string[]
  private preprocessor: Preprocessor
  private processor: Processor
  private predictionProcessor: PredictionProcessor
  private modelManager: ModelManager

  constructor(
    readonly locale: Locale,
    readonly maxLength: number,
    readonly classes: string[]
  ) {
    this.preprocessor = new Preprocessor(locale, maxLength)
  }

  static async load(path: string): Promise<BotonicTextClassifier> {
    const config = new TextClassificationConfigStorage().load(path)
    const textClassification = new BotonicTextClassifier(
      config.locale,
      config.maxLength,
      config.classes
    )
    textClassification.vocabulary = config.vocabulary
    textClassification.modelManager = new ModelManager(
      await ModelStorage.load(path)
    )
    return textClassification
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
      new OneHotEncoder(this.classes)
    )
    this.predictionProcessor = new PredictionProcessor(this.classes)
  }

  // TODO: set embeddings as optional
  async createModel(
    template: TEXT_CLASSIFIER_TEMPLATE,
    storage: WordEmbeddingStorage,
    params?: TextClassifierParameters
  ): Promise<void> {
    const embeddingsMatrix = await generateEmbeddingsMatrix(
      storage,
      this.vocabulary
    )

    if (template == TEXT_CLASSIFIER_TEMPLATE.SIMPLE_NN) {
      const model = createSimpleNN(
        this.maxLength,
        this.classes.length,
        embeddingsMatrix,
        params
      )
      this.modelManager = new ModelManager(model)
    }
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
    new TextClassificationConfigStorage().save(path, config)
    await this.modelManager.save(path)
  }
}
