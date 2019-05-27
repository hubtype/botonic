import { tokenizeAndStem } from '../../src/nlp';

test('TEST: normalize', () => {
  expect(tokenizeAndStem('áá')).toEqual(['aa']);
  expect(tokenizeAndStem(',./ áé  íó(óÑ)  ;')).toEqual(['ae', 'io', 'on']);
  expect(tokenizeAndStem('pero realizar mi la un una de ya del pedido')).toEqual(['realiz', 'ped']);
});
