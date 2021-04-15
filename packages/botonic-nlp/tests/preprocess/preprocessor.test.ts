import {
  Preprocessor,
  SEQUENCE_POSITION,
} from '../../src/preprocess/preprocessor'

describe('Preprocessor with loaded engines', () => {
  const sut = new Preprocessor('en', 6)

  test('Preprocess', () => {
    expect(sut.preprocess('This is a test', '<PAD>')).toEqual([
      'a',
      'test',
      '<PAD>',
      '<PAD>',
      '<PAD>',
      '<PAD>',
    ])
  })

  test('Normalize', () => {
    expect(sut.normalize('This')).toEqual('this')
  })

  test('Tokenize', () => {
    expect(sut.tokenize('this is a test')).toEqual(['this', 'is', 'a', 'test'])
  })

  test('Stopwords removal', () => {
    expect(sut.removeStopwords(['this', 'is', 'a', 'test'])).toEqual([
      'a',
      'test',
    ])
  })

  test('Stem', () => {
    expect(sut.stem(['testing', 'stemmer'])).toEqual(['testing', 'stemmer'])
  })

  test('Pad', () => {
    expect(
      sut.pad(['This', 'is', 'a', 'test'], '<PAD>', SEQUENCE_POSITION.PRE)
    ).toEqual(['<PAD>', '<PAD>', 'This', 'is', 'a', 'test'])
    expect(
      sut.pad(['This', 'is', 'a', 'test'], '<PAD>', SEQUENCE_POSITION.POST)
    ).toEqual(['This', 'is', 'a', 'test', '<PAD>', '<PAD>'])
  })

  test('Truncate', () => {
    expect(
      sut.truncate(
        ['This', 'is', 'a', 'long', 'test', 'sentence', 'to', 'truncate'],
        SEQUENCE_POSITION.PRE
      )
    ).toEqual(['a', 'long', 'test', 'sentence', 'to', 'truncate'])
    expect(
      sut.truncate(
        ['This', 'is', 'a', 'long', 'test', 'sentence', 'to', 'truncate'],
        SEQUENCE_POSITION.POST
      )
    ).toEqual(['This', 'is', 'a', 'long', 'test', 'sentence'])
  })
})
