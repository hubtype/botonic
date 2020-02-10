import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export const Title = props => {
  const renderBrowser = () => (
    <div style={{ fontSize: 14, padding: '10px 15px', ...(props.style || {}) }}>
      {props.children}
    </div>
  )
  const renderNode = () => <title>{props.children}</title>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Title.serialize = titleProps => {
  return { title: titleProps.children }
}
