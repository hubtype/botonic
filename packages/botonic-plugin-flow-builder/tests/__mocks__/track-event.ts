import { jest } from '@jest/globals'

export const trackEventMock = jest.fn((_request, _eventAction, _args) => {
  return Promise.resolve()
})
