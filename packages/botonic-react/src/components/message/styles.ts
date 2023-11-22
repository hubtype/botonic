import styled from 'styled-components'

import { COLORS } from '../../constants'

export const MessageContainer = styled.div`
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

export const BlobContainer = styled.div`
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

export const BlobText = styled.div`
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
export const BlobTick = styled.div`
  position: relative;
  margin: -${props => props.pointerSize}px 0px;
  border: ${props => props.pointerSize}px solid ${COLORS.TRANSPARENT};
`

export const TimestampContainer = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
`

export const TimestampText = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Lato');
  font-family: Lato;
  font-size: 10px;
  color: ${COLORS.SOLID_BLACK};
  width: 100%;
  text-align: ${props => (props.isSentByUser ? 'right' : 'left')};
  padding: ${props => (props.isSentByUser ? '0px 15px' : '0px 50px')};
  margin-bottom: 5px;
`
