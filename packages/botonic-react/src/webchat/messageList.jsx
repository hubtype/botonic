import React, { useRef, useEffect, useContext } from 'react'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'

const StyledMessageList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`
const StyledMessages = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  white-space: pre;
  word-wrap: break-word;
`

export const WebchatMessageList = props => {
  const { webchatState } = useContext(WebchatContext)
  return (
    <StyledMessageList
      style={{
        ...(props.style || {})
      }}
    >
      {webchatState.theme.introImage && <webchatState.theme.introImage />}
      {webchatState.messagesComponents.map((e, i) => (
        <StyledMessages key={i}>{e}</StyledMessages>
      ))}
      {props.children}
    </StyledMessageList>
  )
}
