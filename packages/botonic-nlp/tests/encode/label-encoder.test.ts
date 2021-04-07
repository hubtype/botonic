import { LabelEncoder } from '../../src/encode/label-encoder'

describe('Label Encoder', () => {
  const encoder = new LabelEncoder([
    'this',
    'test',
    'is',
    'yes',
    'no',
    'a',
    'it',
  ])

  test('Encoding', () => {
    expect(encoder.encode(['is', 'this', 'a', 'test'])).toEqual([2, 0, 5, 1])
  })

  test('Decoding', () => {
    expect(encoder.decode([3, 6, 2])).toEqual(['yes', 'it', 'is'])
  })

  test('Invalid Token', () => {
    expect(() => {
      encoder.encode(['is', 'this', 'nlp', '?'])
    }).toThrowError()
  })

  test('Invalid Token Id', () => {
    expect(() => {
      encoder.decode([-1, 0, 10])
    }).toThrowError()
  })
})
