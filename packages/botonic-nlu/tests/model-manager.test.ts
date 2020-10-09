import { tensor } from '@tensorflow/tfjs-node';
import { ModelManager } from '../src/model-manager';
import { SimpleNN } from '../src/simple-nn';
import { SIMPLE_NN_MODEL_PATH } from './constants';

describe('Model Manager predictions', () => {
  const input = tensor([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 4, 5],
  ]);
  const modelManager = new ModelManager();

  test('Predicting intent Id', () => {
    const expectedOutput = 1;
    (async () => {
      await modelManager.loadModel(SIMPLE_NN_MODEL_PATH);
      expect(modelManager.predict(input)).toEqual(expectedOutput);
    })();
  });

  test('Predicting probabilities', () => {
    const expectedOutput = [
      { intentId: 0, confidence: 0.024450620636343956 },
      { intentId: 1, confidence: 0.5676464438438416 },
      { intentId: 2, confidence: 0.24030351638793945 },
      { intentId: 3, confidence: 0.1675993651151657 },
    ];
    (async () => {
      await modelManager.loadModel(SIMPLE_NN_MODEL_PATH);
      expect(modelManager.predictProbabilities(input)).toEqual(expectedOutput);
    })();
  });
});
