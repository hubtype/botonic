import {
  DEFAULT_STOP_WORDS,
  Normalizer,
  StemmingBlackList,
  Locale
} from '../../src/nlp';

test('TEST: sut.normalize stopWord', () => {
  const sut = new Normalizer(undefined, { es: ['stopWórd'] });
  expect(sut.normalize('es', 'no digas STOPword')).toEqual(['no', 'dig']);
});

test('TEST: sut.normalize es', () => {
  const loc = 'es';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'áá')).toEqual(['aa']);
  expect(sut.normalize(loc, ',./ áé  íó(óÑ)  ;')).toEqual(['ae', 'io', 'on']);
  expect(
    sut.normalize(
      loc,
      'hola, hola!! pero realizar mi la un una de ya del pedido'
    )
  ).toEqual(['realiz', 'ped']);
});

test('TEST: sut.normalize ca', () => {
  const loc = 'ca';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'àí')).toEqual(['ai']);
  expect(sut.normalize(loc, ',./ àé  íò(óçÇ)  ;')).toEqual(['ae', 'io', 'oçç']);
  expect(
    sut.normalize(
      loc,
      'ho hi però guanyés la meva un una de ja de les comandes'
    )
  ).toEqual(['guany', 'comand']);
});

test('TEST: sut.normalize en', () => {
  const loc = 'en';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'realizing tokenization')).toEqual([
    'realiz',
    'token'
  ]);
});

test.each<any>([['es'], ['ca'], ['en']])(
  'sut.normalize removes the stopwords for lang %s',
  (locale: Locale) => {
    const sut = new Normalizer();
    for (const stopWord of DEFAULT_STOP_WORDS[locale]) {
      // stopWord = naiveStemmer(stopWord, locale);
      expect(naiveStemmer(stopWord, locale)).toStartWith(
        sut.normalize(locale, stopWord)[0]
      );
      expect(sut.normalize(locale, stopWord + ' abcdex')).toEqual(['abcdex']);
    }
  }
);

test('TEST: Normalizer does not stem blacklisted tokens', () => {
  const sut = new Normalizer({
    es: [
      new StemmingBlackList('perro', ['perro', 'can', 'cán', 'canes']),
      new StemmingBlackList('ey', [])
    ]
  });
  const normalized = sut.normalize(
    'es',
    'perro. ey gato pipican adios cán canes'
  );
  expect(normalized).toEqual([
    'perro',
    'ey',
    'gat',
    'pipic',
    'adi',
    'perro',
    'perro'
  ]);
});

function naiveStemmer(word: string, locale: string): string {
  word = word
    .replace('á', 'a')
    .replace('à', 'a')
    .replace('ó', 'o')
    .replace('ò', 'o')
    .replace('í', 'i')
    .replace('ú', 'u')
    .replace('è', 'e')
    .replace('é', 'e');
  return word;
}
