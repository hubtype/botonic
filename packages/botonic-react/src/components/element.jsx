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

Element.serialize = elementProps => {
  let element = Object.assign(
    {},
    ...elementProps.children
      .filter(c => c.type && c.type.name != 'Button')
      .map(c => {
        console.log('CompoentneEl', c)
        return c.type.serialize && c.type.serialize(c.props)
      })
  )
  element['buttons'] = [
    ...elementProps.children
      .filter(c => c.type && c.type.name == 'Button')
      .map(b => b.type.serialize && b.type.serialize(b.props).button)
  ]
  return element
}
