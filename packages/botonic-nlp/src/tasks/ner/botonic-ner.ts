import {
  LayersModel,
  loadLayersModel,
  Scalar,
  tensor,
  Tensor3D,
} from '@tensorflow/tfjs-node'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { DatabaseManager } from '../../embeddings/database-manager'
import { Embedder } from '../../embeddings/embedder'
import { EmbeddingsDimension, EmbeddingsType } from '../../embeddings/types'
import { Parser } from '../../parser/parser'
import { Sample } from '../../parser/types'
import { Codifier } from '../../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../preprocess/constants'
import { trainTestSplit } from '../../preprocess/selection'
import { Locale } from '../../types'
import { BotonicTaskTemplate } from '../botonic-task-template'
import { ModelEvaluation } from '../types'
import { MODEL_CONFIG_FILENAME, NEUTRAL_ENTITY } from './constants'
import { createBiLstmModel } from './models/bilstm-model'
import { NerPreprocessor } from './preprocessor'
import { Entity, ModelConfig, ModelTemplate, Set } from './types'

export class BotonicNer extends BotonicTaskTemplate {
  entities: string[]
  private preprocessor: NerPreprocessor
  private tokensCodifier: Codifier
  private entitiesCodifier: Codifier
  private model: LayersModel
  private trainSet: Set
  private testSet: Set

  private constructor(locale: Locale, maxLength: number) {
    super(locale, maxLength)
    this.preprocessor = new NerPreprocessor(
      this.maxLength,
      this.preprocessEngines
    )
  }

  static with(locale: Locale, maxLength: number): BotonicNer {
    return new BotonicNer(locale, maxLength)
  }

  static async from(path: string): Promise<BotonicNer> {
    const config: ModelConfig = JSON.parse(
      readFileSync(join(path, MODEL_CONFIG_FILENAME), 'utf-8')
    )
    const ner = new BotonicNer(config.locale, config.maxLength)
    ner.entitiesCodifier = Codifier.with(config.entities, true, false)
    ner.tokensCodifier = Codifier.with(config.vocabulary, false, true)

    ner.model = await loadLayersModel(`file://${path}/model.json`)
    return ner
  }

  loadData(path: string, testSize = 0.2, shuffle = true): void {
    const { entities, samples } = Parser.parse(path)

    this.entities = [NEUTRAL_ENTITY].concat(entities)

    const { train, test } = trainTestSplit(samples, testSize, shuffle)

    const preprocessedTrainSet = this.preprocessor.preprocess(train)
    const preprocessedTestSet = this.preprocessor.preprocess(test)

    this.tokensCodifier = Codifier.fit(preprocessedTrainSet.x, false, true, [
      PADDING_TOKEN,
      UNKNOWN_TOKEN,
    ])

    this.entitiesCodifier = Codifier.with(this.entities, true, false)

    this.trainSet = {
      x: tensor(preprocessedTrainSet.x.map(s => this.tokensCodifier.encode(s))),
      y: tensor(
        preprocessedTrainSet.y.map(s => this.entitiesCodifier.encode(s))
      ),
    }

    this.testSet = {
      x: tensor(preprocessedTestSet.x.map(s => this.tokensCodifier.encode(s))),
      y: tensor(
        preprocessedTestSet.y.map(s => this.entitiesCodifier.encode(s))
      ),
    }
  }

  async createModel(
    template: ModelTemplate,
    embeddingsType: EmbeddingsType,
    embeddingsDimension: EmbeddingsDimension
  ): Promise<void> {
    const dbManager = new DatabaseManager(
      this.locale,
      embeddingsType,
      embeddingsDimension
    )
    const embedder = await Embedder.with(dbManager)
    const embeddingsMatrix = await embedder.generateEmbeddingsMatrix(
      this.tokensCodifier.vocabulary
    )

    switch (template) {
      case 'biLstm':
        this.model = createBiLstmModel(
          this.maxLength,
          this.entities,
          embeddingsMatrix
        )
        break
      default:
        throw new Error(`"${template}" is an invalid model template.`)
    }
  }

  async train(epochs: number, batchSize: number): Promise<void> {
    await this.model.fit(this.trainSet.x, this.trainSet.y, {
      epochs,
      batchSize,
    })
  }

  async evaluate(): Promise<ModelEvaluation> {
    const [loss, accuracy] = this.model.evaluate(
      this.testSet.x,
      this.testSet.y
    ) as Scalar[]
    return {
      loss: loss.arraySync(),
      accuracy: accuracy.arraySync(),
    }
  }

  predict(text: string, advanced = false): Entity[] {
    const preprocessedData = this.preprocessor.preprocess([
      { text, entities: [], class: '' } as Sample,
    ])
    const tokens = preprocessedData.x[0]
    const x = tensor([this.tokensCodifier.encode(tokens)])
    const prediction = this.model.predict(x) as Tensor3D
    return this.generateEntityPredictions(tokens, prediction, advanced)
  }

  private generateEntityPredictions(
    tokens: string[],
    prediction: Tensor3D,
    advanced: boolean
  ): Entity[] {
    const confidences = prediction.arraySync()[0]
    const entities = tokens.map((token, idx) => {
      const tokenConfidences = confidences[idx]
      const confidence = Math.max(...tokenConfidences)
      const label = this.entities[tokenConfidences.indexOf(confidence)]
      const entity: Entity = { text: token, confidence, label }
      if (advanced) {
        entity.predictions = tokenConfidences.map((c, id) => {
          return { label: this.entities[id], confidence: c }
        })
      }
      return entity
    })
    return advanced
      ? entities.filter(e => e.text !== PADDING_TOKEN)
      : entities.filter(
          e => e.text !== PADDING_TOKEN && e.label !== NEUTRAL_ENTITY
        )
  }

  async save(path: string): Promise<void> {
    mkdirSync(path, { recursive: true })

    const config: ModelConfig = {
      locale: this.locale,
      maxLength: this.maxLength,
      vocabulary: this.tokensCodifier.vocabulary,
      entities: this.entitiesCodifier.vocabulary,
    }

    writeFileSync(join(path, MODEL_CONFIG_FILENAME), JSON.stringify(config))
    await this.model.save(`file://${path}`)
  }
}
