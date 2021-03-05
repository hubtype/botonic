import StemmerEs from '../../../../src/preprocess/engines/es/stemmer-es'

describe('English stemmer', () => {
  test.each([
    ['testeando', 'test'],
    ['reservado', 'reserv'],
    ['visualización', 'visualiz'],
  ])('stemming sentence', (raw: string, expected: string) => {
    const stemmer = new StemmerEs()
    expect(stemmer.stem(raw)).toEqual(expected)
  })
})
