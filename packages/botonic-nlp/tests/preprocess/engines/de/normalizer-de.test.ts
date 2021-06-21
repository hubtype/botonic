import { NormalizerDe } from '../../../../src/preprocess/engines/de/normalizer-de'

describe('Deutsch normalizer', () => {
  test.each([
    ['Wo ist meine XGTSZF-Bestellung?', 'wo ist meine xgtszf-bestellung?'],
    [
      'WO KANN ICH DIESE BESTELLUNG FINDEN?',
      'wo kann ich diese bestellung finden?',
    ],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerDe()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
