import { roughSizeOfObject } from '../../src'
import {
  Cache,
  InMemoryCache,
  LimitedCacheDecorator,
} from '../../src/util/cache'

describe('InMemoryCache', () => {
  it('TEST: common functions', () => {
    const sut = new InMemoryCache<string>()
    testAllCacheMethod(sut)
  })
})

describe('LimitedCacheDecorator', () => {
  it('TEST: common functions', () => {
    const sut = new LimitedCacheDecorator(new InMemoryCache<string>(), 1)
    testAllCacheMethod(sut)
  })

  it('TEST: removes 2 items if it does not fit', () => {
    const sut = new LimitedCacheDecorator(new InMemoryCache<string>(), 8 / 1024)
    sut.set('1', '1')
    sut.set('2', '2')
    expect(sut.size()).toBe((2 * (2 + 2)) / 1024)

    // act
    sut.set('33', '33')

    // arrange
    expect(sut.size()).toBe((4 + 4) / 1024)
    expect(Array.from(sut.keys())).toEqual(['33'])
  })

  it('TEST: does not add it if it does not fit', () => {
    const sut = new LimitedCacheDecorator(new InMemoryCache<string>(), 4 / 1024)
    sut.set('1', '1')

    // act
    sut.set('22', '22')

    // arrange
    expect(sut.size()).toBe(0)
  })
})

function testAllCacheMethod(sut: Cache<string>) {
  sut.set('k1', '1')
  sut.set('k2', '12')
  sut.set('k3', '123')
  sut.del('k3')

  // act
  expect(sut.get('k2')).toEqual('12')

  expect(sut.has('k3')).toEqual(false)

  expect(Array.from(sut.keys())).toEqual(['k1', 'k2'])

  expect(sut.size()).toBe(
    (roughSizeOfObject('k1') +
      roughSizeOfObject('1') +
      roughSizeOfObject('k2') +
      roughSizeOfObject('12')) /
      1024
  )
}
