import React, { useContext } from 'react'

import SendButtonIcon from '../../assets/send-button.svg'
import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { ConditionalAnimation } from '../components/conditional-animation'
import { Icon } from './common'

export const SendButton = ({ onClick }) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const sendButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableSendButton,
    true
  )

  const CustomSendButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customSendButton,
    undefined
  )

  return (
    <>
      {sendButtonEnabled || CustomSendButton ? (
        <ConditionalAnimation>
          <div onClick={onClick} role={ROLES.SEND_BUTTON_ICON}>
            {CustomSendButton ? (
              <CustomSendButton />
            ) : (
              <Icon src={SendButtonIcon} />
            )}
          </div>
        </ConditionalAnimation>
      ) : null}
    </>
  )
}
