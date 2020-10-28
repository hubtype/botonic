import React from 'react'
import { Webchat } from '../../src/webchat/webchat'
import { act } from 'react-test-renderer'
import { renderUseWebchatHook } from '../helpers/test-utils'
import { render, screen } from '@testing-library/react'

describe('TEST: webchat component', () => {
  const theme = {
    persistentMenu: [
      { label: 'Help', payload: 'help' },
      {
        label: 'See docs',
        url: 'https://docs.botonic.io',
      },
      { closeLabel: 'Close' },
    ],
    enableEmojiPicker: true,
    enableAttachments: true,
  }

  window.HTMLElement.prototype.scrollTo = function () {}

  it('Webchat by default has TriggerButton', async () => {
    const { result } = renderUseWebchatHook()
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('trigger-button')).toBeTruthy()
    expect(screen.queryByRole('styled-webchat')).toBeNull()
  })

  it('Opened webchat by default has StyledWebchat, Header, MessageList area, Textbox and SendButtonIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('styled-webchat')).toBeTruthy()
    expect(screen.queryByRole('header')).toBeTruthy()
    expect(screen.queryByRole('message-list')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeTruthy()
    expect(screen.queryByRole('send-button-icon')).toBeTruthy()
  })

  it('Opened webchat by default has no TriggerButton, PersistentMenuIcon, EmojiPickerIcon and AttachmentIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('trigger-button')).toBeNull()
    expect(screen.queryByRole('persistent-menu-icon')).toBeNull()
    expect(screen.queryByRole('emoji-picker-icon')).toBeNull()
    expect(screen.queryByRole('attachment-icon')).toBeNull()
  })

  it('Opened webchat has a TypingIndicator when typing is true', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTyping(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('typing-indicator')).toBeTruthy()
  })

  it('Opened webchat has EmojiPicker, Attachments and PersistentMenu when they are enabled in the theme', async () => {
    const { result } = renderUseWebchatHook()
    Object.assign(theme, result.current.webchatState.theme)
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('textbox')).toBeTruthy()
    expect(screen.queryByRole('persistent-menu-icon')).toBeTruthy()
    expect(screen.queryByRole('emoji-picker-icon')).toBeTruthy()
    expect(screen.queryByRole('attachment-icon')).toBeTruthy()
    expect(screen.queryByRole('send-button-icon')).toBeTruthy()
  })

  it.skip('Open EmojiPicker', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
      result.current.toggleEmojiPicker(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('persistent-menu-icon')).toBeTruthy()
    expect(screen.queryByRole('emoji-picker-icon')).toBeTruthy()
    expect(screen.queryByRole('emoji-picker')).toBeTruthy()
    expect(screen.queryByRole('attachment-icon')).toBeTruthy()
    expect(screen.queryByRole('send-button-icon')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeTruthy()
  })

  it.skip('Open PersistentMenu', async () => {
    const { result } = renderUseWebchatHook()
    Object.assign(theme, result.current.webchatState.theme)
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
      result.current.togglePersistentMenu(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('persistent-menu-icon')).toBeTruthy()
    expect(screen.queryByRole('emoji-picker-icon')).toBeTruthy()
    expect(screen.queryByRole('persistent-menu')).toBeTruthy()
    expect(screen.queryByRole('attachment-icon')).toBeTruthy()
    expect(screen.queryByRole('send-button-icon')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeTruthy()
  })

  it('Opened webchat has no SendButton if we disable it in the theme', async () => {
    const { result } = renderUseWebchatHook()
    Object.assign(theme, result.current.webchatState.theme)
    theme.enableSendButton = false
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('send-button-icon')).toBeNull()
    expect(screen.queryByRole('persistent-menu-icon')).toBeTruthy()
    expect(screen.queryByRole('emoji-picker-icon')).toBeTruthy()
    expect(screen.queryByRole('attachment-icon')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeTruthy()
  })

  it('If the UserInput is disabled opened webchat has no PersistentMenuIcon, EmojiPickerIcon, AttachmentIcon, SendButtonIcon and Textbox', async () => {
    const { result } = renderUseWebchatHook()
    Object.assign(theme, result.current.webchatState.theme)
    theme.enableSendButton = true
    theme.enableUserInput = false
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole('persistent-menu-icon')).toBeNull()
    expect(screen.queryByRole('emoji-picker-icon')).toBeNull()
    expect(screen.queryByRole('send-button-icon')).toBeNull()
    expect(screen.queryByRole('attachment-icon')).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
  })
})
