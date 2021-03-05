import {
  LayersModel,
  loadLayersModel,
  Scalar,
  Tensor,
} from '@tensorflow/tfjs-node'
import { mkdirSync } from 'fs'

import { ModelEvaluation } from './types'

export class ModelHandler {
  constructor(readonly model: LayersModel) {}

  static async load(path: string): Promise<ModelHandler> {
    return new ModelHandler(await loadLayersModel(`file://${path}/model.json`))
  }

  async train(
    x: Tensor,
    y: Tensor,
    args: { epochs: number; batchSize: number }
  ): Promise<void> {
    await this.model.fit(x, y, args)
  }

  async evaluate(x: Tensor, y: Tensor): Promise<ModelEvaluation> {
    const [loss, accuracy] = (await this.model.evaluate(x, y)) as Scalar[]
    return {
      loss: loss.arraySync(),
      accuracy: accuracy.arraySync(),
    }
  }

  predict(x: Tensor): Tensor {
    return this.model.predict(x) as Tensor
  }

  async save(path: string): Promise<void> {
    mkdirSync(path, { recursive: true })
    await this.model.save(`file://${path}`)
  }
}
