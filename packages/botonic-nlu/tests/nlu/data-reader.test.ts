import { DataReader } from '../../src/data-reader';
import * as CONSTANTS from '../../src/constants';
import { join } from 'path';

describe('Testing Botonic NLU main methods', () => {
  const dataPath = join(
    process.cwd(),
    'tests',
    CONSTANTS.NLU_DIR,
    CONSTANTS.UTTERANCES_DIR,
    'en',
    'data.csv',
  );
  it('loads from a csv correctly', () => {
    const dataReader = new DataReader();
    const data = dataReader.readData(dataPath);
    expect(data).toHaveLength(136);
  });
});
