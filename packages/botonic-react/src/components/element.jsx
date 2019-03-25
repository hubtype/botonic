import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export const Element = props => {
  const renderBrowser = () => (
    <div
      style={{
        marginRight: '6px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '6px'
      }}
    >
      {props.children}
    </div>
  )

  const renderNode = () => <element>{props.children}</element>

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
