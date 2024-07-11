import { jest } from '@jest/globals'

// import { TrackEventFunction } from '../../src/types'

export const trackEventMock = jest.fn((_request, _eventAction, _args) => {
  console.log('trackEventMock called', {
    request: _request,
    eventAction: _eventAction,
    args: _args,
  })
  return Promise.resolve()
})
