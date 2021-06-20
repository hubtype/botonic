import { TokenizerEn } from '../../../../src/preprocess/engines/en/tokenizer-en'

describe('English tokenizer', () => {
  test.each([
    [
      'i want to test this nlp package',
      ['i', 'want', 'to', 'test', 'this', 'nlp', 'package'],
    ],
    ['where is my order!?', ['where', 'is', 'my', 'order']],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerEn()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
