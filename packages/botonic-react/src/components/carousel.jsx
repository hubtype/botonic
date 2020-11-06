import React, { useContext, useState, useEffect, useRef } from 'react'
import { Message } from './message'
import { WebchatContext } from '../contexts'
import { StyledScrollbar } from '../webchat/components/styled-scrollbar'
import { isBrowser, INPUT } from '@botonic/core'
import styled from 'styled-components'
import { COLORS, WEBCHAT } from '../constants'
import LeftArrow from '../assets/leftArrow.svg'
import RightArrow from '../assets/rightArrow.svg'
import { resolveImage } from '../util/environment'

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
  const scrollbarOptions = {
    ...{ enable: true, autoHide: true },
    ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.scrollbar),
  }
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

  if (isBrowser()) {
    content = (
      <StyledScrollbar
        scrollbar={scrollbarOptions}
        autoHide={scrollbarOptions.autoHide}
      >
        <StyledCarousel
          ref={carouselRef}
          carouselArrowsEnabled={carouselArrowsEnabled}
        >
          <StyledItems>{props.children}</StyledItems>
          {carouselArrowsEnabled && getArrows()}
        </StyledCarousel>
      </StyledScrollbar>
    )
  }
  return (
    <Message
      style={{ width: '85%', padding: 0, backgroundColor: COLORS.TRANSPARENT }}
      blob={false}
      json={serialize(props)}
      type={INPUT.CAROUSEL}
      {...props}
    >
      {content}
    </Message>
  )
}

Carousel.serialize = serialize
