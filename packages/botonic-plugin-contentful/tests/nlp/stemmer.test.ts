import { stemmerFor } from '../../src/nlp/stemmer'

test('hack because webstorm does not recognize test.each', () => {})

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
  // not yet supported. TODO try with node-nlp autostemmer
  // ['ca', "adonar-se'n", ['adon', 'se', 'en']] // we don't have AggressiveCatalanTokenizer
])(
  'TEST: stemmer removes final letters(%s) =>%j',
  (locale: string, raw: string, expected: string) => {
    const stemmer = stemmerFor(locale)
    const stemmed = stemmer.tokenizeAndStem(raw, true)
    expect(stemmed).toEqual(expected)
  }
)
