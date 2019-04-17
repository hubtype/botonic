import React from 'react'
import { Message } from './message'
import { isBrowser, isNode } from '@botonic/core'

export const Carousel = props => {
  let content = props.children
  if (isBrowser()) {
    content = (
      <div
        style={{
          paddingTop: '10px',
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          maxWidth: '400px',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        {props.children}
      </div>
    )
  }
  return <Message type='carousel'>{content}</Message>
} /*
  const renderBrowser = () => (
    <div
      style={{
        paddingTop: '10px',
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        maxWidth: '400px',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      {props.children}
    </div>
  )

  const renderNode = () => <message type='carousel'>{props.children}</message>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}*/
