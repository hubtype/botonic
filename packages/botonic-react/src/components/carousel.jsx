import React, { useContext } from 'react'
import { Message } from './message'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from '../webchat/components/styled-scrollbar'
import { isBrowser, isNode } from '@botonic/core'
import styled from 'styled-components'
import { COLORS } from '../constants'

const StyledCarousel = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  max-width: 100%;
`

const StyledItems = styled.div`
  display: flex;
  flexdirection: row;
  alignitems: start;
`

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
        <StyledCarousel>
          <StyledItems>{props.children}</StyledItems>
        </StyledCarousel>
      </StyledScrollbar>
    )
  }
  return (
    <Message
      style={{ width: '85%', padding: 0, backgroundColor: COLORS.TRANSPARENT }}
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
