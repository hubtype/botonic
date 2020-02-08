import React, { useContext } from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

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
    let replyStyle = getThemeProperty('reply.style', {})
    const CustomReply = getThemeProperty('reply.custom', undefined)
    if (CustomReply) {
      return (
        <div onClick={e => handleClick(e)}>
          <CustomReply>{props.children}</CustomReply>
        </div>
      )
    }

    return (
      <button
        style={{
          width: '100%',
          padding: '4px 8px',
          border: `1px solid ${getThemeProperty('brand.color', '#0099ff')}`,
          color: getThemeProperty('brand.color', '#0099ff'),
          fontFamily: 'inherit',
          borderRadius: 8,
          cursor: 'pointer',
          outline: 0,
          ...replyStyle,
        }}
        onClick={e => handleClick(e)}
      >
        {props.children}
      </button>
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
