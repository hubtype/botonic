import { DateRange } from '../../src/time';

test('TEST DateRange.contains', () => {
  const from = new Date();
  const sut = new DateRange('name', from, new Date(from.getTime() + 1000));

  expect(sut.contains(new Date(from.getTime() - 1))).toBe(false);
  expect(sut.contains(from)).toBe(true);
  expect(sut.contains(new Date(sut.to.getTime() - 1))).toBe(true);
  expect(sut.contains(sut.to)).toBe(false);
});
