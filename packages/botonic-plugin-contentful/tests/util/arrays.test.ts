import { andArrays } from '../../src/util/arrays'

class Base {}
class Derive extends Base {}
test('andArrays numbers', () => {
  expect(andArrays([6, 4, 5], [2, 4, 6])).toEqual([6, 4])
})

test('andArrays derived class', () => {
  const b = new Base()
  const d = new Derive()

  const res: Derive[] = andArrays([d], [d, b])
  expect(res).toEqual([d])

  const res2: Base[] = andArrays([d, b], [d])
  expect(res2).toEqual([d])
})
