import React, { forwardRef, useContext } from 'react'
import styled from 'styled-components'

import { COLORS, ROLES, WEBCHAT } from '../constants'
import { WebchatContext } from '../contexts'
import { Scale } from '../shared/styles'
import { resolveImage } from '../util/environment'
import { ConditionalWrapper } from '../util/react'
import { BotonicContainerId } from './constants'

const Header = styled.div`
  display: flex;
  background: linear-gradient(
    90deg,
    ${COLORS.BLEACHED_CEDAR_PURPLE} 0%,
    ${props => props.color} 100%
  );
  border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
  z-index: 2;
  height: inherit;
`

const ImageContainer = styled.div`
  padding: 10px;
  align-items: center;
`

const Image = styled.img`
  width: 32px;
  border-radius: 50%;
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
`

const Title = styled.div`
  display: flex;
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  color: ${COLORS.SOLID_WHITE};
`

const Subtitle = styled.div`
  display: flex;
  font-family: inherit;
  font-size: 11px;
  color: ${COLORS.SOLID_WHITE};
`

const CloseHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE};
  font-family: inherit;
  font-size: 36px;
`

export const DefaultHeader = props => {
  const { getThemeProperty } = props
  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    true
  )
  const headerImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerImage,
    getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.brandImage,
      WEBCHAT.DEFAULTS.LOGO
    )
  )

  const headerTitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
    WEBCHAT.DEFAULTS.TITLE
  )
  const headerSubtitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
    ''
  )

  return (
    <Header
      role={ROLES.HEADER}
      color={props.color}
      style={{ ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.headerStyle) }}
    >
      {headerImage && (
        <ImageContainer>
          <Image src={resolveImage(headerImage)} />
        </ImageContainer>
      )}
      <TextContainer ml={headerImage ? '0px' : '16px'}>
        <Title mb={headerSubtitle ? '6px' : '0px'}>{headerTitle}</Title>
        <Subtitle>{headerSubtitle}</Subtitle>
      </TextContainer>
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Scale>{children}</Scale>}
      >
        <CloseHeader onClick={props.onCloseClick}>⨯</CloseHeader>
      </ConditionalWrapper>
    </Header>
  )
}

const StyledWebchatHeader = styled.div`
  border-radius: 8px 8px 0px 0px;
  box-shadow: ${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px;
  height: 55px;
  flex: none;
`

export const WebchatHeader = forwardRef((props, ref) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)

  const handleCloseWebchat = event => {
    props.onCloseClick(event.target.value)
  }

  const CustomHeader = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customHeader)
  if (CustomHeader) {
    return (
      <div id={BotonicContainerId.Header} ref={ref}>
        <CustomHeader onCloseClick={handleCloseWebchat} />
      </div>
    )
  }

  return (
    <StyledWebchatHeader id={BotonicContainerId.Header} ref={ref}>
      <DefaultHeader
        webchatState={webchatState}
        getThemeProperty={getThemeProperty}
        color={getThemeProperty(
          WEBCHAT.CUSTOM_PROPERTIES.brandColor,
          COLORS.BOTONIC_BLUE
        )}
        onCloseClick={handleCloseWebchat}
      />
    </StyledWebchatHeader>
  )
})

WebchatHeader.displayName = 'WebchatHeader'
