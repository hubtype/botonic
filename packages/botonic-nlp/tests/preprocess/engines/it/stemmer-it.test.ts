import { StemmerIt } from '../../../../src/preprocess/engines/it/stemmer-it'

describe('Italian stemmer', () => {
  test('Stemming sentence', () => {
    const stemmer = new StemmerIt()
    expect(stemmer.stem(['parlando', 'pensiero'])).toEqual(['parl', 'pensier'])
  })
})
