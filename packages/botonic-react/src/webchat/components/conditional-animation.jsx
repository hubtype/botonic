import { motion } from 'framer-motion'
import React, { useContext } from 'react'

import { WEBCHAT } from '../../constants'
import { WebchatContext } from '../../contexts'
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
      wrapper={children => (
        <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
      )}
    >
      {props.children}
    </ConditionalWrapper>
  )
}
