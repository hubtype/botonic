import { join } from 'path'

import { DatasetLoader } from '../../dataset/loader'
import { Dataset, Sample } from '../../dataset/types'
import { generateEmbeddingsMatrix } from '../../embeddings/embeddings-matrix'
import { WordEmbeddingStorage } from '../../embeddings/types'
import { LabelEncoder } from '../../encode/label-encoder'
import { OneHotEncoder } from '../../encode/one-hot-encoder'
import { ModelManager } from '../../model/manager'
import { ModelEvaluation } from '../../model/types'
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
import { createSimpleNN } from './models/simple-nn'
import {
  TEXT_CLASSIFIER_TEMPLATE,
  TextClassifierParameters,
} from './models/types'
import { Processor } from './process/processor'
import { TextClassificationConfigStorage } from './storage/config-storage'

export class BotonicTextClassifier {
  vocabulary: string[]
  classes: string[]
  private preprocessor: Preprocessor
  private processor: Processor
  private modelManager: ModelManager

  constructor(readonly locale: Locale, readonly maxLength: number) {
    this.preprocessor = new Preprocessor(locale, maxLength)
  }

  static async load(path: string): Promise<BotonicTextClassifier> {
    const config = new TextClassificationConfigStorage().load(path)
    const textClassification = new BotonicTextClassifier(
      config.locale,
      config.maxLength
    )
    textClassification.vocabulary = config.vocabulary
    textClassification.classes = config.classes
    textClassification.modelManager = new ModelManager(
      await ModelStorage.load(path)
    )
    return textClassification
  }

  loadDataset(path: string): Dataset {
    const dataset = DatasetLoader.load(path)
    this.classes = dataset.classes
    return dataset
  }

  splitDataset(
    dataset: Dataset,
    testSize = 0.2,
    shuffle = true
  ): { trainSet: Sample[]; testSet: Sample[] } {
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
      new LabelEncoder(this.vocabulary),
      new OneHotEncoder(this.classes)
    )
    throw new Error('PredictionProcessor not implemented.')
  }

  async createModel(
    template: TEXT_CLASSIFIER_TEMPLATE,
    storage: WordEmbeddingStorage,
    params?: TextClassifierParameters
  ): Promise<void> {
    // TODO: set embeddings as optional
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

  classify(text: string): any[] {
    const input = this.processor.generateInput(text)
    const prediction = this.modelManager.predict(input)
    throw new Error('PredictionProcessor not implemented.')
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
