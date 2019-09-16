import React, { useContext } from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'
import styled from 'styled-components'

const StyledReply = styled.button`
  width: 100%;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
`

export const Reply = props => {
  const { webchatState, sendText } = useContext(WebchatContext)

  const handleClick = event => {
    event.preventDefault()
    if (props.children) {
      let payload = props.payload
      if (props.path) payload = `__PATH_PAYLOAD__${props.path}`
      sendText(props.children, payload)
    }
  }

  const renderBrowser = () => {
    if (webchatState.theme.customReply) {
      let CustomReply = webchatState.theme.customReply
      return (
        <div onClick={e => handleClick(e)}>
          <CustomReply>{props.children}</CustomReply>
        </div>
      )
    }
    return (
      <StyledReply
        style={{
          border: `1px solid ${webchatState.theme.brandColor}`,
          color: webchatState.theme.brandColor
        }}
        onClick={e => handleClick(e)}
      >
        {props.children}
      </StyledReply>
    )
  }

  const renderNode = () => {
    if (props.path) {
      let payload = `__PATH_PAYLOAD__${props.path}`
      return <reply payload={payload}>{props.children}</reply>
    }
    return <reply payload={props.payload}>{props.children}</reply>
  }

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Reply.serialize = replyProps => {
  let payload = replyProps.payload
  if (replyProps.path) payload = `__PATH_PAYLOAD__${replyProps.path}`
  return { reply: { title: replyProps.children, payload } }
}
