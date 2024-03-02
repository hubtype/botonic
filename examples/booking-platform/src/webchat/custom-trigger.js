import React from 'react'
import styled, { keyframes } from 'styled-components'
import Hotel from '../assets/hotel.svg'
import { staticAsset } from '@botonic/react'

const AnimatedText = styled.div`
  top: 12px;
  right: -${(props) => props.widthText}px;
  position: absolute;
  animation: ${(props) => props.move} 4s;
  animation-delay: 1s;
  width: ${(props) => props.widthText}px;
  opacity: 0;
  color: #495e86;
  font-family: Arial;
  font-weight: 300;
  font-size: 13px;
  letter-spacing: 0.3px;
  line-height: 20px;
`

const AnimatedContainer = styled.div`
  cursor: pointer;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 16px;
  right: 16px;
  border-radius: 100px;
  height: 44px;
  width: 24px;
  border: 1px solid #d7d7d8;
  background-color: #ffffff;
  z-index: 1002;
  overflow: hidden;
  animation: ${(props) => props.resize} 4s;
  animation-delay: 1s;
  box-sizing: content-box;
  padding: 0px 10px;
`

export const CustomTrigger = () => {
  const widthText = 170
  const maxWidthResize = 15 + widthText

  let move = keyframes`
  0%   {right: -${widthText}px; opacity: 0;}
  20%  {right: -6px; opacity: 1;}
  80%  {right: -6px; opacity: 1;}
  100% {right: -${widthText}px; opacity: 0;}
`
  let resize = keyframes`
  0%   {width: 24px;}
  20%  {width: ${maxWidthResize}px;}
  80%  {width: ${maxWidthResize}px;}
  100% {width: 24px;}
`

  return (
    <AnimatedContainer resize={resize}>
      <img
        style={{
          height: 24,
          width: 24,
          marginLeft: '-2px',
        }}
        src={staticAsset(Hotel)}
      />
      <AnimatedText move={move} widthText={widthText}>
        Botonic Booking Platform
      </AnimatedText>
    </AnimatedContainer>
  )
}
