import {
  DynamicSingletonMap,
  Singleton,
  SingletonMap,
} from '../../src/util/singletons'

test('TEST: Singleton', () => {
  let numInstances = 0

  class Clazz {
    constructor() {
      numInstances++
    }
  }

  const sut = new Singleton(() => new Clazz())
  expect(numInstances).toEqual(0)

  // act
  sut.value
  expect(numInstances).toEqual(1)

  //act
  sut.value
  expect(numInstances).toEqual(1)
})

test('TEST: SingletonMap', () => {
  class Clazz {}
  class Clazz1 extends Clazz {}
  class Clazz2 extends Clazz {}

  const sut = new SingletonMap<Clazz>({
    c1: () => new Clazz1(),
    c2: () => new Clazz2(),
  })

  // act
  const c1 = sut.value('c1')
  expect(c1).toBeInstanceOf(Clazz1)
  expect(sut.value('c1')).toBe(c1)

  const c2 = sut.value('c2')
  expect(c2).toBeInstanceOf(Clazz2)
})

test('TEST: DynamicSingletonMap', () => {
  class Clazz {}
  class Clazz1 extends Clazz {}
  class Clazz2 extends Clazz {}

  const sut = new DynamicSingletonMap<Clazz>(key => {
    switch (key) {
      case 'c1':
        return new Clazz1()
      case 'c2':
        return new Clazz2()
      default:
        throw new Error('unsupported')
    }
  })

  // act
  const c1 = sut.value('c1')
  expect(c1).toBeInstanceOf(Clazz1)
  expect(sut.value('c1')).toBe(c1)

  const c2 = sut.value('c2')
  expect(c2).toBeInstanceOf(Clazz2)
})
