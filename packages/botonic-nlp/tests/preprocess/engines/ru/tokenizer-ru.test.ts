import { TokenizerRu } from '../../../../src/preprocess/engines/ru/tokenizer-ru'

describe('Russian tokenizer', () => {
  test.each([
    ['Где мой заказ?', ['Где', 'мой', 'заказ']],
    [
      'доброе утро я хочу вернуть эту рубашку',
      ['доброе', 'утро', 'я', 'хочу', 'вернуть', 'эту', 'рубашку'],
    ],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerRu()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
