import { INPUT } from '@botonic/core'
import React, { useContext } from 'react'

import { renderComponent } from '../util/react'
import { stringifyWithRegexs } from '../util/regexs'
import { WebchatContext } from '../webchat/context'
import { PersistentMenuOptionsTheme, ThemeProps } from '../webchat/theme/types'
import { BlockInputOption } from './index-types'

export interface WebchatSettingsProps {
  blockInputs?: BlockInputOption[]
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  persistentMenu?: PersistentMenuOptionsTheme
  theme?: ThemeProps
  user?: { extra_data?: any }
}

export const WebchatSettings = ({
  theme,
  blockInputs,
  persistentMenu,
  enableEmojiPicker,
  enableAttachments,
  enableUserInput,
  enableAnimations,
  user,
}: WebchatSettingsProps) => {
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
      //@ts-ignore
      <message
        type={INPUT.WEBCHAT_SETTINGS}
        settings={stringifyWithRegexs({ theme: updatedTheme, user })}
      />
    )
  }
  return renderComponent({ renderBrowser, renderNode })
}

export const normalizeWebchatSettings = (settings: WebchatSettingsProps) => {
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
  if (persistentMenu !== undefined) {
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
    theme.userInput.enable = enableUserInput
  }
  if (blockInputs !== undefined) theme.userInput.blockInputs = blockInputs

  if (!theme.animations) theme.animations = {}
  if (enableAnimations !== undefined) {
    theme.animations.enable = enableAnimations
  }
  return theme
}
