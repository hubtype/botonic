import React from 'react'
import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { renderComponent } from '../util/react'
import { Button } from './button'

const ElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${WEBCHAT.DEFAULTS.ELEMENT_WIDTH}px;
  margin-right: ${WEBCHAT.DEFAULTS.ELEMENT_MARGIN_RIGHT}px;
  border-radius: 6px;
  border: 1px solid ${COLORS.SEASHELL_WHITE};
  overflow: hidden;
  justify-content: space-between;
`

export const Element = props => {
  const renderBrowser = () => (
    <ElementContainer>{props.children}</ElementContainer>
  )

  const renderNode = () => <element>{props.children}</element>

  return renderComponent({ renderBrowser, renderNode })
}

Element.serialize = elementProps => {
  const element = Object.assign(
    {},
    ...elementProps.children
      .filter(c => c && c.type && c.type.name != 'Button')
      .map(c => c.type.serialize && c.type.serialize(c.props))
  )
  // When we are serializer buttons from backend, we are receiving the data
  // as an array of buttons, so we have to keep robust with serve and deal with arrays
  element.buttons = [
    ...elementProps.children
      .filter(c => {
        if (c instanceof Array) return true
        return c?.type?.name === Button.name
      })
      .map(b => {
        if (b instanceof Array) {
          b.map(bb => bb?.type?.serialize?.(bb.props)?.button)
        }
        return b?.type?.serialize(b.props).button
      }),
  ]
  // When we have the buttons from backend, we have all buttons inside an array on the first position
  // of another array in element['buttons'] we want that element['buttons'] to be an array of buttons,
  // not an array of another array of buttons
  if (element.buttons[0] instanceof Array) element.buttons = element.buttons[0]
  return element
}
