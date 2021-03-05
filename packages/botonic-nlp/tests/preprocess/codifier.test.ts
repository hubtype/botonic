import { Codifier } from '../../src/preprocess/codifier'

describe('Codifier', () => {
  test('Initialize codifier with vocabulary', () => {
    const codifier = new Codifier(['this', 'is', 'a', 'test'], {
      categorical: false,
    })
    expect(codifier.vocabulary).toEqual(['this', 'is', 'a', 'test'])
  })

  test('Unknown token error', () => {
    const codifier = new Codifier(['this', 'is', 'a', 'test'], {
      categorical: false,
    })
    expect(() => {
      codifier.encode(['throw', 'error'])
    }).toThrowError()
    expect(() => {
      codifier.decode([4, 5])
    }).toThrowError()
  })

  test('Encoding', () => {
    const codifier = new Codifier(
      ['this', 'want', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      {
        categorical: false,
      }
    )
    expect(codifier.encode(['i', 'want', 'this', 't-shirt'])).toEqual([
      4,
      1,
      0,
      2,
    ])
  })

  test('Categorical encoding', () => {
    const codifier = new Codifier(['O', 'product', 'shop'], {
      categorical: true,
    })
    expect(codifier.encode(['O', 'O', 'shop', 'O', 'product'])).toEqual([
      [1, 0, 0],
      [1, 0, 0],
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ])
  })

  test('Decoding', () => {
    const codifier = new Codifier(
      ['this', 'want', 't-shirt', 'is', 'i', 'the', 'given', 'vocabulary'],
      {
        categorical: false,
      }
    )
    expect(codifier.decode([4, 1, 0, 2])).toEqual([
      'i',
      'want',
      'this',
      't-shirt',
    ])
  })

  test('Categorical decoding', () => {
    const codifier = new Codifier(['O', 'product', 'shop'], {
      categorical: true,
    })
    expect(
      codifier.decode([
        [0.98, 0.2, 0],
        [0.99, 0.01, 0.01],
        [0.18, 0.02, 0.8],
      ])
    ).toEqual(['O', 'O', 'shop'])
  })
})
