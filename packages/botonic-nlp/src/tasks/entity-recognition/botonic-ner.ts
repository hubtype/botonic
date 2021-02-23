import {
  LayersModel,
  loadLayersModel,
  Scalar,
  tensor,
  Tensor2D,
  Tensor3D,
} from '@tensorflow/tfjs-node'
import { mkdirSync } from 'fs'

import { DatabaseManager } from '../../embeddings/database-manager'
import { Embedder } from '../../embeddings/embedder'
import { EmbeddingsDimension, EmbeddingsType } from '../../embeddings/types'
import { Parser } from '../../parser/parser'
import { Sample } from '../../parser/types'
import { Codifier } from '../../preprocess/codifier'
import { PADDING_TOKEN, UNKNOWN_TOKEN } from '../../preprocess/constants'
import { trainTestSplit } from '../../preprocess/selection'
import { BotonicTaskTemplate } from '../botonic-task-template'
import { ModelEvaluation } from '../types'
import { NEUTRAL_ENTITY } from './constants'
import { createBiLstmModel } from './models/bilstm-model'
import { EntityRecognitionPreprocessor } from './preprocessor'
import { Entity, ModelTemplate } from './types'

export class BotonicNer extends BotonicTaskTemplate {
  entities: string[]
  private preprocessor: EntityRecognitionPreprocessor
  private tokensCodifier: Codifier
  private entitiesCodifier: Codifier
  private model: LayersModel
  private xTrain: Tensor2D
  private xTest: Tensor2D
  private yTrain: Tensor3D
  private yTest: Tensor3D

  loadData(path: string, testSize = 0.2, shuffle = true): void {
    const data = Parser.parse(path)
    this.entities = [NEUTRAL_ENTITY].concat(data.entities)

    const { train, test } = trainTestSplit(data.samples, testSize, shuffle)

    this.preprocessor = new EntityRecognitionPreprocessor(
      this.maxLength,
      this.preprocessEngines
    )
    const preprocessedTrainSet = this.preprocessor.preprocess(train)
    const preprocessedTestSet = this.preprocessor.preprocess(test)

    this.tokensCodifier = Codifier.fit(preprocessedTrainSet.x, false, true, [
      PADDING_TOKEN,
      UNKNOWN_TOKEN,
    ])

    this.entitiesCodifier = Codifier.with(this.entities, true, false)

    this.xTrain = tensor(
      preprocessedTrainSet.x.map(s => this.tokensCodifier.encode(s))
    )

    this.xTest = tensor(
      preprocessedTestSet.x.map(s => this.tokensCodifier.encode(s))
    )

    this.yTrain = tensor(
      preprocessedTrainSet.y.map(s => this.entitiesCodifier.encode(s))
    )

    this.yTest = tensor(
      preprocessedTestSet.y.map(s => this.entitiesCodifier.encode(s))
    )
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

  async loadModel(path: string): Promise<void> {
    this.model = await loadLayersModel(`file://${path}/model.json`)
  }

  async train(epochs: number, batchSize: number): Promise<void> {
    await this.model.fit(this.xTrain, this.yTrain, { epochs, batchSize })
  }

  async evaluate(): Promise<ModelEvaluation> {
    const [loss, accuracy] = this.model.evaluate(
      this.xTest,
      this.yTest
    ) as Scalar[]
    return {
      loss: loss.arraySync(),
      accuracy: accuracy.arraySync(),
    }
  }

  predict(text: string, threshold = 0.8): Entity[] {
    const preprocessedData = this.preprocessor.preprocess([
      { text, entities: [], class: '' } as Sample,
    ])
    const tokens = preprocessedData.x[0]
    const x = tensor([this.tokensCodifier.encode(tokens)])
    const prediction = (this.model.predict(x) as Tensor3D).arraySync()[0]
    const confidences = prediction.map(c => Math.max(...c))
    const labels = this.entitiesCodifier.decode(prediction)

    const entities: Entity[] = []
    tokens.forEach((token, i) => {
      const confidence = confidences[i]
      const label = labels[i]
      if (
        token != PADDING_TOKEN &&
        label != NEUTRAL_ENTITY &&
        confidence >= threshold
      ) {
        entities.push({
          text: token,
          label: labels[i],
          confidence: confidences[i],
        })
      }
    })
    return entities
  }

  async saveModel(path: string): Promise<void> {
    mkdirSync(path, { recursive: true })
    await this.model.save(`file://${path}`)
  }
}
