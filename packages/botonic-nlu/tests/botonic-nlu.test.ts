import { normalizer, stemmer, tokenizer } from './preprocessing-tools';
import { join } from 'path';

describe('new NLU', () => {
  it('should...', () => {
    expect(true).toBe(true);
  });
});

// describe('Botonic NLU API', () => {
//   const nlu = new BotonicNLU();
//   it('Adding one example', () => {
//     nlu.addExample({
//       locale: 'en',
//       intent: 'BookRestaurant',
//       utterance: 'I would like to make a reservation',
//     });
//     expect(nlu.locales).toEqual(['en']);
//     expect(nlu.locales).toHaveLength(1);
//     expect(Object.keys(nlu.data.en)).toEqual(['BookRestaurant']);
//     expect(nlu.data.en['BookRestaurant']).toEqual([
//       'I would like to make a reservation',
//     ]);
//   });
//   it('Adding duplicated examples', () => {
//     nlu.addExample({
//       locale: 'en',
//       intent: 'BookRestaurant',
//       utterance: 'I would like to make a reservation',
//     });
//     expect(nlu.locales).toEqual(['en']);
//     expect(nlu.locales).toHaveLength(1);
//     expect(Object.keys(nlu.data.en)).toEqual(['BookRestaurant']);
//     expect(nlu.data.en['BookRestaurant']).toEqual([
//       'I would like to make a reservation',
//     ]);
//   });
//   it('Adding two invalid utterances for examples', () => {
//     nlu.addExample({
//       locale: 'en',
//       intent: 'BookRestaurant',
//       utterance: '',
//     });
//     nlu.addExample({
//       locale: 'en',
//       intent: 'BookRestaurant',
//       utterance: '      ',
//     });
//     expect(nlu.locales).toEqual(['en']);
//     expect(nlu.locales).toHaveLength(1);
//     expect(Object.keys(nlu.data.en)).toEqual(['BookRestaurant']);
//     expect(nlu.data.en['BookRestaurant']).toEqual([
//       'I would like to make a reservation',
//     ]);
//   });
//   it('Adding more examples and locales', () => {
//     nlu.addExample({
//       locale: 'en',
//       intent: 'Greetings',
//       utterance: 'Hey! How are you?',
//     });
//     nlu.addExample({
//       locale: 'en',
//       intent: 'Greetings',
//       utterance: 'Hellooooo! How is it going?',
//     });
//     nlu.addExample({
//       locale: 'es',
//       intent: 'Direcciones',
//       utterance: '¿Como puedo llegar a Barcelona?',
//     });
//     expect(nlu.locales).toEqual(['en', 'es']);
//     expect(nlu.locales).toHaveLength(2);
//     expect(Object.keys(nlu.data.en)).toEqual(['BookRestaurant', 'Greetings']);
//     expect(Object.keys(nlu.data.en)).toHaveLength(2);
//     expect(Object.keys(nlu.data.es)).toEqual(['Direcciones']);
//     expect(nlu.data.en['BookRestaurant']).toEqual([
//       'I would like to make a reservation',
//     ]);
//     expect(nlu.data.en['Greetings']).toEqual([
//       'Hey! How are you?',
//       'Hellooooo! How is it going?',
//     ]);
//     expect(nlu.data.es['Direcciones']).toEqual([
//       '¿Como puedo llegar a Barcelona?',
//     ]);
//   });
// });

// describe('Reading from directories', () => {
//   const nlu = initFromDirectory('en');
//   expect(Object.keys(nlu.data)).toEqual(['en']);
//   expect(Object.keys(nlu.data.en)).toEqual([
//     'BookRestaurant',
//     'GetDirections',
//     'Gratitude',
//     'Greetings',
//   ]);
//   expect(nlu.data.en.BookRestaurant).toHaveLength(
//     BOOKRESTAURANT_UTTERANCES_LENGTH,
//   );
//   expect(nlu.data.en.GetDirections).toHaveLength(
//     GETDIRECTIONS_UTTERANCES_LENGTH,
//   );
//   expect(nlu.data.en.Gratitude).toHaveLength(GRATITUDE_UTTERANCES_LENGTH);
//   expect(nlu.data.en.Greetings).toHaveLength(GREETINGS_UTTERANCES_LENGTH);
// });
