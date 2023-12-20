import React, { useContext, useEffect } from 'react'

import ArrowDown from '../../assets/arrow-down.svg'
import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ContainerUnreadMessagesBanner } from './styles'

interface UnreadMessagesBannerProps {
  unreadMessagesBannerRef: React.RefObject<HTMLDivElement>
}

export const UnreadMessagesBanner = ({
  unreadMessagesBannerRef,
}: UnreadMessagesBannerProps): JSX.Element => {
  const { getThemeProperty, webchatState } = useContext(WebchatContext)

  const CustomUnreadMessagesBanner = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerCustom,
    undefined
  )

  const notificationsBannerEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerEnabled,
    undefined
  )

  const notificationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsEnabled,
    CustomUnreadMessagesBanner || notificationsBannerEnabled
  )

  const text = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerText,
    'unread messages'
  )

  useEffect(() => {
    if (webchatState.isWebchatOpen && unreadMessagesBannerRef.current) {
      unreadMessagesBannerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [webchatState.isWebchatOpen, unreadMessagesBannerRef])

  return (
    <>
      {notificationsEnabled ? (
        <div ref={unreadMessagesBannerRef}>
          {CustomUnreadMessagesBanner ? (
            <CustomUnreadMessagesBanner />
          ) : (
            <ContainerUnreadMessagesBanner>
              <img src={resolveImage(ArrowDown)} />
              {webchatState.numUnreadMessages} {text}
            </ContainerUnreadMessagesBanner>
          )}
        </div>
      ) : null}
    </>
  )
}
