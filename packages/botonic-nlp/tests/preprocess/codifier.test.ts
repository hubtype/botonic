import { Codifier } from '../../src/preprocess/codifier'

describe('Codifier', () => {
  test('Initialize codifier with vocabulary', () => {
    const codifier = Codifier.with(['this', 'is', 'a', 'test'], false, false)
    expect(codifier.vocabulary).toEqual(['this', 'is', 'a', 'test'])
  })

  test('Initialize codifier without vocabulary', () => {
    const codifier = Codifier.fit(
      [
        ['this', 'is', 'a', 'test'],
        ['i', 'want', 'this', 'car'],
      ],
      false,
      false
    )
    expect(codifier.vocabulary).toEqual([
      'this',
      'is',
      'a',
      'test',
      'i',
      'want',
      'car',
    ])
  })

  test('Initialize codifier with default tokens but no vocabulary', () => {
    const codifier = Codifier.fit(
      [
        ['this', 'is', 'a', 'test'],
        ['i', 'want', 'this', 'car'],
      ],
      false,
      false,
      ['default', 'words']
    )
    expect(codifier.vocabulary).toEqual([
      'default',
      'words',
      'this',
      'is',
      'a',
      'test',
      'i',
      'want',
      'car',
    ])
  })

  test('Encode: not unknown tokens allowed.', () => {
    const codifier = Codifier.with(
      ['this', 'want', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      false,
      false
    )
    expect(codifier.encode(['i', 'want', 'this', 't-shirt'])).toEqual([
      4,
      1,
      0,
      2,
    ])
    expect(() => {
      codifier.encode(['this', 'is', 'not', 'allowed'])
    }).toThrowError()
  })

  test('Encode: unknown tokens allowed.', () => {
    const codifier = Codifier.with(
      ['this', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      false,
      true
    )
    expect(codifier.encode(['i', 'want', 'this', 't-shirt'])).toEqual([
      4,
      0,
      1,
      2,
    ])
  })

  test('Encode: categorical encoding.', () => {
    const codifier = Codifier.with(['O', 'product', 'shop'], true, false)
    expect(codifier.encode(['O', 'O', 'shop', 'O', 'product'])).toEqual([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ])
    expect(() => {
      codifier.encode(['O', 'O', 'material', 'product'])
    }).toThrowError()
  })

  test('Decode: not unknown tokens allowed.', () => {
    const codifier = Codifier.with(
      ['this', 'want', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      false,
      false
    )
    expect(codifier.decode([4, 1, 0, 2])).toEqual([
      'i',
      'want',
      'this',
      't-shirt',
    ])
  })

  test('Decode: unknown tokens allowed.', () => {
    const codifier = Codifier.with(
      ['this', 'want', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      false,
      true
    )
    expect(codifier.decode([5, 2, 1, 3])).toEqual([
      'i',
      'want',
      'this',
      't-shirt',
    ])
  })

  test('Decode: categorical decoding.', () => {
    const codifier = Codifier.with(['O', 'product', 'shop'], true, false)
    expect(
      codifier.decode([
        [0.98, 0.2, 0],
        [0.99, 0.01, 0.01],
        [0.18, 0.02, 0.8],
      ])
    ).toEqual(['O', 'O', 'shop'])
  })
})
