import { LayersModel, loadLayersModel } from '@tensorflow/tfjs-node'
import { mkdirSync } from 'fs'

export class ModelStorage {
  public readonly MODEL_FILENAME = 'model.json'

  async load(path: string): Promise<LayersModel> {
    return await loadLayersModel(`file://${path}/${this.MODEL_FILENAME}`)
  }

  async save(model: LayersModel, path: string): Promise<void> {
    mkdirSync(path, { recursive: true })
    await model.save(`file://${path}`)
  }
}
