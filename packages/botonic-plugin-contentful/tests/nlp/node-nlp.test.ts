import { tokenizeAndStem } from '../../src/nlp';

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
    'oçÇ'
  ]);
  expect(
    tokenizeAndStem(loc, 'però realitzar la meva un una de ja de les comandes')
  ).toEqual(['realitz', 'comand']);
});

test('TEST: normalize en', () => {
  const loc = 'en';
  expect(tokenizeAndStem(loc, 'realizing tokenization')).toEqual([
    'realiz',
    'token'
  ]);
});
