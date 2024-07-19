import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
import { Scale } from '../../shared/styles'
import { ConditionalWrapper } from '../../util/react'

export const ConditionalAnimation = props => {
  const { getThemeProperty } = useContext(WebchatContext)

  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    props.enableAnimations !== undefined ? props.enableAnimations : true
  )
  return (
    <ConditionalWrapper
      condition={animationsEnabled}
      wrapper={children => <Scale>{children}</Scale>}
    >
      {props.children}
    </ConditionalWrapper>
  )
}
