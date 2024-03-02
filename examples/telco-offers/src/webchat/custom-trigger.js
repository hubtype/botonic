import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import Icon from '../assets/phone.svg'
import { staticAsset } from '@botonic/react'

const shake = keyframes`
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
`
const Container = styled.div`
  animation: ${props => !props.hover && shake} 0.82s
    cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  bottom: 50px;
  right: 50px;
  position: fixed;
  cursor: pointer;
`

export const CustomTrigger = () => {
  let [hover, setHover] = useState(false)
  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      hover={hover}
    >
      <img
        style={{
          width: '50px',
        }}
        src={staticAsset(Icon)}
      />
    </Container>
  )
}
