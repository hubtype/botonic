const { BotonicNLU } = require('./dist/botonic-nlu');

const nlu = new BotonicNLU();

const modelDataPath =
  '/home/eric/Git/botonic/packages/botonic-nlu/tests/nlu/models/simple-nn/model-data.json';
nlu.loadModelData(modelDataPath);

const modelPath =
  '/home/eric/Git/botonic/packages/botonic-nlu/tests/nlu/models/simple-nn/model.json';

(async () => {
  await nlu.loadModel(modelPath);
  const prediction = nlu.predictProbabilities('Make a reservation for tonight');
  console.log(prediction);
})();
