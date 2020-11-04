import React from 'react'
import { Webchat } from '../../src/webchat/webchat'
import { act } from 'react-test-renderer'
import { renderUseWebchatHook } from '../helpers/test-utils'
import { render, screen } from '@testing-library/react'
import { ROLES } from '../../src/constants'

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
    expect(screen.queryByRole(ROLES.TRIGGER_BUTTON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.STYLED_WEBCHAT)).toBeNull()
  })

  it('Opened webchat by default has StyledWebchat, Header, MessageList area, Textbox and SendButtonIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole(ROLES.STYLED_WEBCHAT)).toBeTruthy()
    expect(screen.queryByRole(ROLES.HEADER)).toBeTruthy()
    expect(screen.queryByRole(ROLES.MESSAGE_LIST)).toBeTruthy()
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeTruthy()
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeTruthy()
  })

  it('Opened webchat by default has no TriggerButton, PersistentMenuIcon, EmojiPickerIcon and AttachmentIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expect(screen.queryByRole(ROLES.TRIGGER_BUTTON)).toBeNull()
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeNull()
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
    expect(screen.queryByRole(ROLES.TYPING_INDICATOR)).toBeTruthy()
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
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeTruthy()
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeTruthy()
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
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER)).toBeTruthy()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeTruthy()
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
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU)).toBeTruthy()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeTruthy()
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
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeTruthy()
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeTruthy()
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
    expect(screen.queryByRole(ROLES.PERSISTENT_MENU_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.EMOJI_PICKER_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.SEND_BUTTON_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.ATTACHMENT_ICON)).toBeNull()
    expect(screen.queryByRole(ROLES.TEXT_BOX)).toBeNull()
  })
})
