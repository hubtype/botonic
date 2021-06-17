import { StemmerRu } from '../../../../src/preprocess/engines/ru/stemmer-ru'

describe('Russian stemmer', () => {
  test('Stemming sentence', () => {
    const stemmer = new StemmerRu()
    expect(stemmer.stem(['Говорящий', 'мысль'])).toEqual(['Говоря', 'мысл'])
  })
})
