import React from 'react'
import { isBrowser, isNode } from '@botonic/core'

export const Carousel = props => {
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
}
