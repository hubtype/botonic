import {
  DEFAULT_STOP_WORDS,
  Normalizer,
  StemmingBlackList,
  Locale
} from '../../src/nlp';

test('TEST: sut.normalize stopWord', () => {
  const sut = new Normalizer(undefined, { es: ['stopWórd'] });
  expect(sut.normalize('es', 'no digas STOPword').stems).toEqual(['no', 'dec']);
});

test('TEST: sut.normalize es', () => {
  const loc = 'es';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'áá').stems).toEqual(['aa']);
  expect(sut.normalize(loc, ',./ áé  íó(óÑ)  ;').stems).toEqual([
    'ae',
    'io',
    'on'
  ]);
  expect(
    sut.normalize(
      loc,
      'hola, hola!! pero realizar mi la un una de ya del pedido'
    ).stems
  ).toEqual(['realic', 'ped']);
});

test('TEST: sut.normalize ca', () => {
  const loc = 'ca';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'àí').stems).toEqual(['ai']);
  expect(sut.normalize(loc, ',./ àé  íò(óçÇ)  ;').stems).toEqual([
    'ae',
    'io',
    'oçç'
  ]);
  expect(
    sut.normalize(
      loc,
      'ho hi però guanyés la meva un una de ja de les comandes'
    ).stems
  ).toEqual(['guany', 'comand']);
});

test('TEST: sut.normalize en', () => {
  const loc = 'en';
  const sut = new Normalizer();
  expect(sut.normalize(loc, 'realizing tokenization').stems).toEqual([
    'realiz',
    'token'
  ]);
});

test.each<any>([['es'], ['ca'], ['en']])(
  'sut.normalize removes the stopwords for lang %s',
  (locale: Locale) => {
    const sut = new Normalizer();
    for (const stopWord of DEFAULT_STOP_WORDS[locale]) {
      const normalized = sut.normalize(locale, stopWord);
      expect(normalized.hasOnlyStopWords()).toEqual(true);
      expect(replaceI18nChars(stopWord, locale)).toStartWith(
        normalized.stems[0]
      );
      expect(sut.normalize(locale, stopWord + ' abcdex').stems).toEqual([
        'abcdex'
      ]);
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
  expect(normalized.stems).toEqual([
    'perro',
    'ey',
    'gat',
    'pipic',
    'adi',
    'perro',
    'perro'
  ]);
});

function replaceI18nChars(word: string, locale: string): string {
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
