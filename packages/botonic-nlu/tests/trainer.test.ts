import { Trainer } from '../src/trainer';
import {
  initFromDirectory,
  BOOKRESTAURANT_UTTERANCES_LENGTH,
  GETDIRECTIONS_UTTERANCES_LENGTH,
  GRATITUDE_UTTERANCES_LENGTH,
  GREETINGS_UTTERANCES_LENGTH,
} from './utils';

import * as natural from 'natural';

describe('Trainer', () => {
  it('Just initialized Trainer', () => {
    const nlu = initFromDirectory('en', 'utterances');
    const trainer = new Trainer('en', nlu.data.en);
    expect(trainer.labels).toEqual({
      '0': 'BookRestaurant',
      '1': 'GetDirections',
      '2': 'Gratitude',
      '3': 'Greetings',
    });
    expect(trainer.reversedLabels).toEqual({
      BookRestaurant: 0,
      GetDirections: 1,
      Gratitude: 2,
      Greetings: 3,
    });
    expect(trainer.samples).toHaveLength(
      BOOKRESTAURANT_UTTERANCES_LENGTH +
        GETDIRECTIONS_UTTERANCES_LENGTH +
        GRATITUDE_UTTERANCES_LENGTH +
        GREETINGS_UTTERANCES_LENGTH,
    );
  });

  it('Injecting two different tokenizers', async () => {
    const trainer = new Trainer('en', { dummyInitialization: [] });
    trainer.withTokenizer(new natural.TreebankWordTokenizer());
    const tokenized1 = trainer.preprocessing.tokenize(
      "I'd like to go to new york?",
    );
    expect(tokenized1).toHaveLength(9);
    trainer.withTokenizer(new natural.AggressiveTokenizer());
    const tokenized2 = trainer.preprocessing.tokenize(
      "I'd like to go to new york?",
    );
    expect(tokenized2).toHaveLength(8);
  });
  // TODO: Check if you run the trainer without params
});
