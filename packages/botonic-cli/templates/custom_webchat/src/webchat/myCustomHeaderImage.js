import React from 'react'
import Image from '../assets/header-logo.png'
import { scriptUrl } from '../util'
export const MyCustomHeaderImage = () => {
  return (
    <img
      style={{ width: '50%', height: '50%', marginLeft: 15, marginTop: 15 }}
      src={scriptUrl() + Image}
    />
  )
}
