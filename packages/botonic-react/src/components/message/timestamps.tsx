import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { SENDERS } from '../../index-types'
import { resolveImage } from '../../util'
import { WebchatContext } from '../../webchat/context'
import { TimestampContainer, TimestampText } from './styles'

export const resolveMessageTimestamps = (
  getThemeProperty,
  timestampEnabled
) => {
  const timestampsFormat = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsFormat
  )
  const timestampStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsStyle
  )
  const timestampsEnabled = Boolean(
    timestampEnabled !== undefined
      ? timestampEnabled
      : getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.enableMessageTimestamps,
          Boolean(timestampStyle) || Boolean(timestampsFormat) || false
        )
  )

  const defaultTimestampFormat = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }

  const getFormattedTimestamp = timestampsFormat
    ? timestampsFormat()
    : // @ts-ignore
      new Date().toLocaleString(undefined, defaultTimestampFormat)

  return {
    timestampsEnabled,
    getFormattedTimestamp,
    timestampStyle,
  }
}

interface MessageTimestampProps {
  timestamp: string
  style: Record<string, unknown>
  sentBy: SENDERS
}

export const MessageTimestamp = ({
  timestamp,
  style,
  sentBy,
}: MessageTimestampProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const isSentByUser = sentBy === SENDERS.user
  const isSentByAgent = sentBy === SENDERS.agent

  const BotMessageImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.botMessageImage,
    undefined
  )

  const AgentMessageImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.agentMessageImage,
    BotMessageImage
  )

  const timestampsWithImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsWithImage
  )

  return (
    <TimestampContainer
      className={`botonic-timestamp-container ${sentBy}`}
      isSentByUser={isSentByUser}
    >
      {timestampsWithImage && BotMessageImage && !isSentByUser && (
        <img
          src={resolveImage(
            isSentByAgent ? AgentMessageImage : BotMessageImage
          )}
        />
      )}
      <TimestampText isSentByUser={isSentByUser} style={style}>
        {timestamp}
      </TimestampText>
    </TimestampContainer>
  )
}
