/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'

import { Typing } from '../../src/index-types'
import {
  TYPING_OFF_DEBOUNCE_MS,
  TypingNetworkSender,
} from '../../src/webchat/input-panel/typing-network-sender'
import { useTypingChatEventSender } from '../../src/webchat/input-panel/use-typing-chat-event-sender'

jest.mock('uuid', () => ({
  v7: () => 'test-uuid',
}))

function createDispatchMock() {
  return jest.fn().mockResolvedValue(true)
}

function createContext(sessionId = 'user-1', lastRoutePath = 'route-a') {
  return {
    session: { user: { id: sessionId } },
    lastRoutePath,
  }
}

describe('TypingNetworkSender', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('sends typing_on only once for repeated on signals', async () => {
    const dispatch = createDispatchMock()
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    await sender.send(Typing.On)
    await sender.send(Typing.On)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(Typing.On, createContext())
  })

  it('does not mark the server as typing when sendToServer returns false', async () => {
    const dispatch = jest.fn().mockResolvedValue(false)
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    await sender.send(Typing.On)

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenCalledWith(Typing.On, createContext())
  })

  it('debounces typing_off by TYPING_OFF_DEBOUNCE_MS', async () => {
    const dispatch = createDispatchMock()
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    await sender.send(Typing.Off)

    expect(dispatch).toHaveBeenCalledTimes(1)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenLastCalledWith(Typing.Off, createContext())
  })

  it('uses the same session context for typing_on and typing_off', async () => {
    const dispatch = createDispatchMock()
    const sessionA = createContext('session-a', 'route-a')
    const sessionB = createContext('session-b', 'route-b')
    let currentContext = sessionA

    const sender = new TypingNetworkSender(() => currentContext, dispatch)

    await sender.send(Typing.On)
    currentContext = sessionB
    await sender.send(Typing.Off)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(dispatch.mock.calls).toEqual([
      [Typing.On, sessionA],
      [Typing.Off, sessionA],
    ])
  })

  it('allows a new typing_on after typing_off has been dispatched', async () => {
    const dispatch = createDispatchMock()
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    await sender.send(Typing.Off)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    await sender.send(Typing.On)

    expect(dispatch).toHaveBeenCalledTimes(3)
  })

  it('ignores typing_off when typing_on was never sent', async () => {
    const dispatch = createDispatchMock()
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.Off)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('sends typing_off immediately on dispose when user was typing', async () => {
    const dispatch = createDispatchMock()
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    sender.dispose()

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls).toEqual([
      [Typing.On, createContext()],
      [Typing.Off, createContext()],
    ])
  })

  it('resets typing state when typing_on delivery fails', async () => {
    const dispatch = jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    await sender.send(Typing.On)
    await sender.send(Typing.On)

    expect(dispatch).toHaveBeenCalledTimes(2)
  })

  it('coalesces concurrent typing_on requests into a single network call', async () => {
    let resolveSend
    const dispatch = jest.fn(
      () =>
        new Promise(resolve => {
          resolveSend = resolve
        })
    )
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    const first = sender.send(Typing.On)
    const second = sender.send(Typing.On)

    resolveSend(true)

    await expect(Promise.all([first, second])).resolves.toEqual([true, true])
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('sends typing_off immediately when dispose resolves a pending typing_on', async () => {
    let resolveSend
    const dispatch = jest.fn(
      () =>
        new Promise(resolve => {
          resolveSend = resolve
        })
    )
    const sender = new TypingNetworkSender(() => createContext(), dispatch)

    const pendingOn = sender.send(Typing.On)
    sender.dispose()

    await act(async () => {
      resolveSend(true)
      await pendingOn
    })

    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch.mock.calls).toEqual([
      [Typing.On, createContext()],
      [Typing.Off, createContext()],
    ])
  })
})

describe('useTypingChatEventSender', () => {
  const session = {
    user: { id: 'user-1' },
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('calls onUserInput with a chat event payload for typing_on', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useTypingChatEventSender({
        onUserInput,
        session,
        lastRoutePath: 'route-a',
      })
    )

    await act(async () => {
      await result.current(Typing.On)
    })

    expect(onUserInput).toHaveBeenCalledTimes(1)
    expect(onUserInput).toHaveBeenCalledWith({
      user: session.user,
      input: {
        id: 'test-uuid',
        type: 'chatevent',
        data: Typing.On,
      },
      session,
      lastRoutePath: 'route-a',
    })
  })

  it('retries typing_on after onUserInput becomes available', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { result, rerender } = renderHook(
      ({ handler }) =>
        useTypingChatEventSender({
          onUserInput: handler,
          session,
        }),
      { initialProps: { handler: undefined } }
    )

    await act(async () => {
      expect(await result.current(Typing.On)).toBe(false)
      expect(await result.current(Typing.On)).toBe(false)
    })

    expect(onUserInput).not.toHaveBeenCalled()

    rerender({ handler: onUserInput })

    await act(async () => {
      expect(await result.current(Typing.On)).toBe(true)
    })

    expect(onUserInput).toHaveBeenCalledTimes(1)
    expect(onUserInput.mock.calls[0][0].input.data).toBe(Typing.On)
  })

  it('does not mark typing as active when onUserInput rejects', async () => {
    const onUserInput = jest
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(undefined)
    const { result } = renderHook(() =>
      useTypingChatEventSender({
        onUserInput,
        session,
      })
    )

    await act(async () => {
      expect(await result.current(Typing.On)).toBe(false)
      expect(await result.current(Typing.On)).toBe(true)
    })

    expect(onUserInput).toHaveBeenCalledTimes(2)
  })

  it('debounces typing_off before calling onUserInput', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      useTypingChatEventSender({
        onUserInput,
        session,
      })
    )

    await act(async () => {
      await result.current(Typing.On)
      await result.current(Typing.Off)
    })

    expect(onUserInput).toHaveBeenCalledTimes(1)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(onUserInput).toHaveBeenCalledTimes(2)
    expect(onUserInput.mock.calls[1][0].input.data).toBe(Typing.Off)
  })

  it('sends typing_off immediately on unmount when user was typing', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { result, unmount } = renderHook(() =>
      useTypingChatEventSender({
        onUserInput,
        session,
      })
    )

    const sendTyping = result.current

    await act(async () => {
      await sendTyping(Typing.On)
    })

    unmount()

    expect(onUserInput).toHaveBeenCalledTimes(2)
    expect(onUserInput.mock.calls[1][0].input.data).toBe(Typing.Off)
  })

  it('keeps typing_off on the same session after session changes', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const sessionA = { user: { id: 'session-a' } }
    const sessionB = { user: { id: 'session-b' } }
    const { result, rerender } = renderHook(
      ({ currentSession, routePath }) =>
        useTypingChatEventSender({
          onUserInput,
          session: currentSession,
          lastRoutePath: routePath,
        }),
      {
        initialProps: {
          currentSession: sessionA,
          routePath: 'route-a',
        },
      }
    )

    const sendTyping = result.current

    await act(async () => {
      await sendTyping(Typing.On)
    })

    rerender({
      currentSession: sessionB,
      routePath: 'route-b',
    })

    await act(async () => {
      await sendTyping(Typing.Off)
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(onUserInput.mock.calls[0][0].session).toBe(sessionA)
    expect(onUserInput.mock.calls[0][0].lastRoutePath).toBe('route-a')
    expect(onUserInput.mock.calls[1][0].session).toBe(sessionA)
    expect(onUserInput.mock.calls[1][0].lastRoutePath).toBe('route-a')
  })
})
