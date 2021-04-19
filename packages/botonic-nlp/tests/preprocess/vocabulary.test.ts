import { Vocabulary } from '../../src/preprocess/vocabulary'

describe('Vocabulary', () => {
  const sut = new Vocabulary(['hat', 'shirt', 'jeans', 'hat', 'jacket'])

  test('Unique tokens', () => {
    expect(sut.tokens).toEqual(['hat', 'shirt', 'jeans', 'jacket'])
  })

  test('Correct length', () => {
    expect(sut.length).toEqual(4)
  })

  test('Check if token included', () => {
    expect(sut.includes('hat')).toBeTruthy()
    expect(sut.includes('coat')).toBeFalsy()
  })

  test('Get Token Id', () => {
    expect(sut.getTokenId('jacket')).toEqual(3)
  })

  test('Get Token', () => {
    expect(sut.getToken(1)).toEqual('shirt')
  })

  test('Invalid Token', () => {
    expect(() => {
      sut.getTokenId('hoodie')
    }).toThrowError()
  })

  test('Invalid Token Id', () => {
    expect(() => {
      sut.getToken(10)
    }).toThrowError()
  })
})
