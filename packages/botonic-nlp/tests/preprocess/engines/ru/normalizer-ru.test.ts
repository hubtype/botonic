import { NormalizerRu } from '../../../../src/preprocess/engines/ru/normalizer-ru'

describe('Russian normalizer', () => {
  test.each([
    ['Где мой заказ XGTSZF?', 'где мои заказ xgtszf?'],
    ['ГДЕ Я МОГУ НАЙТИ ЗАКАЗ?', 'где я могу наити заказ?'],
  ])('normalize sentence', (raw: string, expected: string) => {
    const normalizer = new NormalizerRu()
    expect(normalizer.normalize(raw)).toEqual(expected)
  })
})
