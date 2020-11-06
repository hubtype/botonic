import React from 'react'

import { renderComponent } from '../util/react'

export const MessageTemplate = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <message type='template'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </message>
  )
  return renderComponent({ renderBrowser, renderNode })
}
