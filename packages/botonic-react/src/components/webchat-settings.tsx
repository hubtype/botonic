import { INPUT } from '@botonic/core'
import React, { useContext } from 'react'

import { renderComponent } from '../util/react'
import { stringifyWithRegexs } from '../util/regexs'
import { WebchatContext } from '../webchat/context'
import {
  HandoffState,
  PersistentMenuOptionsTheme,
  ThemeProps,
} from '../webchat/theme/types'
import { BlockInputOption } from './index-types'

export interface WebchatSettingsProps {
  blockInputs?: BlockInputOption[]
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  persistentMenu?: PersistentMenuOptionsTheme
  theme?: ThemeProps
  handoffState?: Partial<HandoffState>
  user?: { extra_data?: any }
}

export const WebchatSettings = ({
  theme,
  handoffState,
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
      handoffState,
    })
    return (
      //@ts-ignore
      <message
        type={INPUT.WEBCHAT_SETTINGS}
        settings={stringifyWithRegexs({
          theme: updatedTheme,
          user,
          handoffState,
        })}
      />
    )
  }
  return renderComponent({ renderBrowser, renderNode })
}

export const normalizeWebchatSettings = (settings: WebchatSettingsProps) => {
  const {
    theme,
    blockInputs,
    persistentMenu,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    handoffState,
  } = settings

  // Normalize theme settings
  const normalizedTheme = theme || {}
  if (!normalizedTheme.userInput) {
    normalizedTheme.userInput = {}
  }
  if (!normalizedTheme.animations) {
    normalizedTheme.animations = {}
  }

  if (persistentMenu !== undefined) {
    normalizedTheme.userInput.persistentMenu = persistentMenu
  }
  if (enableEmojiPicker !== undefined) {
    if (!normalizedTheme.userInput.emojiPicker) {
      normalizedTheme.userInput.emojiPicker = {}
    }

    normalizedTheme.userInput.emojiPicker.enable = enableEmojiPicker
  }
  if (enableAttachments !== undefined) {
    if (!normalizedTheme.userInput.attachments) {
      normalizedTheme.userInput.attachments = {}
    }
    normalizedTheme.userInput.attachments.enable = enableAttachments
  }
  if (enableUserInput !== undefined) {
    normalizedTheme.userInput.enable = enableUserInput
  }
  if (blockInputs !== undefined) {
    normalizedTheme.userInput.blockInputs = blockInputs
  }
  if (enableAnimations !== undefined) {
    normalizedTheme.animations.enable = enableAnimations
  }

  return {
    updatedTheme: normalizedTheme,
    updatedHandoffState: handoffState,
  }
}
