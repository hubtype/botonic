import TokenizerEs from '../../../../src/preprocess/engines/es/tokenizer-es'

describe('Spanish tokenizer', () => {
  test.each([
    ['donde esta mi pedido?', ['donde', 'esta', 'mi', 'pedido', '?']],
    [
      'buenas, quiero devolver esta camiseta',
      ['buenas', ',', 'quiero', 'devolver', 'esta', 'camiseta'],
    ],
  ])('tokenizing sentence', (raw: string, expected: string[]) => {
    const tokenizer = new TokenizerEs()
    expect(tokenizer.tokenize(raw)).toEqual(expected)
  })
})
