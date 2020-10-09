import { join } from 'path';
import * as CONSTANTS from '../src/constants';
import { DataReader } from '../src/data-reader';

describe('Reading data.', () => {
  const dataReader = new DataReader();
  const dirDataPath = join(
    process.cwd(),
    'tests',
    CONSTANTS.NLU_DIR,
    CONSTANTS.UTTERANCES_DIR,
    'test',
  );
  const csvDataPath = join(dirDataPath, 'data.csv');

  test('Number of samples read.', () => {
    expect(dataReader.readData(dirDataPath)).toHaveLength(8);
    expect(dataReader.readData(csvDataPath)).toHaveLength(8);
  });

  test('Data contains a sample.', () => {
    const specificSample = {
      feature: 'Hi!',
      label: 'Greetings',
    };
    expect(dataReader.readData(dirDataPath)).toContainEqual(
      expect.objectContaining(specificSample),
    );
    expect(dataReader.readData(csvDataPath)).toContainEqual(
      expect.objectContaining(specificSample),
    );
  });
});
