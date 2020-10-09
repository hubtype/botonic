import { join } from 'path';
import * as CONSTANTS from '../src/constants';
import { IntentsProcessor } from '../src/intents-processor';
import { readJSON } from '../src/util/file-system';

describe('Intent decoder.', () => {
  const modelDataPath = join(
    process.cwd(),
    'tests',
    CONSTANTS.NLU_DIR,
    CONSTANTS.MODELS_DIR,
    'test',
    'model-data.json',
  );

  const modelData = readJSON(modelDataPath);

  const intentsProcessor = new IntentsProcessor();
  intentsProcessor.loadEncoderDecoder(modelData.intents);

  test('Checking decoder', () => {
    const expectedDecoder = {
      '0': 'Gratitude',
      '1': 'BookRestaurant',
      '2': 'GetDirections',
      '3': 'Greetings',
    };
    expect(intentsProcessor.decoder).toEqual(expectedDecoder);
  });

  test('Decoding intentId', () => {
    const intentId = 3;
    const expectedOutput = 'Greetings';
    expect(intentsProcessor.decode(intentId)).toEqual(expectedOutput);
  });
});

describe('Intent encoder.', () => {
  const modelDataPath = join(
    process.cwd(),
    'tests',
    CONSTANTS.NLU_DIR,
    CONSTANTS.MODELS_DIR,
    'test',
    'model-data.json',
  );

  const modelData = readJSON(modelDataPath);

  const intentsProcessor = new IntentsProcessor();
  intentsProcessor.loadEncoderDecoder(modelData.intents);
  test('Checking encoder', () => {
    const expectedEcoder = {
      Gratitude: 0,
      BookRestaurant: 1,
      GetDirections: 2,
      Greetings: 3,
    };
    expect(intentsProcessor.encoder).toEqual(expectedEcoder);
  });

  test('Encoding intent', () => {
    const intent = 'Greetings';
    const expectedOutput = 3;
    expect(intentsProcessor.encode(intent)).toEqual(expectedOutput);
  });
});
