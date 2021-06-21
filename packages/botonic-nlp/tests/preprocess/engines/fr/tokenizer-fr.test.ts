import { TokenizerFr } from '../../../../src/preprocess/engines/fr/tokenizer-fr'

describe('French tokenizer', () => {
  test.each([
    ['Où est ma commande? ', ['Où', 'est', 'ma', 'commande']],
    [
      'bonjour, je veux retourner cette chemise',
      ['bonjour', 'je', 'veux', 'retourner', 'cette', 'chemise'],
    ],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerFr()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
