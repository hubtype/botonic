import { InputDataParser } from '../../src/dataset/input-data-parser'
import { InputDataReader } from '../../src/dataset/input-data-reader'
import * as helper from '../helpers/constants-helper'

describe('Input Data Parser', () => {
  test('Parse Input Data', () => {
    const inputData = new InputDataReader(helper.DATA_DIR_PATH).read()

    const sut = new InputDataParser()

    const { classes, entities, samples } = sut.parse(inputData)
    expect(classes).toEqual(['BuyProduct', 'ReturnProduct'])
    expect(entities).toEqual(['product', 'color', 'size'])
    expect(samples.length).toEqual(180)
  })
})
