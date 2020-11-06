import React from 'react'

import SendButtonIcon from '../../assets/send-button.svg'
import { ROLES } from '../../constants'
import { Icon, IconContainer } from './common'

export const SendButton = () => (
  <IconContainer role={ROLES.SEND_BUTTON_ICON}>
    <Icon src={SendButtonIcon} />
  </IconContainer>
)
