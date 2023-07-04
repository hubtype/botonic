import React, { useContext } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { _getThemeProperty } from '../../util/webchat'
import {
  StyledTriggerButton,
  TriggerImage,
  UnreadMessagesCounter,
} from './styles'

export interface TriggerButtonProps {
  theme: any
  unreadMessages: number
  webchatState: any
}

export const TriggerButton = ({
  theme,
  unreadMessages,
  webchatState,
}: TriggerButtonProps): JSX.Element => {
  const toggleWebchat = useContext(WebchatContext)
  const getThemeProperty = _getThemeProperty(theme)

  const getTriggerImage = () => {
    const triggerImage = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.triggerButtonImage,
      undefined
    )
    if (triggerImage === null) {
      webchatState.theme.triggerButtonImage = WEBCHAT.DEFAULTS.LOGO
      return null
    }
    return triggerImage
  }

  const triggerButtonStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.triggerButtonStyle
  )

  const CustomTriggerButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customTrigger,
    undefined
  )

  const handleClick = (event: any) => {
    //@ts-ignore
    toggleWebchat(true)
    event.preventDefault()
  }
  return (
    <div
      onClick={event => {
        handleClick(event)
      }}
    >
      {unreadMessages !== 0 && (
        <UnreadMessagesCounter className='trigger-notifications'>
          {unreadMessages}
        </UnreadMessagesCounter>
      )}
      {CustomTriggerButton ? (
        <CustomTriggerButton />
      ) : (
        <StyledTriggerButton
          role={ROLES.TRIGGER_BUTTON}
          style={{ ...triggerButtonStyle }}
        >
          {getTriggerImage() && (
            <TriggerImage src={resolveImage(getTriggerImage())} />
          )}
        </StyledTriggerButton>
      )}
    </div>
  )
}
