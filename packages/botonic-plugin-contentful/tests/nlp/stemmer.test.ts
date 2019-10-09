import { stemmerFor } from '../../src/nlp/stemmer';

test('hack because webstorm does not recognize test.each', () => {});

test.each<any>([
  ['es', 'ponerse', ['pon']],
  ['es', 'quedate', ['quedat']], // node-nlp does not yet convert to "qued"
  ['es', 'comeré', ['comer']],
  ['es', 'come', ['com']],
  ['es', 'compraría', ['comprari']], // BUG in node-nlp: AggressiveTokenizerEs removes accents, but stemmer has them in its tables
  ['es', 'compraba', ['compr']],
  ['en', "can't", ['ca', 'not']],
  ['en', 'wanna', ['want', 'to']],
  ['en', 'gonna', ['go', 'to']],
  ['pt', 'disse-me', ['diss', 'me']]
  // not yet supported. TODO try with node-nlp autostemmer
  // ['es', 'ponme', ['pon', 'me']],
  // ['es', 'quédate', ['da', 'me']],
  // ['ca', "adonar-se'n", ['adon', 'se', 'en']] // we don't have AggressiveCatalanTokenizer
])('TEST: stemmer(%s) %j', (locale: string, raw: string, expected: string) => {
  const stemmer = stemmerFor(locale);
  const stemmed = stemmer.tokenizeAndStem(raw, true);
  expect(stemmed).toEqual(expected);
});
