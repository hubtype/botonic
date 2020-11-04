import React from 'react'
import styled from 'styled-components'
import LogoEmoji from '../../assets/emojiButton.svg'
import Picker from 'emoji-picker-react'
import { Icon, IconContainer } from './common'
import { useComponentVisible } from '../hooks'
import { ROLES } from '../../constants'

export const EmojiPicker = props => (
  <IconContainer role={ROLES.EMOJI_PICKER_ICON}>
    <div onClick={props.onClick}>
      <Icon src={LogoEmoji} />
    </div>
  </IconContainer>
)

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
          <Picker onEmojiClick={props.onEmojiClick} disableAutoFocus={true} />
        </Container>
      )}
    </div>
  )
}
