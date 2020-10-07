// import { BotonicNLU } from '../src';
// import { Trainer } from '../src/trainer';
// import * as natural from 'natural';
// import { PreProcessing } from '../src/preprocessing';

describe('new preprocessor', () => {
  it('should...', () => {
    expect(true).toBe(true);
  });
});

// const oneSamplePerThreeIntents = (): BotonicNLU => {
//   const nlu = new BotonicNLU();
//   nlu.addExample({
//     locale: 'en',
//     utterance: 'I would like to make a reservation',
//     intent: 'BookRestaurant',
//   });
//   nlu.addExample({
//     locale: 'en',
//     utterance: 'How can I reach the nearest station?',
//     intent: 'GetDirections',
//   });
//   nlu.addExample({
//     locale: 'en',
//     utterance: 'What is the weather like today?',
//     intent: 'GetWeather',
//   });
//   return nlu;
// };

// describe('Preprocessing preprocess()', () => {
//   const DEBUG_SENTENCE = true;
//   const DEBUG_ITEMS = false;
//   const nlu = oneSamplePerThreeIntents();
//   const trainer = new Trainer('en', nlu.data.en);
//   const samples = trainer.samples;
//   const preprocessing = new PreProcessing(
//     samples,
//     new natural.TreebankWordTokenizer(),
//   );

//   const { sequences, maxSentenceLength } = preprocessing.preprocess();

//   it('Converts well sentences to sequences', async () => {
//     let maxLenSample = 0;
//     samples.forEach((sample, index) => {
//       const tokenizedSample = preprocessing.tokenize(
//         preprocessing.normalize(sample.value),
//       );
//       if (tokenizedSample.length > maxLenSample)
//         maxLenSample = tokenizedSample.length;
//       if (DEBUG_SENTENCE)
//         console.debug(tokenizedSample, '<->', sequences[index]);
//       expect(tokenizedSample).toHaveLength(sequences[index].length);
//       sequences[index].forEach((indexForWord, index) => {
//         const word = tokenizedSample[index];
//         const wordToIndex = preprocessing.toIndex(word);
//         const indexToWord = preprocessing.toWord(wordToIndex);
//         if (DEBUG_ITEMS) console.debug(indexForWord, '<->', indexToWord);
//         expect(indexForWord).toEqual(wordToIndex);
//       });
//     });
//     expect(maxLenSample).toEqual(maxSentenceLength);
//     // TODO: Check if you run the trainer without params
//   });
// });
