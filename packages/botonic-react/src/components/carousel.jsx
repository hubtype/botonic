import React from 'react'
import { Message } from './message'
import { isBrowser, isNode } from '@botonic/core'

const serialize = carouselProps => {
  return {
    type: 'carousel',
    elements: carouselProps.children.map(
      e => e.type.serialize && e.type.serialize(e.props)
    )
  }
}

export const Carousel = props => {
  let content = props.children
  if (isBrowser()) {
    content = (
      <div
        name='carousel'
        style={{
          paddingTop: '10px',
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          maxWidth: '400px',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        {props.children}
      </div>
    )
  }
  return (
    <Message json={serialize(props)} type='carousel'>
      {content}
    </Message>
  )
}

Carousel.serialize = serialize
