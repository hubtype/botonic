import React from 'react'

import { COLORS } from '../../../constants'
import { IconProps } from '../types'

export const CaretDownSvg = ({ color = COLORS.N500 }: IconProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640' color={color}>
      <path
        d='M300.3 440.8C312.9 451 331.4 450.3 343.1 438.6L471.1 310.6C480.3 301.4 483 287.7 478 275.7C473 263.7 461.4 256 448.5 256L192.5 256C179.6 256 167.9 263.8 162.9 275.8C157.9 287.8 160.7 301.5 169.9 310.6L297.9 438.6L300.3 440.8z'
        fill='currentColor'
      />
    </svg>
  )
}
