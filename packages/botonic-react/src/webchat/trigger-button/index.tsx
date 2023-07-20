import React, { useContext } from 'react'

import { ROLES, WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import {
  StyledTriggerButton,
  TriggerImage,
  UnreadMessagesCounter,
} from './styles'

export const TriggerButton = (): JSX.Element => {
  const { webchatState, getThemeProperty, toggleWebchat } =
    useContext(WebchatContext)

  const getTriggerImage = () => {
    const image = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.triggerButtonImage,
      undefined
    )

    if (!image) {
      webchatState.theme.triggerButtonImage = WEBCHAT.DEFAULTS.LOGO
      return null
    }
    return image
  }

  const triggerButtonImage = getTriggerImage()

  const triggerButtonStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.triggerButtonStyle
  )

  const triggerButtonNotifications = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.triggerButtonNotifications,
    true
  )

  const CustomTriggerButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customTrigger,
    undefined
  )

  const handleClick = (event: any) => {
    toggleWebchat(true)
    event.preventDefault()
  }

  return (
    <div onClick={handleClick}>
      {webchatState.unreadMessages !== 0 && triggerButtonNotifications && (
        <UnreadMessagesCounter className='trigger-notifications'>
          {webchatState.unreadMessages}
        </UnreadMessagesCounter>
      )}
      {CustomTriggerButton ? (
        //@ts-ignore
        <CustomTriggerButton />
      ) : (
        <StyledTriggerButton
          role={ROLES.TRIGGER_BUTTON}
          style={triggerButtonStyle}
        >
          {triggerButtonImage && (
            <TriggerImage src={resolveImage(triggerButtonImage)} />
          )}
        </StyledTriggerButton>
      )}
    </div>
  )
}
