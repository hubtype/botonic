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

const Background = styled.div`
  width: 100%;
  height: ${props => props.height}px;
  position: absolute;
  right: 0;
  bottom: 0;
`

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 0px;
  top: -332px;
`

export const OpenedEmojiPicker = props => {
  return (
    <>
      <Background onClick={props.onClick} height={props.height}></Background>
      <Container>
        <EmojiPickerComponent onEmojiClick={props.onEmojiClick} />
      </Container>
    </>
  )
}
