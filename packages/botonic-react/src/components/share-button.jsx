import React from 'react'

import { renderComponent } from '../util/react'

export const ShareButton = props => {
  const renderBrowser = () => null
  const renderNode = () => (
    <button type='element_share'>
      <pre
        dangerouslySetInnerHTML={{ __html: JSON.stringify(props.payload) }}
      />
    </button>
  )

  return renderComponent({ renderBrowser, renderNode })
}
