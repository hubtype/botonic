import React, { useContext } from 'react'
import Fade from 'react-reveal/Fade'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { resolveImage } from '../../util/environment'
import { ConditionalWrapper } from '../../util/react'
import { DefaultIntroImage } from './styles'

export const IntroMessage = () => {
  const { getThemeProperty } = useContext(WebchatContext)

  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    true
  )
  const CustomIntro = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customIntro)
  const introImage = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.introImage)
  const introStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.introStyle)

  const DefaultIntro = introImage && (
    <DefaultIntroImage
      style={{
        ...introStyle,
      }}
      src={resolveImage(introImage)}
    />
  )

  return CustomIntro || DefaultIntro ? (
    <ConditionalWrapper
      condition={animationsEnabled}
      wrapper={children => <Fade>{children}</Fade>}
    >
      {CustomIntro ? <CustomIntro /> : DefaultIntro}
    </ConditionalWrapper>
  ) : null
}
