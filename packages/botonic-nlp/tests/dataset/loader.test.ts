import { DatasetLoader } from '../../src/dataset/loader'
import * as helper from '../helpers/constants-helper'

describe('Dataset Loader', () => {
  test('Loading Dataset', () => {
    const dataset = DatasetLoader.load(helper.DATA_DIR_PATH)
    expect(dataset.classes).toEqual(helper.CLASSES)
    expect(dataset.entities).toEqual(helper.ENTITIES)
    expect(dataset.length).toEqual(180)
  })
})
