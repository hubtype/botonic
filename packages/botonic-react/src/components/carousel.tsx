import { INPUT, isBrowser } from '@botonic/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import LeftArrow from '../assets/leftArrow.svg'
import RightArrow from '../assets/rightArrow.svg'
import { COLORS, WEBCHAT } from '../constants'
import { resolveImage } from '../util/environment'
import { WebchatContext } from '../webchat/context'
import { ButtonsDisabler } from './buttons-disabler'
import { Message } from './message'

const ScrollableCarousel = styled.div`
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`

const StyledCarousel = styled.div`
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  max-width: 100%;
  ${props => props.carouselArrowsEnabled && 'overflow-x: auto;'}
`

const StyledItems = styled.div`
  display: flex;
`

const StyledArrowContainer = styled.div`
  position: absolute;
  top: calc(50% - 20px);
  height: 40px;
  width: 25px;
  background: ${COLORS.SILVER};
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: ${props => props.justifyContent};
  left: ${props => props.left}px;
  right: ${props => props.right}px;
  border-top-${props => props.arrow}-radius: 30px;
  border-bottom-${props => props.arrow}-radius: 30px;
`
const StyledArrow = styled.img`
  width: 20px;
  height: 20px;
`

const serialize = carouselProps => {
  let carouselChildren = carouselProps.children
  if (!Array.isArray(carouselChildren)) carouselChildren = [carouselChildren]
  return {
    type: INPUT.CAROUSEL,
    elements: carouselChildren.map(
      e => e && e.type && e.type.serialize && e.type.serialize(e.props)
    ),
  }
}

/**
 *
 * @param {MessageProps} props
 * @returns {JSX.Element}
 */
export const Carousel = props => {
  const { getThemeProperty } = useContext(WebchatContext)
  let content = props.children
  const [hasLeftArrow, setLeftArrow] = useState(false)
  const [hasRightArrow, setRightArrow] = useState(true)
  const carouselRef = useRef(null)
  const CustomCarouselLeftArrow = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customCarouselLeftArrow,
    undefined
  )
  const CustomCarouselRightArrow = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customCarouselRightArrow,
    undefined
  )
  // TODO: Investigate why when set to false, scroll is enabled via dragging the bar but not hovering the carousel elements
  const carouselArrowsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableCarouselArrows,
    true
  )

  const scrollCarouselBy = value => {
    carouselRef.current.scrollBy({
      left: value,
      behavior: 'smooth',
    })
  }

  const setArrowsVisibility = event => {
    const carousel = event.currentTarget
    const maxRightScroll =
      carousel.scrollWidth -
      carousel.offsetWidth -
      WEBCHAT.DEFAULTS.ELEMENT_MARGIN_RIGHT
    setLeftArrow(carousel.scrollLeft !== 0)
    setRightArrow(carousel.scrollLeft < maxRightScroll)
  }

  const getArrows = () => {
    const scrollBy =
      WEBCHAT.DEFAULTS.ELEMENT_WIDTH + WEBCHAT.DEFAULTS.ELEMENT_MARGIN_RIGHT
    return (
      <>
        {hasLeftArrow &&
          (CustomCarouselLeftArrow ? (
            <CustomCarouselLeftArrow scrollCarouselBy={scrollCarouselBy} />
          ) : (
            <StyledArrowContainer
              left={0}
              arrow={'right'}
              justifyContent={'flex-start'}
              onClick={() => scrollCarouselBy(-scrollBy)}
            >
              <StyledArrow src={resolveImage(LeftArrow)} />
            </StyledArrowContainer>
          ))}
        {hasRightArrow &&
          (CustomCarouselRightArrow ? (
            <CustomCarouselRightArrow scrollCarouselBy={scrollCarouselBy} />
          ) : (
            <StyledArrowContainer
              right={0}
              arrow={'left'}
              justifyContent={'flex-end'}
              onClick={() => scrollCarouselBy(scrollBy)}
            >
              <StyledArrow src={resolveImage(RightArrow)} />
            </StyledArrowContainer>
          ))}
      </>
    )
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel && carousel.addEventListener) {
      carousel.addEventListener('scroll', setArrowsVisibility, false)
    } else if (carousel && carousel.attachEvent) {
      carousel.attachEvent('scroll', setArrowsVisibility)
    }
  }, [carouselRef.current])

  const carouselProps = {
    ...props,
    children: ButtonsDisabler.updateChildrenButtons(props.children),
  }

  if (isBrowser()) {
    content = (
      <ScrollableCarousel>
        <StyledCarousel
          ref={carouselRef}
          carouselArrowsEnabled={carouselArrowsEnabled}
        >
          <StyledItems>{carouselProps.children}</StyledItems>
          {carouselArrowsEnabled && getArrows()}
        </StyledCarousel>
      </ScrollableCarousel>
    )
  }

  return (
    <Message
      style={{ width: '85%', padding: 0, backgroundColor: COLORS.TRANSPARENT }}
      blob={false}
      json={serialize(carouselProps)}
      type={INPUT.CAROUSEL}
      {...carouselProps}
    >
      {content}
    </Message>
  )
}

Carousel.serialize = serialize
