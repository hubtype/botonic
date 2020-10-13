const { BotonicNLU } = require('./dist');

const nlu = new BotonicNLU();

const data = nlu.loadData({
  path: '/home/eric/Documents/Bots/nlu-refactor/src/nlu/utterances/en',
  language: 'en',
  maxSeqLen: 20,
});

const [xTrain, xTest, yTrain, yTest] = nlu.trainTestSplit({
  data: data,
  testPercentage: 0.05,
});

(async () => {
  await nlu.createModel({ learningRate: 0.0001 });
  await nlu.train(xTrain, yTrain, { epochs: 50 });
  const accuracy = await nlu.evaluate(xTest, yTest);
  console.log('Accuracy:', accuracy);
  await nlu.saveModel();
})();
