/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */

import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { ROLES } from '../../src/constants'
import { Webchat } from '../../src/webchat/webchat'
import {
  expectNotToHaveRoles,
  expectToHaveRoles,
  renderUseWebchatHook,
} from '../helpers/test-utils'

describe('TEST: Webchat Component', () => {
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

  // To avoid TypeError: frame.scrollTo is not a function
  window.HTMLElement.prototype.scrollTo = function () {}

  it('TEST: Webchat by default has TriggerButton', async () => {
    const { result } = renderUseWebchatHook()
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles([ROLES.TRIGGER_BUTTON], screen)
    expectNotToHaveRoles([ROLES.WEBCHAT], screen)
  })

  it('TEST: Opened webchat by default has StyledWebchat, Header, MessageList area, Textbox and SendButtonIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [
        ROLES.WEBCHAT,
        ROLES.HEADER,
        ROLES.MESSAGE_LIST,
        ROLES.TEXT_BOX,
        ROLES.SEND_BUTTON_ICON,
      ],
      screen
    )
  })

  it('TEST: Opened webchat by default has no TriggerButton, PersistentMenuIcon, EmojiPickerIcon and AttachmentIcon', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectNotToHaveRoles(
      [
        ROLES.TRIGGER_BUTTON,
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.ATTACHMENT_ICON,
      ],
      screen
    )
  })

  it('TEST: Opened webchat has a TypingIndicator when typing is true', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTyping(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(['typing-indicator'], screen)
  })

  it('TEST: Opened webchat has EmojiPickerIcon, AttachmentsIcon and PersistentMenuIcon when they are enabled in the theme', async () => {
    const { result } = renderUseWebchatHook()
    Object.assign(theme, result.current.webchatState.theme)
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [
        ROLES.TEXT_BOX,
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.ATTACHMENT_ICON,
        ROLES.SEND_BUTTON_ICON,
      ],
      screen
    )
  })

  it.skip('TEST: Open EmojiPicker', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateTheme(theme)
      result.current.toggleEmojiPicker(true)
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [
        ROLES.TEXT_BOX,
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.EMOJI_PICKER,
        ROLES.ATTACHMENT_ICON,
        ROLES.SEND_BUTTON_ICON,
      ],
      screen
    )
  })

  it('TEST: Open PersistentMenu has PersistentMenuIcon, PersistentMenu, EmojiPickerIcon, AttachmentsIcon and SendButtonIcon', async () => {
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
    expectToHaveRoles(
      [
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.PERSISTENT_MENU,
        ROLES.ATTACHMENT_ICON,
        ROLES.SEND_BUTTON_ICON,
      ],
      screen
    )
  })

  it('TEST: Opened webchat has no SendButton if we disable it in the theme', async () => {
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
    expectToHaveRoles(
      [
        ROLES.TEXT_BOX,
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.ATTACHMENT_ICON,
      ],
      screen
    )
    expectNotToHaveRoles([ROLES.SEND_BUTTON_ICON], screen)
  })

  it('TEST: If the UserInput is disabled opened webchat has no PersistentMenuIcon, EmojiPickerIcon, AttachmentIcon, SendButtonIcon and Textbox', async () => {
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
    expectNotToHaveRoles(
      [
        ROLES.PERSISTENT_MENU_ICON,
        ROLES.EMOJI_PICKER_ICON,
        ROLES.ATTACHMENT_ICON,
        ROLES.SEND_BUTTON_ICON,
        ROLES.TEXT_BOX,
      ],
      screen
    )
  })

  it('TEST: When calling updateWebview a webview is displayed and has StyledWebview and StyledWebviewHeader', async () => {
    const { result } = renderUseWebchatHook()
    act(() => {
      result.current.toggleWebchat(true)
      result.current.updateWebview('webview')
    })
    await act(async () => {
      render(<Webchat webchatHooks={result.current} />)
    })
    expectToHaveRoles(
      [ROLES.WEBVIEW, ROLES.WEBVIEW_HEADER, ROLES.WEBCHAT],
      screen
    )
  })
})
