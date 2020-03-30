import { stemmerFor } from '../../src/nlp/stemmer'
import { Locale, SUPPORTED_LOCALES, tokenizerPerLocale } from '../../src/nlp'

test.each<any>([
  ['es', 'ponerse', ['pon']],
  ['es', 'quédate', ['quedat']], // node-nlp does not yet convert to "qued"
  ['es', 'comeré', ['com']],
  ['es', 'come', ['com']],
  ['es', 'realizando', ['realic']],
  ['es', 'realice', ['realic']],
  ['es', 'realicéis', ['realic']],
  ['es', 'compraría', ['compr']],
  ['es', 'compraba', ['compr']],
  ['en', "can't", ['ca', 'not']],
  ['en', 'wanna', ['want', 'to']],
  ['en', 'gonna', ['go', 'to']],

  ['pt', 'disse-me', ['diss', 'me']],

  ['pl', 'JeŚć', ['je']],
  ['ca', "adonar-se'n", ['adon', 'se', 'n']],
])(
  'TEST: stemmer removes final letters(%s) =>%j',
  (locale: string, raw: string, expected: string) => {
    const stemmer = stemmerFor(locale)
    const stemmed = stemmer.stem(tokenizerPerLocale(locale).tokenize(raw, true))
    expect(stemmed).toEqual(expected)
  }
)

describe('Stemmers', () => {
  test.each<any>(SUPPORTED_LOCALES)(
    "TEST numbers in words are kept for locale '%s'",
    (locale: Locale) => {
      const stemmer = stemmerFor(locale)
      for (const word of ['covid19', 'covid-19']) {
        const stemmed = stemmer.stem(
          tokenizerPerLocale(locale).tokenize(word, true)
        )
        expect(stemmed).toEqual([word])
      }
    }
  )
})
