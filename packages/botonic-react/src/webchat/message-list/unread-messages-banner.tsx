import React, { useContext } from 'react'

import ArrowDown from '../../assets/arrow-down.svg'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ContainerUnreadMessagesBanner } from './styles'

interface UnreadMessagesBannerProps {
  unreadMessages: number
}

export const UnreadMessagesBanner = ({
  unreadMessages,
}: UnreadMessagesBannerProps): JSX.Element => {
  const { getThemeProperty } = useContext(WebchatContext)

  const notificationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsEnabled,
    false
  )

  const CustomUnreadMessagesBanner = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerCustom,
    undefined
  )

  const text = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerText,
    'unread messages'
  )

  return (
    <>
      {notificationsEnabled ? (
        <>
          {CustomUnreadMessagesBanner ? (
            <CustomUnreadMessagesBanner />
          ) : (
            <ContainerUnreadMessagesBanner>
              <img src={resolveImage(ArrowDown)} />
              {unreadMessages} {text}
            </ContainerUnreadMessagesBanner>
          )}
        </>
      ) : null}
    </>
  )
}
