import styled from 'styled-components'

import { COLORS } from '../../constants'

interface MessageContainerProps {
  isSentByUser: boolean
}

export const MessageContainer = styled.div<MessageContainerProps>`
  display: flex;
  justify-content: ${props => (props.isSentByUser ? 'flex-end' : 'flex-start')};
  position: relative;
  padding: 0px 6px;
`

export const BotMessageImageContainer = styled.div`
  width: 28px;
  padding: 12px 4px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
`
interface BolbContainerProps {
  bgcolor: string
  blob: boolean
  blobwidth?: string
}

export const BlobContainer = styled.div<BolbContainerProps>`
  position: relative;
  margin: 8px;
  border-radius: 8px;
  background-color: ${props => props.bgcolor};
  color: ${props => props.color};
  max-width: ${props =>
    props.blob
      ? props.blobwidth
        ? props.blobwidth
        : '60%'
      : 'calc(100% - 16px)'};
`
interface BlobTextProps {
  blob: boolean
  markdownstyle: any
}

export const BlobText = styled.div<BlobTextProps>`
  padding: ${props => (props.blob ? '8px 12px' : '0px')};
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  ${props => props.markdownstyle}
`

export const BlobTickContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  padding: 18px 0px 18px 0px;
  display: flex;
  top: 0;
  align-items: center;
`

interface BlobTickProps {
  pointerSize: number
}

export const BlobTick = styled.div<BlobTickProps>`
  position: relative;
  margin: -${props => props.pointerSize}px 0px;
  border: ${props => props.pointerSize}px solid ${COLORS.TRANSPARENT};
`
interface TimestampContainerProps {
  isSentByUser: boolean
}

export const TimestampContainer = styled.div<TimestampContainerProps>`
  display: flex;
  position: relative;
  justify-content: ${props => (props.isSentByUser ? 'flex-end' : 'flex-start')};
  align-items: center;
  gap: 10px;

  box-sizing: border-box;
  width: 100%;

  img {
    max-width: 20px;
  }
`
interface TimestampTextProps {
  isSentByUser: boolean
}

export const TimestampText = styled.div<TimestampTextProps>`
  @import url('https://fonts.googleapis.com/css?family=Lato');
  font-family: Lato;
  font-size: 10px;
  color: ${COLORS.SOLID_BLACK};
  text-align: ${props => (props.isSentByUser ? 'right' : 'left')};
`

export const MessageFooterContainer = styled.div<TimestampContainerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing: border-box;
  padding: 0px 15px 4px 15px;
  padding-top: ${props => (props.isSentByUser ? '0px' : '4px')};
  width: 100%;
`

export const FeedbackMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;

  box-sizing: border-box;
`

export const FeedbackButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  padding: 8px 8px;
  height: 24px;
  width: 24px;

  &:hover {
    cursor: pointer;
    background-color: #f4f3f4;
  }

  &:disabled {
    cursor: default;
    background: none;
    opacity: 0.3;
  }

  &.clicked {
    opacity: 0;
    transition: 1s 1s;
  }
`
