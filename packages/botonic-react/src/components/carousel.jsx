import React from 'react'
import styled from 'styled-components'

import { Message } from './message'
import { isBrowser, isNode } from '@botonic/core'

const Box = styled.div`
  padding-top: 10px;
  margin-left: -13px;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  max-width: 100%;
`
const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
`

const serialize = carouselProps => {
  return {
    type: 'carousel',
    elements: carouselProps.children.map(
      e => e && e.type && e.type.serialize && e.type.serialize(e.props)
    )
  }
}

export const Carousel = props => {
  let content = props.children
  if (isBrowser()) {
    content = (
      <Box>
        <Item>{props.children}</Item>
      </Box>
    )
  }
  return (
    <Message
      style={{ maxWidth: '90%', padding: 0 }}
      blob={false}
      json={serialize(props)}
      type='carousel'
      {...props}
    >
      {content}
    </Message>
  )
}

Carousel.serialize = serialize
