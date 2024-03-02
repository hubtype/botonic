import { staticAsset } from '@botonic/react'
import React from 'react'

import Img from '../assets/intro-image.jpg'
export const CustomIntro = () => {
  return <img height={'50%'} width={'100%'} src={staticAsset(Img)} />
}
