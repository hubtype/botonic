import { RndTextBuilder } from '../helpers/builders';
import { expectEqualExceptOneField } from '../helpers/expect';

test('TEST: cloneWithoutButtonsThat copies all fields except buttons', () => {
  const builder = new RndTextBuilder();
  const t1 = builder.build();

  const clone = t1.cloneWithFilteredButtons(b => b === t1.buttons[1]);

  expect(clone).not.toEqual(t1);
  expect(clone.buttons).toHaveLength(1);
  expect(clone.buttons[0]).toBe(t1.buttons[1]);

  expectEqualExceptOneField(t1, clone, 'buttons');
});
