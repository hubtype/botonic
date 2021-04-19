import { IndexedItems } from '../../src/encode/indexed-items'

describe('Vocabulary', () => {
  const sut = new IndexedItems(['hat', 'shirt', 'jeans', 'hat', 'jacket'])

  test('Unique items', () => {
    expect(sut.items).toEqual(['hat', 'shirt', 'jeans', 'jacket'])
  })

  test('Correct length', () => {
    expect(sut.length).toEqual(4)
  })

  test('Check if item included', () => {
    expect(sut.includes('hat')).toBeTruthy()
    expect(sut.includes('coat')).toBeFalsy()
  })

  test('Get Index', () => {
    expect(sut.getIndex('jacket')).toEqual(3)
  })

  test('Get Item', () => {
    expect(sut.getItem(1)).toEqual('shirt')
  })

  test('Invalid Item', () => {
    expect(() => {
      sut.getIndex('hoodie')
    }).toThrowError()
  })

  test('Invalid Index', () => {
    expect(() => {
      sut.getItem(10)
    }).toThrowError()
  })
})
