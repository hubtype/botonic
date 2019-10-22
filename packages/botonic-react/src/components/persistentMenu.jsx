import React from 'react'
import styled from 'styled-components'

const StyledPM = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  bottom: 0;
  text-align: center;
`
export const PersistentMenu = props => {
  return <StyledPM>{props.children}</StyledPM>
}

export default PersistentMenu
