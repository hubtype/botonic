import { NormalizerEs } from '../../../../src/preprocess/engines/es/normalizer-es'

describe('Spanish normalizer', () => {
  test.each([
    ['Donde está mi pedido XGTSZF?', 'donde esta mi pedido xgtszf?'],
    [
      'DONDE PUEDO ENCONTRAR ESTE PEDIDO?',
      'donde puedo encontrar este pedido?',
    ],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerEs()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
