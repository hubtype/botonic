import { LayersModel, Scalar, Tensor } from '@tensorflow/tfjs-node'

export type ModelEvaluation = { loss: number; accuracy: number }

export class ModelManager {
  constructor(readonly model: LayersModel) {}

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
}
