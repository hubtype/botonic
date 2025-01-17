import React, { useContext } from 'react'

import { COLORS, ROLES, WEBCHAT } from '../../constants'
import { Scale } from '../../shared/styles'
import { resolveImage } from '../../util/environment'
import { ConditionalWrapper } from '../../util/react'
import { WebchatContext } from '../../webchat/context'
import {
  CloseHeader,
  HeaderContainer,
  ImageContainer,
  Subtitle,
  TextContainer,
  Title,
} from './styles'

export const DefaultHeader = () => {
  const { getThemeProperty, toggleWebchat } = useContext(WebchatContext)

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

  const handleCloseWebchat = () => {
    toggleWebchat(false)
  }

  const color = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.brandColor,
    COLORS.BOTONIC_BLUE
  )

  return (
    <HeaderContainer
      role={ROLES.HEADER}
      color={color}
      style={{ ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.headerStyle) }}
    >
      {headerImage && (
        <ImageContainer>
          <img src={resolveImage(headerImage)} />
        </ImageContainer>
      )}
      <TextContainer>
        <Title>{headerTitle}</Title>
        {headerSubtitle ? <Subtitle>{headerSubtitle}</Subtitle> : null}
      </TextContainer>
      <ConditionalWrapper
        condition={animationsEnabled}
        wrapper={children => <Scale>{children}</Scale>}
      >
        <CloseHeader onClick={handleCloseWebchat}>⨯</CloseHeader>
      </ConditionalWrapper>
    </HeaderContainer>
  )
}
