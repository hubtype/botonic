import React, { useContext } from 'react'

import { SENDERS } from '../../index-types'
import { WebchatContext } from '../../webchat/context'
import { MessageFeedback } from './message-feedback'
import { MessageFooterContainer } from './styles'
import { MessageTimestamp, resolveMessageTimestamps } from './timestamps'

interface MessageFooterProps {
  enabletimestamps: boolean
  messageJSON: any
  sentBy: SENDERS
  feedbackEnabled: boolean
  inferenceId?: string
  botInteractionId?: string
}

export const MessageFooter = ({
  enabletimestamps,
  messageJSON,
  sentBy,
  feedbackEnabled,
  inferenceId,
  botInteractionId,
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
      {feedbackEnabled ? (
        <MessageFeedback
          inferenceId={inferenceId}
          messageId={messageJSON.id}
          botInteractionId={botInteractionId}
        />
      ) : null}
    </MessageFooterContainer>
  )
}
