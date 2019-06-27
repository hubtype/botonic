import { Text } from '../../src/cms';
import { RndTextBuilder } from '../helpers/builders';
import { expectEqualExceptOneField } from '../helpers/expect';

test('TEST: cloneWithButtons copies all fields except buttons', () => {
  const builder = new RndTextBuilder();
  const t1 = builder.build();
  expect(t1).toBeInstanceOf(Text);

  const clone = t1.cloneWithButtons(t1.buttons.slice(1, 2));

  expect(clone).toBeInstanceOf(Text);
  expect(clone).not.toEqual(t1);
  expect(clone.buttons).toHaveLength(1);
  expect(t1.buttons).not.toHaveLength(1);
  expect(clone.buttons[0]).toBe(t1.buttons[1]);

  expectEqualExceptOneField(t1, clone, 'buttons');
});

test('TEST: cloneWithText copies all fields except text', () => {
  const builder = new RndTextBuilder();
  const t1 = builder.build();
  const oldText = t1.text;
  expect(t1).toBeInstanceOf(Text);

  const clone = t1.cloneWithText('modified text');

  expect(clone).toBeInstanceOf(Text);
  expect(clone).not.toEqual(t1);
  expect(t1.text).toEqual(oldText);

  expectEqualExceptOneField(t1, clone, 'text');
});
