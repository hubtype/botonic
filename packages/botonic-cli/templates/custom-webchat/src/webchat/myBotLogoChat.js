import React from 'react'
import Logo from '../assets/bot-logo.png'
import { scriptUrl } from '../util'
export const MyBotLogoChat = () => {
  return (
    <img
      style={{
        width: 22,
        height: 24,
        margin: 'auto',
        position: 'absolute',
        top: 0,
        bottom: 0
      }}
      src={scriptUrl() + Logo}
    />
  )
}
