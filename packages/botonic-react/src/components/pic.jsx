import React from 'react'

import { isBrowser, isNode } from '@botonic/core'

export const Pic = props => {
  const renderBrowser = () => (
    <div
      style={{
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width: 222,
        height: 140,
        background: `#fff url(${props.src}) no-repeat center/cover`,
        borderBottom: '1px solid #F1F0F0'
      }}
    />
  )
  const renderNode = () => <pic>{props.src}</pic>
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}

Pic.serialize = picProps => {
  return { pic: picProps.src }
}
