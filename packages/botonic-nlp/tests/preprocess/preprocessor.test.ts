import { Preprocessor } from '../../src/preprocess/preprocessor'

describe('Preprocessor', () => {
  const preprocessor = new Preprocessor('ca', 6)

  test('Locale without engines implementations', () => {
    expect(preprocessor.engines).toEqual({})
  })
  test('Default normalize', () => {
    expect(preprocessor.normalize('testing')).toEqual('testing')
  })

  test('Default tokenize', () => {
    expect(preprocessor.tokenize('Split by space!')).toEqual([
      'Split',
      'by',
      'space!',
    ])
  })

  test('Default stopwords removal', () => {
    expect(
      preprocessor.removeStopwords(['I', 'am', 'testing', 'stopwords'])
    ).toEqual(['I', 'am', 'testing', 'stopwords'])
  })

  test('Default stem', () => {
    expect(preprocessor.stem(['Testing', 'stemmers'])).toEqual([
      'Testing',
      'stemmers',
    ])
  })

  test('Padding too short sequence', () => {
    expect(
      new Preprocessor('en', 6, 'pre').pad(
        ['I', 'need', 'some', 'padding'],
        '<PAD>'
      )
    ).toEqual(['<PAD>', '<PAD>', 'I', 'need', 'some', 'padding'])
    expect(
      new Preprocessor('en', 6, 'post').pad(
        ['I', 'need', 'some', 'padding'],
        '<PAD>'
      )
    ).toEqual(['I', 'need', 'some', 'padding', '<PAD>', '<PAD>'])
  })

  test('Padding too long sequence', () => {
    expect(
      new Preprocessor('en', 6, 'pre').pad(
        ['I', 'need', 'some', 'padding', 'for', 'this', 'sentence'],
        '<PAD>'
      )
    ).toEqual(['need', 'some', 'padding', 'for', 'this', 'sentence'])
    expect(
      new Preprocessor('en', 6, 'post').pad(
        ['I', 'need', 'some', 'padding', 'for', 'this', 'sentence'],
        '<PAD>'
      )
    ).toEqual(['I', 'need', 'some', 'padding', 'for', 'this'])
  })
})
