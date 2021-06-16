import { NormalizerFr } from '../../../../src/preprocess/engines/fr/normalizer-fr'

describe('French normalizer', () => {
  test.each([
    ['Où est ma commande XGTSZF?', 'ou est ma commande xgtszf?'],
    ['O PUIS-JE TROUVER CETTE COMMANDE?', 'o puis-je trouver cette commande?'],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerFr()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
