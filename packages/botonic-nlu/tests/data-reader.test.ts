import { join } from 'path';
import { DataReader } from '../src/data-reader';
import { UTTERANCES_DIR } from './constants';

describe('Reading data.', () => {
  const dataReader = new DataReader();
  const csvDataPath = join(UTTERANCES_DIR, 'data.csv');

  test('Number of samples read.', () => {
    expect(dataReader.readData(UTTERANCES_DIR)).toHaveLength(8);
    expect(dataReader.readData(csvDataPath)).toHaveLength(8);
  });

  test('Data contains a sample.', () => {
    const specificSample = {
      feature: 'Hi!',
      label: 'Greetings',
    };
    expect(dataReader.readData(UTTERANCES_DIR)).toContainEqual(
      expect.objectContaining(specificSample),
    );
    expect(dataReader.readData(csvDataPath)).toContainEqual(
      expect.objectContaining(specificSample),
    );
  });
});
