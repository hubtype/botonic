import { CONSTANTS } from '../../src';
import { WordEmbeddingsManager } from '../../src/embeddings/word-embeddings-manager';
import { WordEmbeddingsConfig } from '../../src/types';

describe('new embeddings matrix', () => {
  it('should generate tensor matrix', async () => {
    const wordEmbeddingsManager = new WordEmbeddingsManager();
    const config = {
      type: 'glove',
      dimension: 50,
      language: 'en',
      vocabulary: {
        [CONSTANTS.UNKNOWN_TOKEN]: 0,
        today: 1,
        hello: 2,
        am: 3,
        i: 4,
        '!': 5,
      },
    } as WordEmbeddingsConfig;
    await wordEmbeddingsManager.generateWordEmbeddingsMatrix(config);
    const matrix = wordEmbeddingsManager.matrix;
    const tensorMatrix = wordEmbeddingsManager.wordEmbeddingsMatrix;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    expect(matrix[1]).toEqual(todayEmbedding);
    expect(tensorMatrix.shape[0]).toBe(Object.keys(config.vocabulary).length);
    expect(tensorMatrix.shape[1]).toBe(config.dimension);
  });
});

const todayEmbedding = [
  0.00027751,
  0.42673,
  -0.082938,
  0.27601,
  0.64721,
  -0.91728,
  -0.63471,
  -0.28023,
  -0.66653,
  -0.28436,
  -0.064249,
  -0.43626,
  -0.1083,
  -0.35818,
  0.72311,
  0.65368,
  -0.29573,
  0.12007,
  -0.029959,
  -0.20594,
  0.20017,
  0.16421,
  0.15202,
  -0.024855,
  0.52887,
  -1.3625,
  -0.56036,
  0.17777,
  -0.091003,
  0.097549,
  3.5102,
  0.10631,
  0.065602,
  -0.080777,
  -0.12553,
  -0.69932,
  -0.015068,
  0.39353,
  -0.0028195,
  0.20635,
  -0.47726,
  -0.12639,
  0.29399,
  0.1,
  0.00034015,
  0.62769,
  -0.45344,
  0.39615,
  0.018857,
  0.17536,
];
