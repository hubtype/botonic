import React, { useContext } from 'react'

import LogoEmoji from '../../assets/emojiButton.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface EmojiPickerProps {
  enableEmojiPicker?: boolean
  onClick: () => void
}

export const EmojiPicker = ({
  enableEmojiPicker,
  onClick,
}: EmojiPickerProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const CustomEmojiPicker = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customEmojiPicker,
    undefined
  )

  const isEmojiPickerEnabled = () => {
    const hasCustomEmojiPicker = !!CustomEmojiPicker
    return (
      getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.enableEmojiPicker,
        enableEmojiPicker
      ) ?? hasCustomEmojiPicker
    )
  }
  const emojiPickerEnabled = isEmojiPickerEnabled()

  const handleClick = (event: any) => {
    onClick()
    event.stopPropagation()
  }

  return (
    <>
      {emojiPickerEnabled ? (
        <ConditionalAnimation>
          <div role={ROLES.EMOJI_PICKER_ICON} onClick={handleClick}>
            {CustomEmojiPicker ? (
              <CustomEmojiPicker />
            ) : (
              <Icon src={LogoEmoji} />
            )}
          </div>
        </ConditionalAnimation>
      ) : null}
    </>
  )
}
