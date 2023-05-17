import Picker from 'emoji-picker-react'
import React, { useContext } from 'react'
import styled from 'styled-components'

import LogoEmoji from '../../assets/emojiButton.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { ConditionalAnimation } from '../components/conditional-animation'
import { useComponentVisible } from '../hooks'
import { Icon } from './common'

export const EmojiPicker = ({ enableEmojiPicker, onClick }) => {
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

  const handleClick = event => {
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

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 3px;
  top: -324px;
`

export const OpenedEmojiPicker = props => {
  const { ref, isComponentVisible } = useComponentVisible(true, props.onClick)
  return (
    <div ref={ref}>
      {isComponentVisible && (
        <Container role={ROLES.EMOJI_PICKER}>
          <Picker
            width='100%'
            height='19rem'
            previewConfig={{ showPreview: false }}
            onEmojiClick={props.onEmojiClick}
            disableAutoFocus={true}
          />
        </Container>
      )}
    </div>
  )
}
