import React, { ForwardedRef, forwardRef } from 'react'

import { COLORS, ROLES } from '../../constants'
import { Dot, TypingContainer, TypingMsgWrapper } from './styles'

const TypingIndicator = forwardRef<HTMLDivElement, any>(
  (_props, ref: ForwardedRef<HTMLDivElement>) => (
    <TypingContainer ref={ref}>
      <TypingMsgWrapper
        role={ROLES.TYPING_INDICATOR}
        className='typing-indicator'
        backgroundColor={COLORS.SEASHELL_WHITE}
      >
        <Dot />
        <Dot />
        <Dot />
      </TypingMsgWrapper>
    </TypingContainer>
  )
)

TypingIndicator.displayName = 'TypingIndicator'

export default TypingIndicator
