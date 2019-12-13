import { TokenSkipper } from '../../src/nlp'

test('hack because webstorm does not recognize test.each', () => {})

test.each<any>([
  ['hola!!, como va?', 2, 'va?'],
  ['hola!!, como va?', 3, ''],
  [' hola.como', 1, 'como'],
])(
  'TEST: WordSkipper(%s, %d)=>%s',
  (haystack: string, skipWordsCount: number, expected: string) => {
    const sut = new TokenSkipper()
    const idx = sut.skipWords(haystack, skipWordsCount, true)
    expect(haystack.substr(idx)).toEqual(expected)
  }
)
