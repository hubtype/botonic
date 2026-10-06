import type { Mock } from 'vitest'

export function getLastMockCallArg<T>(mock: Mock, index = 0): T {
  const call = mock.mock.lastCall
  if (!call) {
    throw new Error('Mock was not called')
  }
  return call[index] as T
}

export function getAllMockCallArgs<T>(mock: Mock, index = 0): T[] {
  return mock.mock.calls.map(call => call[index] as T)
}
