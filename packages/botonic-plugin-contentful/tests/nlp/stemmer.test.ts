import { Locale, SUPPORTED_LOCALES, tokenizerPerLocale } from '../../src/nlp'
import { stemmerFor } from '../../src/nlp/stemmer'

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
  ['pl', 'gwiazd-o-zbiór', ['gwiazd-o-zbior']],
  ['ca', "adonar-se'n", ['adon', 'se', 'n']],
  ['ru', 'автомобилей', ['автомобил']],
  ['tr', 'onlar uyudum', ['on', 'uyudu']],
  ['it', 'questi', ['quest']],
  ['fr', 'comprends', ['comprend']],
  ['ro', 'Bună', ['bun']],
  ['ro', 'dimineaţa', ['dimin']],
  ['el', 'Γραφή', ['γραφ']],
  ['el', 'ομιλία', ['ομιλ']],
  ['cs', 'mluvící', ['mluvic']],
  ['cs', 'psaní', ['psan']],
  ['uk', 'розмовляючи', ['розмовляюч']],
  ['hr', 'pjevati', ['pjeva']],
  ['hr', 'Slušajte', ['slusa']],
  ['sk', 'základních', ['zakladn']],
  ['sk', 'európskej', ['europsk']],
  ['sl', 'Evropski', ['evrop']],
  ['sl', 'hoditi', ['hodit']],
  ['hu', 'Európai', ['europ']],
  ['hu', 'érvelni', ['erveln']],
  ['nl', 'beklimmen', ['beklimm']],
  ['nl', 'rennen', ['renn']],
  ['bg', 'ходене', ['ход']],
  ['bg', 'бюро', ['бюр']],
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
    "numbers in words are kept for locale '%s'",
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
