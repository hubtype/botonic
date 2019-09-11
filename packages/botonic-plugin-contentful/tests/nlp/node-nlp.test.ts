import { Locale, tokenizeAndStem } from '../../src/nlp';
import { DEFAULT_STOP_WORDS, StemmerEscaper } from '../../src/nlp/node-nlp';

test('TEST: normalize es', () => {
  const loc = 'es';
  expect(tokenizeAndStem(loc, 'áá')).toEqual(['aa']);
  expect(tokenizeAndStem(loc, ',./ áé  íó(óÑ)  ;')).toEqual(['ae', 'io', 'on']);
  expect(
    tokenizeAndStem(
      loc,
      'hola, hola!! pero realizar mi la un una de ya del pedido'
    )
  ).toEqual(['realiz', 'ped']);
});

test('TEST: normalize ca', () => {
  const loc = 'ca';
  expect(tokenizeAndStem(loc, 'àí')).toEqual(['ai']);
  expect(tokenizeAndStem(loc, ',./ àé  íò(óçÇ)  ;')).toEqual([
    'ae',
    'io',
    'oçç'
  ]);
  expect(
    tokenizeAndStem(
      loc,
      'ho hi però guanyés la meva un una de ja de les comandes'
    )
  ).toEqual(['guany', 'comand']);
});

test('TEST: normalize en', () => {
  const loc = 'en';
  expect(tokenizeAndStem(loc, 'realizing tokenization')).toEqual([
    'realiz',
    'token'
  ]);
});

test.each<any>([['es'], ['ca'], ['en']])(
  'tokenizeAndStem stopwords for %s',
  (locale: Locale) => {
    for (let stopWord of DEFAULT_STOP_WORDS[locale]) {
      stopWord = naiveStemmer(stopWord, locale);
      expect(stopWord).toStartWith(tokenizeAndStem(locale, stopWord)[0]);
      expect(tokenizeAndStem(locale, stopWord + ' abcdex')).toEqual(['abcdex']);
    }
  }
);

test('TEST: StemmerEscaper', () => {
  const sut = new StemmerEscaper([['perro', 'can', 'cán', 'canes']]);
  const escaped = sut.escape('perro. gato pipican adios cán canes');
  const stemmed = tokenizeAndStem('es', escaped);
  const unescaped = stemmed.map(stem => sut.unescape(stem));
  expect(unescaped).toEqual(['perro', 'gat', 'pipic', 'adi', 'perro', 'perro']);
});

function naiveStemmer(word: string, locale: string): string {
  word = word
    .replace('á', 'a')
    .replace('ò', 'o')
    .replace('í', 'i')
    .replace('ú', 'u')
    .replace('è', 'e')
    .replace('é', 'e')
    .replace('during', 'dure');
  if (locale == 'en' && word.length > 2) {
    word = word.replace(/y$/, 'i');
  }
  return word;
}
