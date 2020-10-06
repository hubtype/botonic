const BotonicNLU = require('./dist').BotonicNLU;
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const { NLU_DIR, UTTERANCES_DIR } = require('./dist/constants');

const UTTERANCES_PATH = path.join(
  process.cwd(),
  'tests',
  NLU_DIR,
  UTTERANCES_DIR,
);

// Adding examples from a directory (easy to add new samples with API)
const initFromDirectory = (filterBy) => {
  // Reading and filtering langs defined in 'utterances directory'
  const pathLangs = fs
    .readdirSync(UTTERANCES_PATH)
    .filter((locale) => locale == filterBy);
  const nlu = new BotonicNLU();
  pathLangs.forEach((locale) => {
    const intentsForLang = fs.readdirSync(path.join(UTTERANCES_PATH, locale));
    intentsForLang.forEach((filename) => {
      const intent = filename.replace('.txt', '');
      const utterances = fs
        .readFileSync(path.join(UTTERANCES_PATH, locale, filename), 'UTF-8')
        .split('\n');
      utterances.forEach((utterance) => {
        // Adding specific samples
        nlu.addExample({ locale, intent, utterance });
      });
    });
  });
  return nlu;
};

// These will be the sentences to predict
const toPredict = [
  'Please, Make a reservation in a restaurant',
  'How can i go to Paris',
  'What i have to do to go to Gironella',
  'I need a table for breakfast',
  'I want a table for dinner',
  'Thank you very much!',
];

// Initializing Botonic NLU
const nlu = initFromDirectory('en');

// SIMPLE TRAINING (we only define a tokenizer and some params)
const simpleTrainer = nlu
  .train('en')
  .withTokenizer(new natural.TreebankWordTokenizer())
  .withParams({ epochs: 30, validationSplit: 0.2 });

(async () => {
  await simpleTrainer.run();
  toPredict.forEach((input) => simpleTrainer.predict(input));
})();

// // TRAINING WITH CUSTOM MODEL

// Uncomment for using a custom model defined by the dev
// const customTrainerModel = nlu
//   .train('en')
//   .withTokenizer(new natural.AggressiveTokenizer())
//   .withParams({ epochs: 20, validationSplit: 0.2 })
//   .withWordEmbeddings({
//     kind: '10k-fasttext',
//     dimension: 300,
//     trainable: false,
//   });
// (async () => {
//   const matrix = await customTrainerModel.getEmbeddingMatrix();
//   const model = tf.sequential();
//   model.add(
//     tf.layers.embedding({
//       inputDim: matrix.shape[0],
//       outputDim: matrix.shape[1],
//       inputLength: customTrainerModel.sequenceLength,
//       trainable: customTrainerModel.embeddings.trainable,
//       weights: [matrix],
//     }),
//   );
//   model.add(
//     tf.layers.lstm({
//       units: 5,
//       dropout: 0.2,
//       recurrentDropout: 0.2,
//     }),
//   );
//   model.add(
//     tf.layers.dense({
//       units: Object.keys(customTrainerModel.reversedLabels).length,
//       activation: 'softmax',
//     }),
//   );
//   model.summary();
//   model.compile({
//     optimizer: tf.train.adam(0.01),
//     loss: 'categoricalCrossentropy',
//     metrics: ['accuracy'],
//   });
//   await customTrainerModel.run(model);
//   toPredict.forEach((input) => customTrainerModel.predict(input));
// })();
