import { StemmerEn } from '../../../../src/preprocess/engines/en/stemmer-en'

describe('English stemmer', () => {
  test('stemming sentence', () => {
    const stemmer = new StemmerEn()
    expect(stemmer.stem(['testing', 'booked'])).toEqual(['test', 'book'])
  })
})
