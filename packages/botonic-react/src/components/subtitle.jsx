import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export const Subtitle = props => {
  const renderBrowser = () => (
    <div style={{ padding: '6px' }}>{props.children}</div>
  )
  const renderNode = () => <desc>{props.children}</desc>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Subtitle.serialize = subtitleProps => {
  return { subtitle: subtitleProps.children }
}
