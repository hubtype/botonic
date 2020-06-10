import React, { useContext } from 'react'
import { renderComponent, serializeRegexs } from '../utils'
import { WebchatContext } from '../contexts'
import { INPUT } from '@botonic/core'

export const WebchatSettings = ({
  theme,
  blockInputs,
  persistentMenu,
  enableEmojiPicker,
  enableAttachments,
}) => {
  const renderBrowser = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { updateWebchatDevSettings } = useContext(WebchatContext)
    updateWebchatDevSettings({
      theme,
      blockInputs,
      persistentMenu,
      enableEmojiPicker,
      enableAttachments,
    })
    return null
  }
  const renderNode = () => {
    const updatedTheme = normalizeWebchatSettings({
      theme,
      blockInputs,
      persistentMenu,
      enableEmojiPicker,
      enableAttachments,
    })
    return (
      <message
        type={INPUT.WEBCHAT_SETTINGS}
        settings={JSON.stringify({ theme: updatedTheme }, serializeRegexs)}
      ></message>
    )
  }
  return renderComponent({ renderBrowser, renderNode })
}

export const normalizeWebchatSettings = settings => {
  const {
    theme,
    blockInputs,
    persistentMenu,
    enableEmojiPicker,
    enableAttachments,
  } = settings
  if (!theme.userInput) theme.userInput = {}
  if (persistentMenu !== undefined) {
    if (!theme.userInput.persistentMenu) theme.userInput.persistentMenu = {}
    theme.userInput.persistentMenu = persistentMenu
  }
  if (enableEmojiPicker !== undefined) {
    if (!theme.userInput.emojiPicker) theme.userInput.emojiPicker = {}
    theme.userInput.emojiPicker.enable = enableEmojiPicker
  }
  if (enableAttachments !== undefined) {
    if (!theme.userInput.attachments) theme.userInput.attachments = {}
    theme.userInput.attachments.enable = enableAttachments
  }
  if (blockInputs !== undefined) theme.userInput.blockInputs = blockInputs
  return theme
}
