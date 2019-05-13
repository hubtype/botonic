import { normalize, substringIsBlankSeparated } from '../../src/nlp/tokens';
import 'jest-extended';

test('TEST: substringIsBlankSeparated', () => {
  expect(substringIsBlankSeparated('k w1 start sentence', 'k w1')).toBeTrue();
  expect(substringIsBlankSeparated('end sentence k w1', 'k w1')).toBeTrue();
  expect(substringIsBlankSeparated('middle k w1 sentence', 'k w1')).toBeTrue();

  expect(substringIsBlankSeparated('Xk w1 left', 'k w1')).toBeFalse();
  expect(substringIsBlankSeparated('right k w1X', 'k w1')).toBeFalse();

  expect(substringIsBlankSeparated('not found', 'k w1')).toBeFalse();
  expect(substringIsBlankSeparated('partial w1', 'k w1')).toBeFalse();
});

test('TEST: normalize', () => {
  expect(normalize('áá')).toEqual('aa');
  expect(normalize(',./ áé  íó(úÑ)  ;')).toEqual('ae io uñ');
});
