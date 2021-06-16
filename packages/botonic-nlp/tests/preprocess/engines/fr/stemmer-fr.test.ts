import { StemmerFr } from '../../../../src/preprocess/engines/fr/stemmer-fr'

describe('French stemmer', () => {
  test('stemming sentence', () => {
    const stemmer = new StemmerFr()
    expect(stemmer.stem(['parlant', 'pensée'])).toEqual(['parl', 'pens'])
  })
})
