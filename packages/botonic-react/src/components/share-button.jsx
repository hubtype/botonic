import React from 'react'
import { isBrowser, isNode } from '@botonic/core'

export const ShareButton = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <button type='element_share'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </button>
  )

  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
