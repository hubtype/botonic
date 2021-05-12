import { InputDataParser } from '../../src/dataset/input-data-parser'
import { InputDataReader } from '../../src/dataset/input-data-reader'
import * as helper from '../helpers/constants-helper'

describe('Input Data Parser', () => {
  test('Parse Input Data', () => {
    const inputData = new InputDataReader(helper.DATA_DIR_PATH).read()

    const sut = new InputDataParser()

    const { intents, entities, samples } = sut.parse(inputData)
    expect(intents.sort()).toEqual(helper.INTENTS.sort())
    expect(entities.sort()).toEqual(helper.ENTITIES.sort())
    expect(samples.length).toEqual(180)
  })
})
