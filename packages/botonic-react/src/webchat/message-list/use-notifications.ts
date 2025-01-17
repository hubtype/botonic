import { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../webchat/context'

export function useNotifications() {
  const { getThemeProperty } = useContext(WebchatContext)

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

  const bannerText = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.notificationsBannerText,
    'unread messages'
  )

  const CustomScrollButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonCustom,
    undefined
  )

  const scrollButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.scrollButtonEnabled,
    CustomScrollButton
  )

  return {
    notificationsEnabled,
    bannerText,
    CustomUnreadMessagesBanner,
    CustomScrollButton,
    scrollButtonEnabled,
  }
}
