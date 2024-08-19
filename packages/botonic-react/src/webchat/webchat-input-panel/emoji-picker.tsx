import Picker from 'emoji-picker-react'
import React, { LegacyRef, useContext } from 'react'

import LogoEmoji from '../../assets/emojiButton.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'
import { useComponentVisible } from '../hooks'
import { OpenedEmojiPickerContainer } from './styles'

interface EmojiPickerProps {
  enableEmojiPicker: boolean
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

interface OpenedEmojiPickerProps {
  onClick: () => void
  onEmojiClick: (event: any) => void
}

export const OpenedEmojiPicker = ({
  onClick,
  onEmojiClick,
}: OpenedEmojiPickerProps) => {
  const { ref, isComponentVisible } = useComponentVisible(true, onClick)
  return (
    <div ref={ref as LegacyRef<HTMLDivElement>}>
      {isComponentVisible && (
        <OpenedEmojiPickerContainer role={ROLES.EMOJI_PICKER}>
          <Picker
            width='100%'
            height='19rem'
            previewConfig={{ showPreview: false }}
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
          />
        </OpenedEmojiPickerContainer>
      )}
    </div>
  )
}
