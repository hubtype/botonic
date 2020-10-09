const { BotonicNLU } = require('./dist');

const nlu = new BotonicNLU();

const dataPath =
  '/home/eric/Git/botonic/packages/botonic-nlu/tests/nlu/utterances/simple-nn/data.csv';
const language = 'en';
const maxSeqLen = 20;
nlu.loadData(dataPath, language, maxSeqLen);

const testPercentage = 0.2;
nlu.splitData(testPercentage);

const learningRate = 0.0001;
const epochs = 70;
const batchSize = 8;
(async () => {
  await nlu.createModel(learningRate);
  await nlu.train(epochs, batchSize);
  const accuracy = await nlu.evaluate();
  console.log('Accuracy:', accuracy);
  await nlu.saveModel();
})();
