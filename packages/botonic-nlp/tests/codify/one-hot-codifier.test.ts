import { OneHotCodifier } from '../../src/codify/one-hot-codifier'

describe('One Hot Codifier', () => {
  const codifier = new OneHotCodifier(['product', 'material', 'size'])

  test('Encoding', () => {
    expect(codifier.encode(['product', 'product', 'size'])).toEqual([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
    ])
  })

  test('Decoding', () => {
    expect(
      codifier.decode([
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1],
      ])
    ).toEqual(['material', 'product', 'size'])
  })

  test('Invalid Token', () => {
    expect(() => {
      codifier.encode(['product', 'product', 'material', 'color'])
    }).toThrowError()
  })

  test('Invalid Categorical Length', () => {
    expect(() => {
      codifier.decode([
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ])
    }).toThrowError()
  })
})
