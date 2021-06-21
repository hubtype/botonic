import { StemmerDe } from '../../../../src/preprocess/engines/de/stemmer-de'

describe('Deutsch stemmer', () => {
  test('stemming sentence', () => {
    const stemmer = new StemmerDe()
    expect(stemmer.stem(['testen', 'denken'])).toEqual(['test', 'denk'])
  })
})
