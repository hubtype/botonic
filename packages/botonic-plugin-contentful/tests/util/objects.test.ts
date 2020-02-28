import { deepClone, shallowClone } from '../../src/util/objects'

class Subclass {
  constructor(public field: number) {}
}
class Class {
  constructor(public arr = [3, 4], public sub = new Subclass(1)) {}
}

test('TEST: shallowClone', async () => {
  const source = new Class()

  // act
  const copy = shallowClone(source)

  // assert
  expect(copy).toEqual(source)
  expect(copy).not.toBe(source)

  source.sub = new Subclass(2)
  expect(copy).not.toEqual(source)

  copy.sub.field = 3
  expect(source.sub.field).toEqual(2)
})

test('TEST: deepClone', async () => {
  const source = new Class()

  // act
  const copy = deepClone(source)

  // assert
  expect(copy).toEqual(source)
  expect(copy).not.toBe(source)

  source.sub = new Subclass(2)
  expect(copy).not.toEqual(source)

  copy.sub.field = 3
  expect(source.sub.field).not.toEqual(3)
})

class RecursiveClass {
  constructor(public rec?: RecursiveClass) {}
}

test('TEST: deepClone no recursive call', async () => {
  const source = new RecursiveClass()
  source.rec = source

  // act
  const copy = deepClone(source)
  expect(copy).toEqual(source)
})
