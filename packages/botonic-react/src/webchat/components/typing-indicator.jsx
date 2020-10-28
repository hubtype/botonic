import React from 'react'
import './typing-indicator.scss'
import { COLORS } from '../../constants'

export const TypingIndicator = props => (
  <div
    role='typing-indicator'
    className='typing-indicator'
    style={{ backgroundColor: COLORS.SEASHELL_WHITE }}
  >
    <span />
    <span />
    <span />
  </div>
)
