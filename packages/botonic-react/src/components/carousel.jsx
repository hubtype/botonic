import React from 'react'
import styled from 'styled-components'
import { Message } from './message'
import { isBrowser, isNode } from '@botonic/core'

const CarouselStyled = styled.div`
  paddingtop: 10px;
  display: flex;
  flexdirection: row;
  overflowx: auto;
  maxwidth: 100%;
`
const CarouselItems = styled.div`
  display: flex;
  flexdirection: row;
  alignitems: start;
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
      <CarouselStyled>
        <CarouselItems>{props.children}</CarouselItems>
      </CarouselStyled>
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
