import { LabelEncoder } from '../../src/encode/label-encoder'
import { Vocabulary } from '../../src/preprocess/vocabulary'

describe('Label Encoder', () => {
  const sut = new LabelEncoder(
    new Vocabulary(['this', 'test', 'is', 'yes', 'no', 'a', 'it'])
  )

  test('Encoding', () => {
    expect(sut.encode(['is', 'this', 'a', 'test'])).toEqual([2, 0, 5, 1])
  })

  test('Decoding', () => {
    expect(sut.decode([3, 6, 2])).toEqual(['yes', 'it', 'is'])
  })

  test('Invalid Token', () => {
    expect(() => {
      sut.encode(['is', 'this', 'nlp', '?'])
    }).toThrowError()
  })

  test('Invalid Token Id', () => {
    expect(() => {
      sut.decode([-1, 0, 10])
    }).toThrowError()
  })
})
