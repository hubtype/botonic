import React from 'react'

import { COLORS, ROLES } from '../../constants'
import { Dot, TypingIndicatorWrapper } from './styles'

export const TypingIndicator = () => (
  <TypingIndicatorWrapper
    role={ROLES.TYPING_INDICATOR}
    className='typing-indicator'
    backgroundColor={COLORS.SEASHELL_WHITE}
  >
    <Dot />
    <Dot />
    <Dot />
  </TypingIndicatorWrapper>
)
