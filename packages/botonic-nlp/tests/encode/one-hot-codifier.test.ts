import { OneHotEncoder } from '../../src/encode/one-hot-encoder'

describe('One Hot Encoder', () => {
  const encoder = new OneHotEncoder(['product', 'material', 'size'])

  test('Encoding', () => {
    expect(encoder.encode(['product', 'product', 'size'])).toEqual([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
    ])
  })

  test('Decoding', () => {
    expect(
      encoder.decode([
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1],
      ])
    ).toEqual(['material', 'product', 'size'])
  })

  test('Invalid Token', () => {
    expect(() => {
      encoder.encode(['product', 'product', 'material', 'color'])
    }).toThrowError()
  })

  test('Invalid Categorical Length', () => {
    expect(() => {
      encoder.decode([
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ])
    }).toThrowError()
  })
})
