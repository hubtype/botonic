import { IndexedItems } from '../../src/encode/indexed-items'
import { OneHotEncoder } from '../../src/encode/one-hot-encoder'

describe('One Hot Encoder', () => {
  const sut = new OneHotEncoder(
    new IndexedItems(['product', 'material', 'size'])
  )

  test('Encoding', () => {
    expect(sut.encode(['product', 'product', 'size'])).toEqual([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
    ])
  })

  test('Decoding', () => {
    expect(
      sut.decode([
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 1],
      ])
    ).toEqual(['material', 'product', 'size'])
  })

  test('Invalid Token', () => {
    expect(() => {
      sut.encode(['product', 'product', 'material', 'color'])
    }).toThrowError()
  })

  test('Invalid Categorical Length', () => {
    expect(() => {
      sut.decode([
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ])
    }).toThrowError()
  })
})
