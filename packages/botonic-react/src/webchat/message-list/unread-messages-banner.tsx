import React from 'react'

import ArrowDown from '../../assets/arrow-down.svg'
import { resolveImage } from '../../util/environment'
import { ContainerUnreadMessagesBanner } from './styles'

interface UnreadMessagesBannerProps {
  text?: string
  unreadMessages: number
}

export const UnreadMessagesBanner = ({
  text = 'unread messages',
  unreadMessages,
}: UnreadMessagesBannerProps): JSX.Element => {
  return (
    <ContainerUnreadMessagesBanner>
      <img src={resolveImage(ArrowDown)} />
      {unreadMessages} {text}
    </ContainerUnreadMessagesBanner>
  )
}
