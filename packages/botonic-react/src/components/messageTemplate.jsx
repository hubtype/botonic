import React from 'react'

import { isBrowser, isNode } from '@botonic/core'
import { WebchatContext } from '../contexts'

export const MessageTemplate = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <message type='template'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </message>
  )
  if (isBrowser()) return renderBrowser()
  else if (isNode()) return renderNode()
}
