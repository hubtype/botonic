import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.div`
  cursor: pointer;
  padding: 10px 10px;
  margin: 5px 10px 10px 10px;
  background: white;
  border: 1px solid black;
  font-size: 15px;
  color: black;
  text-align: center;
  white-space: normal;
  &:hover {
    opacity: 0.5;
  }
`

export const CustomButton = (props) => {
  return (
    <StyledButton>
      {props.children}
    </StyledButton>
  )
}
