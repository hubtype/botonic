import { normalize } from '../../src/nlp';

test('TEST: normalize', () => {
  expect(normalize('áá')).toEqual(['aa']);
  expect(normalize(',./ áé  íó(óÑ)  ;')).toEqual(['ae', 'io', 'on']);
  expect(normalize('pero realizar mi la un una de ya del pedido')).toEqual(['realiz', 'ped']);
});
