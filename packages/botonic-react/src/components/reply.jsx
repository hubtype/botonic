import React, { useContext } from 'react'
import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { renderComponent } from '../util/react'

const StyledButton = styled.button`
  width: 100%;
  padding: 4px 8px;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
`

export const Reply = props => {
  const { sendText, getThemeProperty } = useContext(WebchatContext)
  const handleClick = event => {
    event.preventDefault()
    if (props.children) {
      let payload = props.payload
      if (props.path) payload = `__PATH_PAYLOAD__${props.path}`
      sendText(props.children, payload)
    }
  }

  const renderBrowser = () => {
    const replyStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.replyStyle)
    const CustomReply = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customReply)
    if (CustomReply) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomReply>{props.children}</CustomReply>
        </div>
      )
    }

    return (
      <StyledButton
        style={{
          border: `1px solid ${getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.brandColor,
            COLORS.BOTONIC_BLUE
          )}`,
          color: getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.brandColor,
            COLORS.BOTONIC_BLUE
          ),
          ...replyStyle,
        }}
        onClick={e => handleClick(e)}
      >
        {props.children}
      </StyledButton>
    )
  }

  const renderNode = () => {
    if (props.path) {
      const payload = `__PATH_PAYLOAD__${props.path}`
      return <reply payload={payload}>{props.children}</reply>
    }
    return <reply payload={props.payload}>{props.children}</reply>
  }

  return renderComponent({ renderBrowser, renderNode })
}

Reply.serialize = replyProps => {
  let payload = replyProps.payload
  if (replyProps.path) payload = `__PATH_PAYLOAD__${replyProps.path}`
  return { reply: { title: replyProps.children, payload } }
}
