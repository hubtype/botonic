import { vi } from 'vitest'

export const trackEventMock = vi.fn((_request, _eventAction, _args) => {
  return Promise.resolve()
})
