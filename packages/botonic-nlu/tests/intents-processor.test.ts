import { IntentsProcessor } from '../src/intents-processor';
import { INTENTS } from './constants';

const intentsProcessor = IntentsProcessor.fromDecoder(INTENTS);

describe('Intent decoder.', () => {
  test('Checking decoder', () => {
    expect(intentsProcessor.decoder).toEqual({
      '0': 'BookRestaurant',
      '1': 'GetWeather',
      '2': 'PlayMusic',
      '3': 'Greetings',
    });
  });

  test('Decoding intentId', () => {
    expect(intentsProcessor.decode(3)).toEqual('Greetings');
  });
});

describe('Intent encoder.', () => {
  test('Checking encoder', () => {
    expect(intentsProcessor.encoder).toEqual({
      BookRestaurant: 0,
      GetWeather: 1,
      PlayMusic: 2,
      Greetings: 3,
    });
  });

  test('Encoding intent', () => {
    expect(intentsProcessor.encode('Greetings')).toEqual(3);
  });
});
