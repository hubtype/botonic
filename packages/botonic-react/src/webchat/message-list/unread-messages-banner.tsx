/** biome-ignore-all lint/a11y/useAltText: we need to use alt text for the unread messages banner */
import type React from 'react'
import { useContext } from 'react'

import ArrowDown from '../../assets/arrow-down.svg'
import { resolveImage } from '../../util/environment'
import { WebchatContext } from '../../webchat/context'
import { ContainerUnreadMessagesBanner } from './styles'
import { useNotifications } from './use-notifications'

interface UnreadMessagesBannerProps {
  unreadMessagesBannerRef: React.RefObject<HTMLDivElement>
}

export const UnreadMessagesBanner = ({
  unreadMessagesBannerRef,
}: UnreadMessagesBannerProps): JSX.Element => {
  const { webchatState } = useContext(WebchatContext)

  const { notificationsEnabled, CustomUnreadMessagesBanner, bannerText } =
    useNotifications()

  return (
    <>
      {notificationsEnabled ? (
        <div ref={unreadMessagesBannerRef}>
          {CustomUnreadMessagesBanner ? (
            <CustomUnreadMessagesBanner />
          ) : (
            <ContainerUnreadMessagesBanner>
              <img src={resolveImage(ArrowDown)} />
              {webchatState.numUnreadMessages} {bannerText}
            </ContainerUnreadMessagesBanner>
          )}
        </div>
      ) : null}
    </>
  )
}
