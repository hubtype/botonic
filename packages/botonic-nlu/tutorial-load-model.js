const { BotonicNLU } = require('./dist/botonic-nlu');

const nlu = new BotonicNLU();

const modelDataPath =
  '/home/eric/Git/botonic/packages/botonic-nlu/src/nlu/models/en/model-data.json';
nlu.loadModelData(modelDataPath);

const modelPath =
  '/home/eric/Git/botonic/packages/botonic-nlu/src/nlu/models/en/model.json';

(async () => {
  await nlu.loadModel(modelPath);
  const prediction = nlu.predictProbabilities(
    'Book a table at the restaurant near to the stadium.',
  );
  console.log(prediction);
})();
