import React from 'react'
import styled from 'styled-components'

import { COLORS } from '../constants'

export const resolveMessageTimestamps = (
  getThemeFn,
  messageTimestampEnabled
) => {
  const timestampsFormat = getThemeFn('message.timestamps.format')
  const timestampStyle = getThemeFn('message.timestamps.style')
  const timestampsEnabled = Boolean(
    messageTimestampEnabled !== undefined
      ? messageTimestampEnabled
      : getThemeFn(
          'message.timestamps.enable',
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
  const getFormattedTimestamp =
    (timestampsFormat && timestampsFormat()) ||
    new Date().toLocaleString(undefined, defaultTimestampFormat)
  return {
    timestampsEnabled,
    getFormattedTimestamp,
    timestampStyle,
  }
}

const TimestampContainer = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
`

const TimestampText = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Lato');
  font-family: Lato;
  font-size: 10px;
  color: ${COLORS.SOLID_BLACK};
  width: 100%;
  text-align: ${props => (props.isfromuser ? 'right' : 'left')};
  padding: ${props => (props.isfromuser ? '0px 15px' : '0px 50px')};
  margin-bottom: 5px;
`

export const MessageTimestamp = ({ timestamp, style, isfromuser }) => {
  const classSufix = isfromuser ? 'user' : 'bot'
  return (
    <TimestampContainer className={`botonic-timestamp-${classSufix}`}>
      <TimestampText
        isfromuser={isfromuser}
        style={{
          ...style,
        }}
      >
        {timestamp}
      </TimestampText>
    </TimestampContainer>
  )
}
