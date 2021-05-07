import { InputParser } from '../../src/dataset/input-parser'
import * as helper from '../helpers/constants-helper'

describe('Input Parser', () => {
  const sut = new InputParser(helper.DATA_DIR_PATH)
  test('Parse Input Files', () => {
    const { classes, entities, samples } = sut.parse()
    expect(classes).toEqual(['BuyProduct', 'ReturnProduct'])
    expect(entities).toEqual(['product', 'color', 'size'])
    expect(samples.length).toEqual(180)
  })
})
