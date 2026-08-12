/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'

import { Typing } from '../../src/index-types'
import { useTypingSession } from '../../src/webchat/input-panel/use-typing-session'

function createSendChatEventMock() {
  let resolveOn
  const sendChatEvent = jest.fn(
    () =>
      new Promise(resolve => {
        resolveOn = resolve
      })
  )

  return {
    sendChatEvent,
    resolveOn: value => resolveOn(value),
  }
}

describe('useTypingSession', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not send typing_off after clear and retype while typing_on is pending', async () => {
    const { sendChatEvent, resolveOn } = createSendChatEventMock()
    const { result } = renderHook(() => useTypingSession(sendChatEvent))

    act(() => {
      void result.current.onTextChange('a')
    })

    act(() => {
      void result.current.onTextChange('')
    })

    act(() => {
      void result.current.onTextChange('b')
    })

    await act(async () => {
      resolveOn(true)
      await Promise.resolve()
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledWith(Typing.On)
  })

  it('sends typing_off after clear when typing_on was already delivered', async () => {
    const sendChatEvent = jest.fn().mockResolvedValue(true)
    const { result } = renderHook(() => useTypingSession(sendChatEvent))

    await act(async () => {
      await result.current.onTextChange('a')
      await result.current.onTextChange('')
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })
})
