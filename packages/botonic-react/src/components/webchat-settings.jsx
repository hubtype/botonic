import React, { useContext } from 'react'
import { renderComponent, stringifyWithRegexs } from '../utils'
import { WebchatContext } from '../contexts'
import { INPUT } from '@botonic/core'

export const WebchatSettings = ({
  theme,
  blockInputs,
  persistentMenu,
  enableEmojiPicker,
  enableAttachments,
  enableUserInput,
  enableAnimations,
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
      enableUserInput,
      enableAnimations,
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
      enableUserInput,
      enableAnimations,
    })
    return (
      <message
        type={INPUT.WEBCHAT_SETTINGS}
        settings={stringifyWithRegexs({ theme: updatedTheme })}
      ></message>
    )
  }
  return renderComponent({ renderBrowser, renderNode })
}

export const normalizeWebchatSettings = settings => {
  let {
    theme,
    blockInputs,
    persistentMenu,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
  } = settings
  if (!theme) theme = {}
  if (!theme.userInput) theme.userInput = {}
  if (!theme.animations) theme.animations = {}
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
  if (enableUserInput !== undefined) {
    if (!theme.userInput.enable) theme.userInput.enable = {}
    theme.userInput.enable = enableUserInput
  }
  if (enableAnimations !== undefined) {
    if (!theme.animations.enable) theme.animations.enable = {}
    theme.animations.enable = enableAnimations
  }
  if (blockInputs !== undefined) theme.userInput.blockInputs = blockInputs
  return theme
}
