import React from 'react'
import styled from 'styled-components'
import LogoEmoji from '../../assets/emojiButton.svg'
import EmojiPickerComponent from 'emoji-picker-react'
import { Icon, IconContainer } from './common'

export const EmojiPicker = props => (
  <IconContainer>
    <div onClick={props.onClick}>
      <Icon src={LogoEmoji} />
    </div>
  </IconContainer>
)

const Container = styled.div`
  width: ${props => props.width || '100%'};
  max-width: 400px;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0px;
  top: -332px;
`
export const OpenedEmojiPicker = props => {
  return (
    <Container width={props.width}>
      <EmojiPickerComponent onEmojiClick={props.onClick} />
    </Container>
  )
}
