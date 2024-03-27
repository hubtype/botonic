import React, { useContext } from 'react'
import styled from 'styled-components'
import { WebchatContext } from '@botonic/react'
import { IconContainer } from './common'

const StyledButton = styled.div`
  cursor: pointer;
  height: 50px;
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: left;
  align-items: center;
  &:hover {
    opacity: 0.5;
  }
`

const Text = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: #000000;
  text-align: left;
  margin: 0;
`

export const CustomMenuButton = (props) => {
  const { sendInput, openWebview } = useContext(WebchatContext)

  const handleClick = (event) => {
    if (props.webview) openWebview(props.webview, props.params)
    else if (props.payload) {
      sendInput({
        type: 'text',
        data: String(props.label),
        payload: props.payload,
      })
    } else if (props.onClick) props.onClick()
  }

  return (
    <StyledButton
      onClick={(e) => handleClick(e)}
    >
      <IconContainer>
        <img
          style={{
            width: '19px',
          }}
          src={props.img}
        />
      </IconContainer>
      <Text>{props.label}</Text>
    </StyledButton>
  )
}
