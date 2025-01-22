import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { SENDERS } from '../../index-types'
import { resolveImage } from '../../util/environment'
import { WebchatContext } from '../../webchat/context'
import { BotMessageImageContainer } from './styles'

interface MessageImageProps {
  imagestyle: Record<string, unknown>
  sentBy: SENDERS
}

export const MessageImage = ({ imagestyle, sentBy }: MessageImageProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const isSentByAgent = sentBy === SENDERS.agent
  const isSentByUser = sentBy === SENDERS.user

  const timestampsWithImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsWithImage
  )

  const BotMessageImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.botMessageImage,
    getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.brandImage,
      WEBCHAT.DEFAULTS.LOGO
    )
  )

  const AgentMessageImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.agentMessageImage,
    BotMessageImage
  )

  return (
    !timestampsWithImage &&
    !isSentByUser &&
    BotMessageImage && (
      <BotMessageImageContainer
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.botMessageImageStyle),
          ...imagestyle,
        }}
      >
        <img
          style={{ width: '100%' }}
          src={resolveImage(
            isSentByAgent ? AgentMessageImage : BotMessageImage
          )}
        />
      </BotMessageImageContainer>
    )
  )
}
