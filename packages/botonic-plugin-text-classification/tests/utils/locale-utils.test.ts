import { detectLocale } from '../../src/utils/locale-utils'

describe('Locale utils', () => {
  test.each([
    ['where is my order?', 'en'],
    ["dov'è il mio ordine?", 'it'],
    ['donde está mi pedido?', 'es'],
    ['где мой заказ?', 'ru'],
  ])('Locale detection', (input: string, locale: string) => {
    expect(detectLocale(input, ['en', 'ru', 'es', 'it'])).toEqual(locale)
  })
})
