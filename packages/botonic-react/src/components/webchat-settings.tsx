import { INPUT } from '@botonic/core'
import { useContext } from 'react'

import { renderComponent } from '../util/react'
import { stringifyWithRegexs } from '../util/regexs'
import { WebchatContext } from '../webchat/context'
import type {
  PersistentMenuOptionsTheme,
  WebchatTheme,
} from '../webchat/theme/types'
import type { BlockInputOption } from './index-types'

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
  if (!theme) {
    theme = {}
  }
  if (!theme.userInput) {
    theme.userInput = {}
  }
  if (persistentMenu !== undefined) {
    theme.userInput.persistentMenu = persistentMenu
  }
  if (enableEmojiPicker !== undefined) {
    if (!theme.userInput.emojiPicker) {
      theme.userInput.emojiPicker = {}
    }
    theme.userInput.emojiPicker.enable = enableEmojiPicker
  }
  if (enableAttachments !== undefined) {
    if (!theme.userInput.attachments) {
      theme.userInput.attachments = {}
    }
    theme.userInput.attachments.enable = enableAttachments
  }
  if (enableUserInput !== undefined) {
    theme.userInput.enable = enableUserInput
  }
  if (blockInputs !== undefined) {
    theme.userInput.blockInputs = blockInputs
  }

  if (!theme.animations) {
    theme.animations = {}
  }
  if (enableAnimations !== undefined) {
    theme.animations.enable = enableAnimations
  }
  return theme
}

export interface WebchatSettingsProps {
  blockInputs?: BlockInputOption[]
  enableAnimations?: boolean
  enableAttachments?: boolean
  enableEmojiPicker?: boolean
  enableUserInput?: boolean
  persistentMenu?: PersistentMenuOptionsTheme
  theme?: Partial<WebchatTheme>
  user?: {
    extra_data?: any
    country?: string
    locale?: string
    system_locale?: string
  }
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
    // biome-ignore lint/correctness/useHookAtTopLevel: WebchatSettings is a component that renders a webchat settings
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
      //@ts-expect-error
      <message
        type={INPUT.WEBCHAT_SETTINGS}
        settings={stringifyWithRegexs({ theme: updatedTheme, user })}
      />
    )
  }
  return renderComponent({ renderBrowser, renderNode })
}
