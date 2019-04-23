import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export const Pic = props => {
  const renderBrowser = () => (
    <img
      style={{
        borderRadius: '8px',
        maxWidth: '150px',
        maxHeight: '150px',
        margin: '10px'
      }}
      src={props.src}
    />
  )
  const renderNode = () => <pic>{props.src}</pic>
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Pic.serialize = picProps => {
  return { pic: picProps.src }
}
