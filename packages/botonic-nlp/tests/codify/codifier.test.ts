import { Codifier } from '../../src/codify/codifier'

describe('Codifier', () => {
  const codifier = new Codifier(['this', 'test', 'is', 'yes', 'no', 'a', 'it'])

  test('Encoding', () => {
    expect(codifier.encode(['is', 'this', 'a', 'test'])).toEqual([2, 0, 5, 1])
  })

  test('Decoding', () => {
    expect(codifier.decode([3, 6, 2])).toEqual(['yes', 'it', 'is'])
  })

  test('Invalid Token', () => {
    expect(() => {
      codifier.encode(['is', 'this', 'nlp', '?'])
    }).toThrowError()
  })

  test('Invalid Token Id', () => {
    expect(() => {
      codifier.decode([-1, 0, 10])
    }).toThrowError()
  })
})
