import { join } from 'path'

import { DatasetReader } from '../src/data-reader'
import { UTTERANCES_DIR } from './constants'

const TEST_SAMPLE = {
  feature: 'How is it going?',
  label: 'Greetings',
}

describe('Reading data.', () => {
  const csvPath = join(UTTERANCES_DIR, 'data.csv')

  test('Number of samples read from csv.', () => {
    expect(DatasetReader.readData(csvPath, { csvSeparator: ',' })).toHaveLength(
      30
    )
  })

  test('Data from csv contains a specific sample.', () => {
    expect(
      DatasetReader.readData(csvPath, { csvSeparator: ',' })
    ).toContainEqual(expect.objectContaining(TEST_SAMPLE))
  })

  test('Number of samples read from directory.', () => {
    expect(
      DatasetReader.readData(UTTERANCES_DIR, { csvSeparator: ',' })
    ).toHaveLength(30)
  })

  test('Data from directory contains a specific sample.', () => {
    expect(
      DatasetReader.readData(UTTERANCES_DIR, { csvSeparator: ',' })
    ).toContainEqual(expect.objectContaining(TEST_SAMPLE))
  })
})
