import { WordEmbeddingsMatrix } from '../../src/embeddings/word-embeddings-matrix';
import { WordEmbeddingsCompleteConfig } from '../../src/types';
const vocabulary = require('./vocabulary.json');

describe('Word Embedding Matrix', () => {
  const weConfig: WordEmbeddingsCompleteConfig = {
    locale: 'en',
    kind: 'glove',
    dimension: 50,
    trainable: false,
  };

  it('A matrix with valid config', async () => {
    const we = new WordEmbeddingsMatrix(weConfig, vocabulary);
    expect(we.isValid).toBe(true);
  });
  it('Inits a matrix, length of voc (rows), dimension of embeddings(columns)', async () => {
    const we = new WordEmbeddingsMatrix(
      { locale: 'en', kind: 'glove', dimension: 50, trainable: false },
      vocabulary,
    );
    if (we.isValid) await we.load();
    we.init();
    expect(we.matrix.length).toBe(Object.keys(vocabulary).length);
    expect(we.matrix[0].length).toBe(50);
    expect(we.matrix[0][0]).toBeGreaterThanOrEqual(-1);
    expect(we.matrix[0][0]).toBeLessThanOrEqual(1);
  });
  it('Inits a matrix, length of voc (rows), dimension of embeddings(columns), custom initialization', async () => {
    const we = new WordEmbeddingsMatrix(
      { locale: 'en', kind: 'glove', dimension: 50, trainable: false },
      vocabulary,
    );
    if (we.isValid) await we.load();
    we.init(() => 2);
    expect(we.matrix.length).toBe(Object.keys(vocabulary).length);
    expect(we.matrix[0].length).toBe(50);
    expect(we.matrix[0][0]).toBe(2);
  });
  it('Generating an embedding matrix (embeddings exist) and check value is okay', async () => {
    const we = new WordEmbeddingsMatrix(
      { locale: 'en', kind: 'glove', dimension: 50, trainable: false },
      vocabulary,
    );
    if (we.isValid) await we.load();
    const wordAt1 = 'give';
    const res = await we.getEmbeddingForWord(wordAt1);
    await we.generate();
    expect(we.matrix[1]).toEqual(res.vector);
  });
  it('Filling an embedding matrix (embeddings NOT exist) and check value is okay', async () => {
    const we = new WordEmbeddingsMatrix(
      { locale: 'af', kind: 'glove', dimension: 50, trainable: false },
      vocabulary,
    );
    if (we.isValid) await we.load();
    await we.generate();
    expect(we.matrix[4][5]).toBeGreaterThanOrEqual(-1);
    expect(we.matrix[4][5]).toBeLessThanOrEqual(1);
  });
});
