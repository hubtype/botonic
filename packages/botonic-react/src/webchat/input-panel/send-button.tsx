import React, { useContext } from 'react'

import SendButtonIcon from '../../assets/send-button.svg'
import { ROLES } from '../../constants'
import { WebchatContext } from '../../webchat/context'
import { Icon } from '../components/common'
import { ConditionalAnimation } from '../components/conditional-animation'

interface SendButtonProps {
  onClick: () => Promise<void>
}

export const SendButton = ({ onClick }: SendButtonProps) => {
  const { webchatState } = useContext(WebchatContext)

  const CustomSendButton = webchatState.theme.userInput?.sendButton?.custom

  const isSendButtonEnabled = () => {
    const hasCustomSendButton = !!CustomSendButton
    return (
      webchatState.theme.userInput?.sendButton?.enable ?? hasCustomSendButton
    )
  }
  const sendButtonEnabled = isSendButtonEnabled()

  return (
    <>
      {sendButtonEnabled ? (
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
