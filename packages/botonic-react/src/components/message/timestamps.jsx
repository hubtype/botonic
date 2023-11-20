import React from 'react'

import { WEBCHAT } from '../../constants'
import { SENDERS } from '../../index-types'
import { TimestampContainer, TimestampText } from './styles'

export const resolveMessageTimestamps = (
  getThemeFn,
  messageTimestampEnabled
) => {
  const timestampsFormat = getThemeFn(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsFormat
  )
  const timestampStyle = getThemeFn(
    WEBCHAT.CUSTOM_PROPERTIES.messageTimestampsStyle
  )
  const timestampsEnabled = Boolean(
    messageTimestampEnabled !== undefined
      ? messageTimestampEnabled
      : getThemeFn(
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
    : new Date().toLocaleString(undefined, defaultTimestampFormat)

  return {
    timestampsEnabled,
    getFormattedTimestamp,
    timestampStyle,
  }
}

export const MessageTimestamp = ({ timestamp, style, sentBy }) => {
  return (
    <TimestampContainer className={`botonic-timestamp-${sentBy}`}>
      <TimestampText
        isSentByUser={sentBy === SENDERS.user}
        style={{
          ...style,
        }}
      >
        {timestamp}
      </TimestampText>
    </TimestampContainer>
  )
}
