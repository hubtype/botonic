import { useContext } from 'react'

import { SENDERS } from '../../index-types'
import { WebchatContext } from '../../webchat/context'
import { MessageFooterContainer } from './styles'
import { MessageTimestamp, resolveMessageTimestamps } from './timestamps'

interface MessageFooterProps {
  enabletimestamps: boolean
  messageJSON: any
  sentBy: SENDERS
}

export const MessageFooter = ({
  enabletimestamps,
  messageJSON,
  sentBy,
}: MessageFooterProps) => {
  const { getThemeProperty } = useContext(WebchatContext)

  const { timestampsEnabled, timestampStyle } = resolveMessageTimestamps(
    getThemeProperty,
    enabletimestamps
  )
  const isSentByUser = sentBy === SENDERS.user
  const messageFooterClass = isSentByUser
    ? 'message-footer-user'
    : 'message-footer-bot'

  return (
    <MessageFooterContainer
      className={messageFooterClass}
      isSentByUser={isSentByUser}
    >
      {timestampsEnabled ? (
        <MessageTimestamp
          sentBy={sentBy}
          style={timestampStyle}
          timestamp={messageJSON.timestamp}
        />
      ) : null}
    </MessageFooterContainer>
  )
}
