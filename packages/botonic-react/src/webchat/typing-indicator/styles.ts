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

export const TypingContainer = styled.div`
  padding: 0px 8px 8px 8px;
`

interface TypingMsgWrapperProps {
  backgroundColor: string
}

export const TypingMsgWrapper = styled.div<TypingMsgWrapperProps>`
  will-change: transform;
  width: 44px;
  line-height: 0px;
  border-radius: 20px;
  padding: 8px 2px;
  text-align: center;
  display: block;
  margin: 8px;
  position: relative;
  animation: 2s ${bulge} infinite ease-out;
  background-color: ${props => props.backgroundColor};
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
