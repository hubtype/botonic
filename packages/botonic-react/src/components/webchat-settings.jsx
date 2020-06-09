import React, { useContext } from 'react'
import { renderComponent, serializeRegexs } from '../utils'
import { WebchatContext } from '../contexts'

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
    const serializeRegexs = (_, value) => {
      if (value instanceof RegExp) return value.toString()
      return value
    }
    return (
      <message
        type={'webchat_settings'}
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
  if (persistentMenu) theme.persistentMenu = persistentMenu
  if (enableEmojiPicker) {
    if (!theme.userInput.enableEmojiPicker) theme.userInput.emojiPicker = {}
    theme.userInput.emojiPicker.enable = enableEmojiPicker
  }
  if (enableAttachments) {
    if (!theme.userInput.attachments) theme.userInput.attachments = {}
    theme.userInput.attachments.enable = enableAttachments
  }
  if (blockInputs) theme.userInput.blockInputs = blockInputs
  return theme
}
