import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const Fade = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
`

const scaleUp = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.2); }
`

const scaleDown = keyframes`
  from { transform: scale(1.2); }
  to { transform: scale(1); }
`

export const Scale = styled.div`
  display: inline-block;
  animation-fill-mode: forwards;
  &:hover {
    animation: ${scaleUp} 0.2s forwards;
  }
  &:not():hover {
    animation: ${scaleDown} 0.2s forwards;
  }
`
