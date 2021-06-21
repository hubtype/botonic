import { TokenizerEs } from '../../../../src/preprocess/engines/es/tokenizer-es'

describe('Deutsch tokenizer', () => {
  test.each([
    ['wo ist meine Bestellung?', ['wo', 'ist', 'meine', 'Bestellung']],
    [
      'Guten Morgen, ich möchte dieses Shirt zurückgeben',
      ['Guten', 'Morgen', 'ich', 'möchte', 'dieses', 'Shirt', 'zurückgeben'],
    ],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerEs()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
