import { join } from 'path'
import { DataReader } from '../src/data-reader'
import { UTTERANCES_DIR } from './constants'

const SPECIFIC_SAMPLE = {
  feature: 'How is it going?',
  label: 'Greetings',
}

describe('Reading data.', () => {
  const dataReader = new DataReader()
  const csvPath = join(UTTERANCES_DIR, 'data.csv')

  test('Number of samples read from csv.', () => {
    expect(dataReader.readData(csvPath)).toHaveLength(30)
  })

  test('Data from csv contains a specific sample.', () => {
    expect(dataReader.readData(csvPath)).toContainEqual(
      expect.objectContaining(SPECIFIC_SAMPLE)
    )
  })

  test('Number of samples read from directory.', () => {
    expect(dataReader.readData(UTTERANCES_DIR)).toHaveLength(30)
  })

  test('Data from directory contains a specific sample.', () => {
    expect(dataReader.readData(UTTERANCES_DIR)).toContainEqual(
      expect.objectContaining(SPECIFIC_SAMPLE)
    )
  })
})
