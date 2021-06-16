import { TokenizerIt } from '../../../../src/preprocess/engines/it/tokenizer-it'

describe('Italian tokenizer', () => {
  test.each([
    ["Dov'è il mio ordine?", ['Dov', 'è', 'il', 'mio', 'ordine']],
    [
      'bene, voglio restituire questa maglietta',
      ['bene', 'voglio', 'restituire', 'questa', 'maglietta'],
    ],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerIt()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
