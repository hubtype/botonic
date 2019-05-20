import { normalize } from '../../src/nlp';

test('TEST: normalize', () => {
  expect(normalize('áá')).toEqual(['aa']);
  expect(normalize(',./ áé  íó(úÑ)  ;')).toEqual(['ae', 'io', 'un']);
  expect(normalize('realizar pedido')).toEqual(['realiz', 'ped']);
});
