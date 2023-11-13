import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { BotMessageImageContainer } from './styles'

interface MessageImageProps {
  imagestyle: Record<string, unknown>
  isSentByUser: boolean
  isSentByAgent: boolean
}

export const MessageImage = ({
  imagestyle,
  isSentByUser,
  isSentByAgent,
}: MessageImageProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

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
