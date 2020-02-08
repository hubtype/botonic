import React from 'react'
import { isBrowser, isNode } from '@botonic/core'
import { COLORS } from '../constants'

export const Subtitle = props => {
  const renderBrowser = () => (
    <div
      style={{
        fontSize: 12,
        padding: '0px 15px 10px 15px',
        color: COLORS.MID_GRAY,
        ...(props.style || {}),
      }}
    >
      {props.children}
    </div>
  )
  const renderNode = () => <desc>{props.children}</desc>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Subtitle.serialize = subtitleProps => {
  return { subtitle: subtitleProps.children }
}
