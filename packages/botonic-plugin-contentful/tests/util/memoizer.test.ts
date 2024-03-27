import {
  cacheForeverStrategy,
  fallbackStrategy,
  Memoizer,
} from '../../src/util/memoizer'

class MockF {
  callsFA = 0
  callsFB = 0
  error: Error | undefined
  salt = ''

  fA(a: number, b: string): Promise<string> {
    this.callsFA++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve('A' + String(a) + b + this.salt)
  }

  fB(a = 1, b = 'b'): Promise<string> {
    this.callsFB++
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve('B' + String(a) + b + this.salt)
  }
}

describe('Memoizer', () => {
  it('TEST: cacheForeverStrategy common properties', async () => {
    await assertCommonStrategyProperties(
      () => new Memoizer({ strategy: cacheForeverStrategy }),
      false
    )
  })
  it('TEST: cacheForeverStrategy only fails if last call failed', async () => {
    const sut = new Memoizer({ strategy: cacheForeverStrategy })
    const mock = new MockF()
    const memoized = sut.memoize(mock.fA.bind(mock))

    // act/assert
    mock.error = new Error('forced failure')
    await expect(memoized(2, 'b')).rejects.toThrow(mock.error)
    mock.error = undefined
    await expect(memoized(2, 'b')).resolves.toBe('A2b')
    expect(mock.callsFA).toBe(2)
  })

  function usingFallback(funcName: string, args: any[], e: any): Promise<void> {
    console.error(
      `Using fallback for ${funcName}(${String(args)}) after error: ${String(
        e
      )}`
    )
    return Promise.resolve()
  }

  it('TEST: fallbackStrategy common properties', async () => {
    await assertCommonStrategyProperties(
      () => new Memoizer({ strategy: fallbackStrategy(usingFallback) }),
      true
    )
  })

  it('TEST: fallbackStrategy uses last invocation result', async () => {
    const sut = new Memoizer({ strategy: fallbackStrategy(usingFallback) })
    const mock = new MockF()
    const memoized = sut.memoize(mock.fA.bind(mock))

    // act/assert
    await expect(memoized(2, 'b')).resolves.toBe('A2b')
    mock.salt = 'pepper'
    await expect(memoized(2, 'b')).resolves.toBe('A2b' + mock.salt)
    expect(mock.callsFA).toBe(2)
  })

  test('TEST: fallbackStrategy returns latest success return if function fails', async () => {
    const sut = new Memoizer({ strategy: fallbackStrategy(usingFallback) })
    const mock = new MockF()
    const memoized = sut.memoize(mock.fA.bind(mock))

    // arrange
    await memoized(2, 'b')
    mock.salt = 'pepper'
    await memoized(2, 'b')

    mock.error = new Error('forced failure')
    await memoized(2, 'b')

    // act
    mock.error = undefined
    await expect(memoized(2, 'b')).resolves.toBe('A2bpepper')
    expect(mock.callsFA).toBe(4)
  })
})

async function assertCommonStrategyProperties(
  sutFactory: () => Memoizer,
  expectReinvocation: boolean
) {
  await memoizerDoesNotMixUpDifferentFunctionsOrArguments(
    sutFactory(),
    expectReinvocation
  )
  await memoizerFailsIfAllPreviousInvocationsFailed(sutFactory())
  await memoizerWorksWithDefaultValueArgs(sutFactory(), expectReinvocation)
}

async function memoizerFailsIfAllPreviousInvocationsFailed(sut: Memoizer) {
  const mock = new MockF()
  const memoized = sut.memoize(mock.fA.bind(mock))

  // act/assert
  mock.error = new Error('forced failure')
  await expect(memoized(2, 'b')).rejects.toThrow(mock.error)
  await expect(memoized(2, 'b')).rejects.toThrow(mock.error)

  mock.error = undefined
  await expect(memoized(2, 'b')).resolves.toBe('A2b')
}

async function memoizerDoesNotMixUpDifferentFunctionsOrArguments(
  sut: Memoizer,
  expectReinvocation: boolean
) {
  const mock = new MockF()
  const memoizedA = sut.memoize(mock.fA.bind(mock))
  const memoizedB = sut.memoize(mock.fB.bind(mock))

  // act/assert
  await expect(memoizedA(2, 'b')).resolves.toBe('A2b')
  //same function, arguments
  await expect(memoizedA(2, 'b')).resolves.toBe('A2b')
  expect(mock.callsFA).toBe(expectReinvocation ? 2 : 1)

  //same function, different arguments
  await expect(memoizedA(2, 'c')).resolves.toBe('A2c')
  expect(mock.callsFA).toBe(expectReinvocation ? 3 : 2)

  //different function, same arguments
  await expect(memoizedB(2, 'b')).resolves.toBe('B2b')
  expect(mock.callsFB).toBe(expectReinvocation ? 1 : 1)
}

async function memoizerWorksWithDefaultValueArgs(
  sut: Memoizer,
  expectReinvocation: boolean
) {
  const mock = new MockF()
  const memoized = sut.memoize(mock.fB.bind(mock))

  // act/assert
  // All default arguments
  await expect(memoized()).resolves.toBe('B1b')
  await expect(memoized()).resolves.toBe('B1b')
  expect(mock.callsFB).toBe(expectReinvocation ? 2 : 1)

  // explicitly passing the default value
  await expect(memoized(1, 'b')).resolves.toBe('B1b')
  await expect(memoized(1, 'b')).resolves.toBe('B1b')
  expect(mock.callsFB).toBe(expectReinvocation ? 4 : 2)

  // 1 argument by default, 1 explicit
  await expect(memoized(4)).resolves.toBe('B4b')
  await expect(memoized(4)).resolves.toBe('B4b')
  expect(mock.callsFB).toBe(expectReinvocation ? 6 : 3)

  await expect(memoized(4, 'c')).resolves.toBe('B4c')
  await expect(memoized(4, 'c')).resolves.toBe('B4c')
  expect(mock.callsFB).toBe(expectReinvocation ? 8 : 4)
}
