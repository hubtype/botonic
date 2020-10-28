import React from 'react'
import SendButtonIcon from '../../assets/send-button.svg'
import { Icon, IconContainer } from './common'

export const SendButton = () => (
  <IconContainer role='send-button-icon'>
    <Icon src={SendButtonIcon} />
  </IconContainer>
)
