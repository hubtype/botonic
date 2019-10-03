import React from 'react'
import IntroImage from '../assets/intro-image.jpg'
import { scriptUrl } from '../util'
export const MyCustomIntroImage = () => {
  return <img height={'30%'} width={'100%'} src={scriptUrl() + IntroImage} />
}
