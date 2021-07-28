import { ClassWeight, LayersModel, Scalar, Tensor } from '@tensorflow/tfjs-node'

export type ModelEvaluation = { loss: number; accuracy: number }

export class ModelManager {
  constructor(readonly model: LayersModel) {}

  async train(
    x: Tensor,
    y: Tensor,
    args: {
      epochs: number
      batchSize: number
      classWeight?: ClassWeight
    }
  ): Promise<void> {
    await this.model.fit(x, y, args)
  }

  evaluate(x: Tensor, y: Tensor): Promise<ModelEvaluation> {
    const [loss, accuracy] = this.model.evaluate(x, y) as Scalar[]
    return Promise.resolve({
      loss: loss.arraySync(),
      accuracy: accuracy.arraySync(),
    })
  }

  predict(x: Tensor): Tensor {
    return this.model.predict(x) as Tensor
  }
}
