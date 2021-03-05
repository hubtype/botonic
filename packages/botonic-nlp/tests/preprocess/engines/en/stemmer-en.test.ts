import StemmerEn from '../../../../src/preprocess/engines/en/stemmer-en'

describe('English stemmer', () => {
  test.each([
    ['testing', 'test'],
    ['booked', 'book'],
  ])('stemming sentence', (raw: string, expected: string) => {
    const stemmer = new StemmerEn()
    expect(stemmer.stem(raw)).toEqual(expected)
  })
})
