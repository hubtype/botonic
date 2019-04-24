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
      .filter(c => c && c.type && c.type.name != 'Button')
      .map(c => c.type.serialize && c.type.serialize(c.props))
  )
  // When we are serializer buttons from backend, we are receiving the data
  // as an array of buttons, so we have to keep robust with serve and deal with arrays
  element['buttons'] = [
    ...elementProps.children
      .filter(c => {
        if (c instanceof Array) return true
        return c && c.type && c.type.name == 'Button'
      })
      .map(b => {
        if (b instanceof Array) {
          return b.map(
            bb =>
              bb &&
              bb.type &&
              bb.type.serialize &&
              bb.type.serialize(bb.props).button
          )
        }
        return (
          b && b.type && b.type.serialize && b.type.serialize(b.props).button
        )
      })
  ]
  // When we have the buttons from backend, we have all buttons inside an array on the first position
  // of another array in element['buttons'] we want that element['buttons'] to be an array of buttons,
  // not an array of another array of buttons
  if (element['buttons'][0] instanceof Array)
    element['buttons'] = element['buttons'][0]
  return element
}
