import React, { useContext } from 'react'

import { WebchatContext } from '../../contexts'
import { SENDERS } from '../../index-types'
import { MessageFeedback } from './message-feedback'
import { MessageFooterContainer } from './styles'
import { MessageTimestamp, resolveMessageTimestamps } from './timestamps'

interface MessageFooterProps {
  enabletimestamps: boolean
  messageJSON: any
  sentBy: SENDERS
  feedbackenabled: boolean
  inferenceid?: string
}

export const MessageFooter = ({
  enabletimestamps,
  messageJSON,
  sentBy,
  feedbackenabled,
  inferenceid,
}: MessageFooterProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const { timestampsEnabled, timestampStyle } = resolveMessageTimestamps(
    getThemeProperty,
    enabletimestamps
  )
  const isSentByUser = sentBy === SENDERS.user
  const messageFotterClass = isSentByUser
    ? 'message-footer-user'
    : 'message-footer-bot'

  return (
    <MessageFooterContainer
      className={messageFotterClass}
      isSentByUser={isSentByUser}
    >
      {timestampsEnabled ? (
        <MessageTimestamp
          sentBy={sentBy}
          style={timestampStyle}
          timestamp={messageJSON.timestamp}
        />
      ) : null}
      {feedbackenabled ? (
        <MessageFeedback inferenceid={inferenceid} messageId={messageJSON.id} />
      ) : null}
    </MessageFooterContainer>
  )
}
