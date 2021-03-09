import { DatasetLoader } from '../dataset/loader'
import { Dataset } from '../dataset/types'

export class DataLoader {
  data: Dataset
  constructor(path: string) {
    this.data = DatasetLoader.load(path)
  }
}
