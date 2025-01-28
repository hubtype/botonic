import React from 'react'

import { colors } from '../../../webchat/constants-styles'

export const AlertSvg = () => {
  return (
    <svg
      width='12'
      height='12'
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.00002 0.166748C2.78002 0.166748 0.166687 2.78008 0.166687 6.00008C0.166687 9.22008 2.78002 11.8334 6.00002 11.8334C9.22002 11.8334 11.8334 9.22008 11.8334 6.00008C11.8334 2.78008 9.22002 0.166748 6.00002 0.166748ZM6.58335 8.91675H5.41669V7.75008H6.58335V8.91675ZM6.58335 6.58341H5.41669V3.08341H6.58335V6.58341Z'
        fill={colors.red[700]}
      />
    </svg>
  )
}
