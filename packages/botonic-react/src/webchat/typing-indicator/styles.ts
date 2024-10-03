import styled, { keyframes } from 'styled-components'

const blink = keyframes`
  50% {
    opacity: 1;
  }
`

const bulge = keyframes`
  50% {
    transform: scale(1.05);
  }
`

export const TypingIndicatorWrapper = styled.div`
  will-change: transform;
  width: 44px;
  line-height: 0px;
  border-radius: 20px;
  padding: 8px 2px 8px;
  text-align: center;
  display: block;
  margin: 8px;
  position: relative;
  animation: 2s ${bulge} infinite ease-out;
`

export const Dot = styled.span`
  height: 6px;
  width: 6px;
  margin: 0 1px;
  background-color: #9e9ea1;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.4;
  &:nth-of-type(1) {
    animation: 1s ${blink} infinite 0.3333s;
  }
  &:nth-of-type(2) {
    animation: 1s ${blink} infinite 0.6666s;
  }
  &:nth-of-type(3) {
    animation: 1s ${blink} infinite 1s;
  }
`
