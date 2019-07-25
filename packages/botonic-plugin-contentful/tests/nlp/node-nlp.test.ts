import { Locale, tokenizeAndStem } from '../../src/nlp';
import { DEFAULT_STOP_WORDS } from '../../src/nlp/node-nlp';

test('TEST: normalize es', () => {
  const loc = 'es';
  expect(tokenizeAndStem(loc, 'áá')).toEqual(['aa']);
  expect(tokenizeAndStem(loc, ',./ áé  íó(óÑ)  ;')).toEqual(['ae', 'io', 'on']);
  expect(
    tokenizeAndStem(loc, 'pero realizar mi la un una de ya del pedido')
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
  'tokenizeAndStem(%s)',
  (locale: Locale) => {
    for (const stopWord of DEFAULT_STOP_WORDS[locale]) {
      expect(tokenizeAndStem(locale, stopWord)).toEqual([]);
    }
  }
);
