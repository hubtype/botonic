import { InputDataReader } from '../../src/dataset/input-data-reader'
import * as helper from '../helpers/constants-helper'

describe('Input Data Reader', () => {
  test('Read Input Data', () => {
    const sut = new InputDataReader(helper.DATA_DIR_PATH)
    const inputData = sut.read()
    expect(inputData.length).toEqual(2)
    expect(inputData.map(i => i.class).sort()).toEqual(helper.CLASSES.sort())
    expect(inputData.map(i => i.entities).sort()).toEqual(
      Array(helper.CLASSES.length).fill(helper.ENTITIES).sort()
    )
    expect(
      inputData.filter(i => i.class == 'BuyProduct').map(i => i.samples.length)
    ).toEqual([5])
  })
})
