import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const Fade = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.8s forwards;
`
