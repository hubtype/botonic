import {
  deepClone,
  roughSizeOfObject,
  shallowClone,
} from '../../src/util/objects'

class Subclass {
  constructor(public field: number) {}
}
class Class {
  constructor(
    public arr = [3, 4],
    public sub = new Subclass(1)
  ) {}
}

test('TEST: shallowClone', () => {
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

test('TEST: deepClone', () => {
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

test('TEST: deepClone no recursive call', () => {
  const source = new RecursiveClass()
  source.rec = source

  // act
  const copy = deepClone(source)
  expect(copy).toEqual(source)
})

describe('roughSizeOfObject', () => {
  const repeatedObject = { '1': undefined }
  test.each([
    [true, 4],
    [42, 8],
    ['42', 2 * 2],
    [{ '42': 42 }, 8 + 2 * 2 + 8],
    [repeatedObject, 2 + 8],
    [{ '4': repeatedObject, '2': repeatedObject }, 2 * (8 + 2) + 10],
  ])('roughSizeOfObject(%j)=%d', (o: any, size: number) => {
    expect(roughSizeOfObject(o)).toBe(size)
  })
})
