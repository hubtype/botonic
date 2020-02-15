import React, { useContext } from 'react'
import { Message } from './message'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from '../webchat/styled-scrollbar'
import { isBrowser, isNode } from '@botonic/core'

const serialize = carouselProps => {
  let carouselChildren = carouselProps.children
  if (!Array.isArray(carouselChildren)) carouselChildren = [carouselChildren]
  return {
    type: 'carousel',
    elements: carouselChildren.map(
      e => e && e.type && e.type.serialize && e.type.serialize(e.props)
    ),
  }
}

export const Carousel = props => {
  const { getThemeProperty } = useContext(WebchatContext)
  let content = props.children
  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty('scrollbar'),
  }
  if (isBrowser()) {
    content = (
      <StyledScrollbar
        scrollbar={scrollbarOptions}
        autoHide={scrollbarOptions.autoHide}
      >
        <div
          style={{
            paddingTop: 10,
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'start',
            }}
          >
            {props.children}
          </div>
        </div>
      </StyledScrollbar>
    )
  }
  return (
    <Message
      style={{ width: '85%', padding: 0, backgroundColor: 'transparent' }}
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
