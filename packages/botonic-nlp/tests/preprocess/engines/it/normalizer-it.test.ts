import { NormalizerIt } from '../../../../src/preprocess/engines/it/normalizer-it'

describe('Italian normalizer', () => {
  test.each([
    ["Dov'è il mio ordine XGTSZF?", "dov'e il mio ordine xgtszf?"],
    ['DOVE POSSO TROVARE QUESTO ORDINE?', 'dove posso trovare questo ordine?'],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerIt()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
