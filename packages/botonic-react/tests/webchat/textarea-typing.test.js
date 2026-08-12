/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'

import { Typing } from '../../src/index-types'
import { useWebchat, WebchatContext } from '../../src/webchat/context'
import {
  Textarea,
  TYPING_IDLE_MS,
} from '../../src/webchat/input-panel/textarea'
import { TYPING_OFF_DEBOUNCE_MS } from '../../src/webchat/input-panel/typing-network-sender'
import { useTypingChatEventSender } from '../../src/webchat/input-panel/use-typing-chat-event-sender'

jest.mock('../../src/webchat/hooks/use-device-adapter', () => ({
  useDeviceAdapter: jest.fn(),
}))

function typeCharacter(textarea, value) {
  fireEvent.change(textarea, { target: { value } })
}

function renderTextarea({ onUserInput, sendTextResolver } = {}) {
  const sendChatEvent = jest.fn().mockResolvedValue(true)
  const sendTextAreaText = jest.fn().mockImplementation(
    () =>
      new Promise(resolve => {
        setTimeout(resolve, sendTextResolver?.delayMs ?? 0)
      })
  )
  const textareaRef = { current: undefined }
  const host = document.createElement('div')
  let webchatApi

  function Harness() {
    webchatApi = useWebchat()
    const hostRef = useRef(host)
    const sendTypingEvent = useTypingChatEventSender({
      onUserInput,
      session: webchatApi.webchatState.session,
      lastRoutePath: webchatApi.webchatState.lastRoutePath,
    })

    return (
      <WebchatContext.Provider value={webchatApi}>
        <Textarea
          host={hostRef.current}
          textareaRef={textareaRef}
          sendChatEvent={onUserInput ? sendTypingEvent : sendChatEvent}
          sendTextAreaText={sendTextAreaText}
        />
      </WebchatContext.Provider>
    )
  }

  const view = render(<Harness />)

  return {
    onUserInput,
    sendChatEvent,
    sendTextAreaText,
    getTextarea: () => screen.getByRole('textbox'),
    forceRerender: () => {
      act(() => {
        webchatApi.toggleEmojiPicker(!webchatApi.webchatState.isEmojiPickerOpen)
      })
    },
    unmount: view.unmount,
  }
}

describe('Textarea typing events', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('sends typing_on only once across multiple changes', async () => {
    const { sendChatEvent, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'h')
    })
    await act(async () => {
      typeCharacter(textarea, 'he')
    })
    await act(async () => {
      typeCharacter(textarea, 'hel')
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledWith(Typing.On)
  })

  it('does not send another typing_on after a context re-render', async () => {
    const { sendChatEvent, getTextarea, forceRerender } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'h')
    })
    forceRerender()
    await act(async () => {
      typeCharacter(textarea, 'he')
    })
    forceRerender()
    await act(async () => {
      typeCharacter(textarea, 'hel')
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledWith(Typing.On)
  })

  it('does not send typing_off when typing never started', async () => {
    const { sendChatEvent, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      fireEvent.blur(textarea)
    })

    expect(sendChatEvent).not.toHaveBeenCalled()
  })

  it('requests typing_off on blur after typing started', async () => {
    const { sendChatEvent, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
      fireEvent.blur(textarea)
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })

  it('requests typing_off when the input is cleared', async () => {
    const { sendChatEvent, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
      typeCharacter(textarea, '')
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })

  it('requests typing_off after the idle timeout expires', async () => {
    const { sendChatEvent, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })

    await act(async () => {
      jest.advanceTimersByTime(TYPING_IDLE_MS)
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })

  it('stops typing immediately on Enter even when sendTextAreaText is pending', async () => {
    const { sendChatEvent, sendTextAreaText, getTextarea } = renderTextarea({
      sendTextResolver: { delayMs: 100 },
    })
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    })

    expect(sendTextAreaText).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])

    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
  })

  it('keeps typing active when the user starts the next message before send completes', async () => {
    const { sendChatEvent, sendTextAreaText, getTextarea } = renderTextarea({
      sendTextResolver: { delayMs: 100 },
    })
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
      typeCharacter(textarea, 'next')
    })

    expect(sendTextAreaText).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledWith(Typing.On)

    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledWith(Typing.On)
  })

  it('stops typing when sendTextAreaText rejects', async () => {
    const sendTextAreaText = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new Error('send failed')).catch(() => undefined)
      )
    const sendChatEvent = jest.fn().mockResolvedValue(true)
    const textareaRef = { current: undefined }
    const host = document.createElement('div')
    let webchatApi

    function Harness() {
      webchatApi = useWebchat()

      return (
        <WebchatContext.Provider value={webchatApi}>
          <Textarea
            host={host}
            textareaRef={textareaRef}
            sendChatEvent={sendChatEvent}
            sendTextAreaText={sendTextAreaText}
          />
        </WebchatContext.Provider>
      )
    }

    render(<Harness />)
    const textarea = screen.getByRole('textbox')

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
    })

    expect(sendTextAreaText).toHaveBeenCalledTimes(1)
    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })

  it('does not send the message on Shift+Enter', async () => {
    const { sendTextAreaText, getTextarea } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
      fireEvent.change(textarea, { target: { value: 'hi\n' } })
    })

    expect(sendTextAreaText).not.toHaveBeenCalled()
  })

  it('requests typing_off when unmounted while typing', async () => {
    const { sendChatEvent, getTextarea, unmount } = renderTextarea()
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })
    unmount()

    await act(async () => {
      await Promise.resolve()
    })

    expect(sendChatEvent).toHaveBeenCalledTimes(2)
    expect(sendChatEvent.mock.calls).toEqual([[Typing.On], [Typing.Off]])
  })
})

describe('Textarea typing integration', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('delivers typing_on and debounced typing_off to onUserInput', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { getTextarea } = renderTextarea({ onUserInput })
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
      fireEvent.blur(textarea)
    })

    expect(onUserInput).toHaveBeenCalledTimes(1)
    expect(onUserInput.mock.calls[0][0].input.data).toBe(Typing.On)

    await act(async () => {
      jest.advanceTimersByTime(TYPING_OFF_DEBOUNCE_MS)
    })

    expect(onUserInput).toHaveBeenCalledTimes(2)
    expect(onUserInput.mock.calls[1][0].input.data).toBe(Typing.Off)
  })

  it('delivers typing_off immediately to onUserInput on unmount', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    const { getTextarea, unmount } = renderTextarea({ onUserInput })
    const textarea = getTextarea()

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })
    unmount()

    await act(async () => {
      await Promise.resolve()
    })

    expect(onUserInput).toHaveBeenCalledTimes(2)
    expect(onUserInput.mock.calls[1][0].input.data).toBe(Typing.Off)
  })

  it('retries typing_on from Textarea after onUserInput becomes available', async () => {
    const onUserInput = jest.fn().mockResolvedValue(undefined)
    let handler

    function Harness() {
      const webchatApi = useWebchat()
      const hostRef = useRef(document.createElement('div'))
      const textareaRef = { current: undefined }
      const sendTypingEvent = useTypingChatEventSender({
        onUserInput: handler,
        session: webchatApi.webchatState.session,
        lastRoutePath: webchatApi.webchatState.lastRoutePath,
      })

      return (
        <WebchatContext.Provider value={webchatApi}>
          <Textarea
            host={hostRef.current}
            textareaRef={textareaRef}
            sendChatEvent={sendTypingEvent}
            sendTextAreaText={jest.fn().mockResolvedValue(undefined)}
          />
        </WebchatContext.Provider>
      )
    }

    const view = render(<Harness />)
    const textarea = screen.getByRole('textbox')

    await act(async () => {
      typeCharacter(textarea, 'hi')
    })

    expect(onUserInput).not.toHaveBeenCalled()

    handler = onUserInput
    view.rerender(<Harness />)

    await act(async () => {
      typeCharacter(textarea, 'hello')
    })

    expect(onUserInput).toHaveBeenCalledTimes(1)
    expect(onUserInput.mock.calls[0][0].input.data).toBe(Typing.On)
  })
})
