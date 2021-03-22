import { NormalizerEn } from '../../../../src/preprocess/engines/en/normalizer-en'

describe('English normalizer', () => {
  test.each([
    ['I want to test this NLP package', 'i want to test this nlp package'],
    ['WHERE IS MY ORDER!?', 'where is my order!?'],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerEn()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
